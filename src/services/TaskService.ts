/**
 * TaskService - Contains all business logic for task operations
 */
import { Job, JobsOptions } from 'bullmq';
import { AppError } from '../middleware/errorHandler';
import { taskQueue } from '../queue';
import { TaskData } from '../types';
import config from '../config/index';

/**
 * Add a task to the queue
 * @param data - The task data
 * @param jobId - Optional custom job ID for replacement
 * @param delay - Optional delay in milliseconds before the job is processed
 * @returns The created job
 */
const addTask = async (
  data: TaskData, 
  jobId?: string,
  delay?: number
): Promise<Job<TaskData>> => {
  if (!data) {
    throw new AppError('Task data is required', 400);
  }
  
  // Create a job with options including duration
  const jobOptions: JobsOptions = {
    jobId: jobId || `task-${Date.now()}`,
    removeOnComplete: config.jobs.removeOnComplete,
    removeOnFail: config.jobs.removeOnFail,
  };

  // Remove existing job if jobId is provided
  if (jobId) {
    const existingJob = await taskQueue.getJob(jobId);
    if (existingJob) {
      await existingJob.remove();
    }
  }
  
  // Add delay if provided
  if (delay && delay > 0) {
    jobOptions.delay = delay;
  }
  
  // Create a job with settings based on duration and delay
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