/**
 * Worker configuration for processing BullMQ jobs
 */
import { Job, Worker } from 'bullmq';
import dotenv from 'dotenv';
import config from './config';
import { connection } from './queue';
import { JobResult, TaskData } from './types';
import logger from './utils/logger';

dotenv.config();

// Create a worker with improved logging and error handling
const worker = new Worker<TaskData, JobResult>(config.queue.name, async (job: Job<TaskData, JobResult>) => {
  try {
    // Log job start with structured logging
    logger.info({
      jobId: job.id,
      queueName: config.queue.name,
      data: job.data,
      timestamp: new Date().toISOString()
    }, `[WORKER] Processing job ${job.id}`);
    
    // ----------------
    // Implement your actual job processing logic here
    // For example:
    // 
    // 1. Extract data from the job
    const jobData = job.data;
    logger.debug({ jobData }, `[WORKER] Processing data for job ${job.id}`);
    
    // 2. Perform your business logic
    // await someBusinessLogicFunction(jobData);
    
    // 3. Update job progress (optional)
    await job.updateProgress(50);
    
    // 4. Simulate some processing time
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // ----------------
    
    logger.info(`[WORKER] Job ${job.id} is running. Will remain active until removed.`);
    
    // Return a result that indicates the job is now running
    return { 
      status: 'running', 
      startedAt: new Date().toISOString(),
      metadata: {
        processedBy: 'worker-' + process.pid
      }
    };
  } catch (error) {
    // Handle job-specific errors
    const err = error as Error;
    logger.error({
      jobId: job.id,
      error: {
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
      }
    }, `[WORKER] Error processing job ${job.id}`);
    
    throw error; // Re-throw to trigger the 'failed' event
  }
}, { 
  connection,
  // Set concurrency to limit number of concurrent jobs
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '10'),
  // Add some delay between processing jobs to reduce CPU usage
  limiter: {
    max: parseInt(process.env.WORKER_RATE_LIMIT_MAX || '5'),
    duration: parseInt(process.env.WORKER_RATE_LIMIT_DURATION || '1000')
  },
  // Enable auto-resuming of interrupted jobs on restart
  autorun: true,
  // In production, set a shorter stalledInterval to detect stalled jobs more quickly
  stalledInterval: process.env.NODE_ENV === 'production' ? 30000 : 60000,
  // Set a maximum number of retries for failed jobs
  maxStalledCount: 3
});

// Event handlers with structured logging
worker.on('completed', (job: Job<TaskData, JobResult>, result: JobResult) => {
  logger.info({
    jobId: job.id,
    result,
    timestamp: new Date().toISOString()
  }, `[WORKER] Job ${job.id} completed`);
});

worker.on('failed', (job: Job<TaskData, JobResult> | undefined, error: Error) => {
  if (job) {
    logger.error({
      jobId: job.id,
      error: {
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      },
      timestamp: new Date().toISOString()
    }, `[WORKER] Job ${job.id} failed`);
  } else {
    logger.error({
      error: {
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      },
      timestamp: new Date().toISOString()
    }, '[WORKER] Job failed');
  }
});

worker.on('error', (error: Error) => {
  logger.error({
    error: {
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    },
    timestamp: new Date().toISOString()
  }, '[WORKER] Worker error');
});

// Additional events for better monitoring
worker.on('stalled', (jobId: string) => {
  logger.warn({ jobId }, '[WORKER] Job stalled');
});

worker.on('progress', (job: Job<TaskData, JobResult>, progress: any) => {
  logger.debug({ jobId: job.id, progress }, '[WORKER] Job progress updated');
});

// Graceful shutdown handler
const gracefulShutdown = async (): Promise<void> => {
  logger.info('[WORKER] Shutting down gracefully...');
  
  // Gracefully close the worker
  try {
    await worker.close();
    logger.info('[WORKER] Closed successfully');
  } catch (err) {
    logger.error({ err }, '[WORKER] Error during shutdown');
  }
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions specific to the worker
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, '[WORKER] Uncaught exception');
  // Exit with non-zero code to indicate error
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, '[WORKER] Unhandled rejection');
  // Exit with non-zero code to indicate error
  process.exit(1);
});

export default worker;