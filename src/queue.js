/**
 * Queue configuration for BullMQ
 */
const { Queue } = require('bullmq');
const config = require('./config');

// Redis connection configuration from centralized config
const connection = {
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

module.exports = {
  taskQueue,
  connection
};