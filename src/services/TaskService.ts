/**
 * TaskService - Contains all business logic for task operations
 */
import { Job, JobsOptions } from 'bullmq';
import { AppError } from '../middleware/errorHandler';
import { taskQueue } from '../queue';
import { TaskData } from '../types';

/**
 * Add a task to the queue
 * @param data - The task data
 * @param duration - Duration in seconds task should remain in Redis
 * @returns The created job
 */
const addTask = async (data: TaskData, duration?: number): Promise<Job<TaskData>> => {
  if (!data) {
    throw new AppError('Task data is required', 400);
  }
  
  // Use default duration if not provided
  const jobDuration = duration ? parseInt(duration.toString()) : 3600;
  
  // Create a job with options including duration
  const jobOptions: JobsOptions = {
    jobId: `task-${Date.now()}`,
    removeOnComplete: false,
    removeOnFail: false,
  };
  
  // BullMQ doesn't directly support TTL in JobsOptions type
  // We need to add it to the options object manually
  (jobOptions as any).ttl = jobDuration * 1000;  // Convert to milliseconds
  
  // Create a job with settings based on duration
  return await taskQueue.add('task', data, jobOptions);
};

/**
 * Get all tasks/jobs from the queue
 * @returns List of jobs
 */
const getAllTasks = async (): Promise<Job<TaskData>[]> => {
  return await taskQueue.getJobs();
};

/**
 * Get a task/job by ID
 * @param id - The job ID
 * @returns The job or null if not found
 */
const getTaskById = async (id: string): Promise<Job<TaskData> | null> => {
  return await taskQueue.getJob(id);
};

/**
 * Remove a task/job from the queue
 * @param id - The job ID
 * @returns True if successful
 * @throws Error if job is not found
 */
const removeTask = async (id: string): Promise<boolean> => {
  const job = await getTaskById(id);
  
  if (!job) {
    throw new AppError('Job not found', 404);
  }
  
  await job.remove();
  return true;
};

export default {
  addTask,
  getAllTasks,
  getTaskById,
  removeTask
};