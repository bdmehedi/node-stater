/**
 * TaskController - Handles all task-related operations
 * Uses service layer for business logic and asyncHandler for error handling
 */
const TaskService = require('../services/TaskService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * Add a new task to the queue
 */
const createTask = asyncHandler(async (req, res) => {
  const { data, duration } = req.body;
  
  // Use service layer to add task
  const job = await TaskService.addTask(data, duration);
  
  // Format and return response
  res.status(201).json({
    status: 'success',
    message: 'Task added to queue successfully',
    data: {
      jobId: job.id,
      taskData: job.data,
      duration: `${duration || 3600} seconds`,
    }
  });
});

/**
 * Get all tasks from the queue
 */
const getAllTasks = asyncHandler(async (req, res) => {
  // Use service layer to get all tasks
  const jobs = await TaskService.getAllTasks();
  
  // Format and return response
  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      tasks: jobs
    }
  });
});

/**
 * Remove a task from the queue by ID
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Use service layer to remove task
  await TaskService.removeTask(id);
  
  // Return success response
  res.status(200).json({
    status: 'success',
    message: `Job ${id} removed successfully`
  });
});

module.exports = {
  createTask,
  getAllTasks,
  deleteTask
};