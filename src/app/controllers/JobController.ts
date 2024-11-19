import { Request, Response } from 'express';
import queue from '../../config/queue';

export const enqueueJob = async (req: Request, res: Response) => {
  const { data } = req.body;

  // Add job to the queue
  await queue.add('example-job', { data });

  res.status(200).json({
    message: 'Job successfully added to the queue.',
    data,
  });
};