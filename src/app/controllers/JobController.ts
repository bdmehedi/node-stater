import { Request, Response } from 'express';
import queue from '../../config/queue';

export const enqueueJob = async (req: Request, res: Response) => {
  const { data } = req.body;

  await queue.add('example-job', { data });
  res.status(200).json({ message: 'Job added to queue!', data });
};