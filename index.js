/**
 * Main application entry point
 * Starts both the Express server and BullMQ worker
 */
require('dotenv').config();
const config = require('./src/config');
const server = require('./src/server');
const worker = require('./src/worker');

// Improve uncaught exception handling
process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught exception:', error);
  // Exit with error code to enable restart by process manager
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled rejection at:', promise, 'reason:', reason);
  // Exit with error code to enable restart by process manager
  process.exit(1);
});

// Start the server if this is the main module
if (require.main === module) {
  // Log startup information
  console.log(`[APP] BullMQ Task Scheduler starting in ${config.server.environment} mode`);
  console.log(`[APP] Node.js version: ${process.version}`);
  console.log(`[APP] Process ID: ${process.pid}`);
  console.log(`[APP] Redis connection: ${config.redis.host}:${config.redis.port}`);
  console.log('[APP] Press Ctrl+C to stop');
  
  // Actually start the server - this line was missing
  const expressServer = server.startServer ? server.startServer() : server;
}

// Export for testing
module.exports = { server, worker };