/**
 * Core types for the BullMQ Task Scheduler
 */

// Redis connection configuration
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  maxRetriesPerRequest?: number | null;
  enableReadyCheck?: boolean;
}

// Server configuration
export interface ServerConfig {
  port: number;
  environment: string;
  showRequestLogs: boolean;
}

// Queue configuration
export interface QueueConfig {
  name: string;
  options: {
    defaultJobOptions: {
      removeOnComplete: boolean;
      removeOnFail: boolean;
    }
  }
}

// Security configuration
export interface SecurityConfig {
  apiToken: string;
}

// Dashboard configuration
export interface DashboardConfig {
  basePath: string;
}

export interface JobsConfig {
  removeOnComplete: object;
  removeOnFail: object;
  attempts: number;
  backoff: object;
  timeout: number;
  limiter: object;
}

// Application configuration
export interface AppConfig {
  server: ServerConfig;
  redis: RedisConfig;
  queue: QueueConfig;
  security: SecurityConfig;
  dashboard: DashboardConfig;
  jobs: JobsConfig;
}

// Task job data
export interface TaskData {
  [key: string]: any;
}

// Job result
export interface JobResult {
  status: string;
  startedAt: string;
  metadata?: {
    processedBy: string;
    [key: string]: any;
  };
}

// API response
export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
  results?: number;
  stack?: string;
}