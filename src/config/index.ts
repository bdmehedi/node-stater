/**
 * Application configuration module
 * Centralizes all configuration settings and environment variables
 */
import dotenv from 'dotenv';
import { AppConfig } from '../types';

dotenv.config();

const config: AppConfig = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development',
    showRequestLogs: process.env.SHOW_REQUEST_LOGS === 'true',
  },
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // BullMQ requires this to be null
    enableReadyCheck: false,
  },
  
  // Queue configuration
  queue: {
    name: 'tasks',
    options: {
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
      }
    }
  },
  
  // Security configuration
  security: {
    apiToken: process.env.API_TOKEN || 'development-token',
  },
  
  // Dashboard configuration
  dashboard: {
    basePath: '/admin/queues',
  },

  // Jobs settings
  jobs: {
    removeOnComplete: {
      age: 5 * 3600, // 5 hours in seconds
      count: 200,
    },
    removeOnFail: {
      age: 5 * 3600, // 5 hours in seconds
      count: 200,
    },
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    timeout: parseInt(process.env.JOB_TIMEOUT || '') || 60000, // 1 minute
    limiter: {
      max: 1000,
      duration: 1000,
      groupKey: 'task',
      group: 'task',
    },
  },
};

export default config;