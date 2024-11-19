import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import express from 'express';
import router from './routes/api';

const app = express();

// Middleware
app.use(express.json());

// API Routes
app.use('/api', router);

// BullMQ Queues (import your queue instances here)
import queue from './config/queue';

// Bull Board Integration
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/dashboard'); // Set the base path for the dashboard

createBullBoard({
  queues: [new BullMQAdapter(queue as any)], // Add your BullMQ queues here
  serverAdapter,
});

app.use('/dashboard', serverAdapter.getRouter()); // Expose the dashboard route

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`BullMQ Dashboard available at http://localhost:${PORT}/dashboard`);
});