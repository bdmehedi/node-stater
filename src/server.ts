import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import apiRoutes from './routes/api';
import webRoutes from './routes/web';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);
app.use('/', webRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});