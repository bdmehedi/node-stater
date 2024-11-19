import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Laravel-style Node.js app!');
});

export default router;