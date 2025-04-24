/**
 * Task routes definition with versioning support
 */
import express, { Router } from 'express';
import TaskController from '../controllers/TaskController';
import authMiddleware from '../middleware/auth';

const router: Router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Task routes
router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.delete('/:id', TaskController.deleteTask);

export default router;