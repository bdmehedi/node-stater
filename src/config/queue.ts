import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const queue = new Queue(process.env.QUEUE_NAME || 'default', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

export default queue;