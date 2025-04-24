/**
 * Main server configuration for the BullMQ Task Scheduler
 */
const express = require('express');
const cors = require('cors');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

// Import application components
const { taskQueue } = require('./queue');
const routes = require('./routes');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');

// Create Express server
const app = express();

// Apply common middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
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
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown function
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  // Close any open connections here
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
const startServer = () => {
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
module.exports = { app, startServer };