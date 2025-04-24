/**
 * Queue configuration for BullMQ
 */
import { ConnectionOptions, Queue } from 'bullmq';
import config from './config';

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
    connection, taskQueue
};
