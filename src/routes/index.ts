/**
 * API routes centralized configuration with versioning support
 */
import express, { Router } from 'express';
import taskRoutes from './taskRoutes';

const router: Router = express.Router();

// API v1 namespace for easier future version management
const v1Router: Router = express.Router();

// Register v1 routes
v1Router.use('/tasks', taskRoutes);

// Mount v1 routes at /v1 path
router.use('/v1', v1Router);

// For backward compatibility, also mount at root path
router.use('/', v1Router);

export default router;