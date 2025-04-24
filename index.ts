/**
 * Main application entry point
 * Starts both the Express server and BullMQ worker
 */
import dotenv from 'dotenv';
import config from './src/config';
import { app, startServer } from './src/server';
import worker from './src/worker';

dotenv.config();

// Improve uncaught exception handling
process.on('uncaughtException', (error: Error) => {
  console.error('[FATAL] Uncaught exception:', error);
  // Exit with error code to enable restart by process manager
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
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
  
  // Start the server
  const server = startServer();
}

// Export for testing
export { app, worker };
