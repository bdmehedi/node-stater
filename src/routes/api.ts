import { Router } from 'express';
import { enqueueJob } from '../app/controllers/JobController';

const router = Router();

router.post('/enqueue', enqueueJob);

export default router;