import { Queue } from 'bullmq';
import { Queue as bullQueue} from 'bull';
import dotenv from 'dotenv';
dotenv.config();

export const jobQueue = new Queue('jobQueue', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});