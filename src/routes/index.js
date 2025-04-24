/**
 * API routes centralized configuration with versioning support
 */
const express = require('express');
const router = express.Router();
const taskRoutes = require('./taskRoutes');

// API v1 namespace for easier future version management
const v1Router = express.Router();

// Register v1 routes
v1Router.use('/tasks', taskRoutes);

// Mount v1 routes at /v1 path
router.use('/v1', v1Router);

// For backward compatibility, also mount at root path
router.use('/', v1Router);

module.exports = router;