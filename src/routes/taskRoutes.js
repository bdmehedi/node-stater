/**
 * Task routes definition with versioning support
 */
const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Task routes
router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;