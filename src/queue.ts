/**
 * Queue configuration for BullMQ
 */
import { Queue, ConnectionOptions } from 'bullmq';
import config from './config';
import { RedisConfig } from './types';

// Redis connection configuration from centralized config
const connection: ConnectionOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
  enableReadyCheck: config.redis.enableReadyCheck,
};

// Create and export the queue
const taskQueue = new Queue(config.queue.name, { 
  connection,
  defaultJobOptions: config.queue.options.defaultJobOptions
});

export {
  taskQueue,
  connection
};