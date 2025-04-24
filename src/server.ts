/**
 * Main server configuration for the BullMQ Task Scheduler
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import http from 'http';

// Import application components
import { taskQueue } from './queue';
import routes from './routes';
import config from './config';
import { errorHandler } from './middleware/errorHandler';
import { ApiResponse } from './types';

// Create Express server
const app = express();

// Apply common middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Set up Bull Board (dashboard)
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(config.dashboard.basePath);

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(taskQueue)],
  serverAdapter: serverAdapter,
});

// Mount the dashboard
app.use(config.dashboard.basePath, serverAdapter.getRouter());

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse = { 
    status: 'success', 
    data: { 
      timestamp: new Date().toISOString() 
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
  console.log('Shutting down gracefully...');
  // Close any open connections here
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
const startServer = (): http.Server => {
  const server = app.listen(config.server.port, () => {
    console.log(`Server running in ${config.server.environment} mode on port ${config.server.port}`);
    console.log(`Bull Dashboard available at http://localhost:${config.server.port}${config.dashboard.basePath}`);
  });
  
  return server;
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export the app and startServer function
export { app, startServer };