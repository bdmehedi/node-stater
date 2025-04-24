/**
 * TaskService - Contains all business logic for task operations
 */
const { Queue, Job } = require('bullmq');
const config = require('../config');
const { taskQueue } = require('../queue');

/**
 * Add a task to the queue
 * @param {Object} data - The task data
 * @param {Number} duration - Duration in seconds task should remain in Redis
 * @returns {Promise<Job>} The created job
 */
const addTask = async (data, duration) => {
  if (!data) {
    throw new Error('Task data is required');
  }
  
  // Use default duration if not provided
  const jobDuration = duration ? parseInt(duration) : 3600;
  
  // Create a job with TTL based on duration
  return await taskQueue.add('task', data, {
    jobId: `task-${Date.now()}`,
    removeOnComplete: false,
    removeOnFail: false,
    ttl: jobDuration * 1000  // Convert to milliseconds
  });
};

/**
 * Get all tasks/jobs from the queue
 * @returns {Promise<Array<Job>>} List of jobs
 */
const getAllTasks = async () => {
  return await taskQueue.getJobs();
};

/**
 * Get a task/job by ID
 * @param {String} id - The job ID
 * @returns {Promise<Job|null>} The job or null if not found
 */
const getTaskById = async (id) => {
  return await taskQueue.getJob(id);
};

/**
 * Remove a task/job from the queue
 * @param {String} id - The job ID
 * @returns {Promise<void>}
 * @throws {Error} If job is not found
 */
const removeTask = async (id) => {
  const job = await getTaskById(id);
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  await job.remove();
  return true;
};

module.exports = {
  addTask,
  getAllTasks,
  getTaskById,
  removeTask
};