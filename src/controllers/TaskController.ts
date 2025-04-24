/**
 * TaskController - Handles all task-related operations
 * Uses service layer for business logic and asyncHandler for error handling
 */
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import TaskService from '../services/TaskService';
import { ApiResponse } from '../types';

/**
 * Add a new task to the queue
 */
const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { data, duration } = req.body;
  
  // Use service layer to add task
  const job = await TaskService.addTask(data, duration);
  
  // Format and return response
  const response: ApiResponse = {
    status: 'success',
    message: 'Task added to queue successfully',
    data: {
      jobId: job.id,
      taskData: job.data,
      duration: `${duration || 3600} seconds`,
    }
  };
  
  res.status(201).json(response);
});

/**
 * Get all tasks from the queue
 */
const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  // Use service layer to get all tasks
  const jobs = await TaskService.getAllTasks();
  
  // Format and return response
  const response: ApiResponse = {
    status: 'success',
    results: jobs.length,
    data: {
      tasks: jobs
    }
  };
  
  res.status(200).json(response);
});

/**
 * Remove a task from the queue by ID
 */
const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Use service layer to remove task
  await TaskService.removeTask(id);
  
  // Return success response
  const response: ApiResponse = {
    status: 'success',
    message: `Job ${id} removed successfully`
  };
  
  res.status(200).json(response);
});

export default {
  createTask,
  getAllTasks,
  deleteTask
};