/**
 * Standalone worker process for BullMQ task processing
 * Run this file with Node.js to start a dedicated worker process
 */
import dotenv from 'dotenv';
import config from './src/config';
import worker from './src/worker';

dotenv.config();

console.log(`[WORKER] Starting BullMQ worker in ${config.server.environment} mode`);
console.log(`[WORKER] Process ID: ${process.pid}`);
console.log(`[WORKER] Connected to Redis at ${config.redis.host}:${config.redis.port}`);
console.log(`[WORKER] Processing queue: ${config.queue.name}`);
console.log(`[WORKER] Concurrency: ${process.env.WORKER_CONCURRENCY || 10}`);
console.log(`[WORKER] Press Ctrl+C to stop`);

// The worker is already initialized when imported

export default worker;