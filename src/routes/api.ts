import { Router } from 'express';
import { enqueueJob } from '../app/controllers/JobController';
import { handleValidationErrors } from '../middleware/validationMiddleware';
import { enqueueJobValidation } from '../validations/jobValidation';

const router = Router();

// Job Queue Routes with validation
router.post('/enqueue', enqueueJobValidation, handleValidationErrors, enqueueJob);

export default router;