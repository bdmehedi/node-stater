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
  },
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 10,
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
  }
};

export default config;