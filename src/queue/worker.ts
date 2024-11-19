import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import { ExampleJob } from '../app/jobs/ExampleJob';

dotenv.config();

const worker = new Worker(
  process.env.QUEUE_NAME || 'default',
  async (job) => {
    await ExampleJob(job);
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});