/**
 * Main server configuration for the BullMQ Task Scheduler
 */
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import http from 'http';

// Import application components
import config from './config';
import { errorHandler } from './middleware/errorHandler';
import { taskQueue } from './queue';
import routes from './routes';
import { ApiResponse } from './types';
import logger from './utils/logger';

// Create Express server
const app = express();

// Apply common middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply security middleware
app.use(helmet());

// Apply rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Add request logging
if (config.server.showRequestLogs) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info({
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent')
    }, 'Incoming request\n');
    
    // Log response when finished
    res.on('finish', () => {
      logger.info({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
      }, 'Request completed');
    });

    console.log('\n');
    
    next();
  });
}

// Set up Bull Board (dashboard)
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(config.dashboard.basePath);

createBullBoard({
  queues: [new BullMQAdapter(taskQueue)],
  serverAdapter: serverAdapter,
});

// Create a router for the dashboard
const dashboardRouter = express.Router();

// Add authentication middleware in production
if (process.env.NODE_ENV === 'production') {
  // Define middleware with void return type
  dashboardRouter.use((req, res, next): void => {
    // Simple auth check for the dashboard
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="BullMQ Dashboard"');
      res.status(401).send('Authentication required for BullMQ Dashboard');
      return;
    }
    
    // Verify credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    if (username !== (process.env.DASHBOARD_USER || 'admin') || 
        password !== (process.env.DASHBOARD_PASS || 'admin')) {
      res.status(401).send('Invalid credentials');
      return;
    }
    
    next();
  });
}

// Mount the dashboard adapter to the router
dashboardRouter.use('/', serverAdapter.getRouter());

// Mount the router to the app
app.use(config.dashboard.basePath, dashboardRouter);

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse = { 
    status: 'success', 
    data: { 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodejs: process.version
    }
  };
  res.status(200).json(response);
});

// Not found handler
app.use((req: Request, res: Response) => {
  const response: ApiResponse = {
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  };
  res.status(404).json(response);
});

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown function
const gracefulShutdown = async (): Promise<void> => {
  logger.info('Shutting down gracefully...');
  // Close any open connections here
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
const startServer = (): http.Server => {
  const server = app.listen(config.server.port, () => {
    // logger.info(`Server running in ${config.server.environment} mode on port ${config.server.port}`);
    // logger.info(`Bull Dashboard available at http://localhost:${config.server.port}${config.dashboard.basePath}`);
  });
  
  return server;
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export the app and startServer function
export { app, startServer };
