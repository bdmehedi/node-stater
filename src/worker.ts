/**
 * Worker configuration for processing BullMQ jobs
 */
import { Worker, Job } from 'bullmq';
import dotenv from 'dotenv';
import { connection } from './queue';
import config from './config';
import { TaskData, JobResult } from './types';

dotenv.config();

// Create a worker with improved logging and error handling
const worker = new Worker<TaskData, JobResult>(config.queue.name, async (job: Job<TaskData, JobResult>) => {
  try {
    // Log job start with structured logging
    console.log(`[WORKER] Processing job ${job.id}`, {
      jobId: job.id,
      queueName: config.queue.name,
      data: job.data,
      timestamp: new Date().toISOString()
    });
    
    // ----------------
    // Implement your actual job processing logic here
    // For example:
    // 
    // 1. Extract data from the job
    const jobData = job.data;
    console.log(`[WORKER] Processing data:`, jobData);
    
    // 2. Perform your business logic
    // await someBusinessLogicFunction(jobData);
    
    // 3. Update job progress (optional)
    await job.updateProgress(50);
    
    // 4. Simulate some processing time
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // ----------------
    
    console.log(`[WORKER] Job ${job.id} is running. Will remain active until removed.`);
    
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
    console.error(`[WORKER] Error processing job ${job.id}:`, error);
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
  autorun: true
});

// Event handlers with structured logging
worker.on('completed', (job: Job<TaskData, JobResult>, result: JobResult) => {
  console.log(`[WORKER] Job ${job.id} completed`, {
    jobId: job.id,
    result,
    timestamp: new Date().toISOString()
  });
});

worker.on('failed', (job: Job<TaskData, JobResult> | undefined, error: Error) => {
  if (job) {
    console.error(`[WORKER] Job ${job.id} failed`, {
      jobId: job.id,
      error: {
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString()
    });
  } else {
    console.error('[WORKER] Job failed', {
      error: {
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString()
    });
  }
});

worker.on('error', (error: Error) => {
  console.error('[WORKER] Worker error', {
    error: {
      message: error.message,
      stack: error.stack
    },
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handler
const gracefulShutdown = async (): Promise<void> => {
  console.log('[WORKER] Shutting down gracefully...');
  await worker.close();
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default worker;