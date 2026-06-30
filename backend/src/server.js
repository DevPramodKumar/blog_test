import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import uploadRoutes from './routes/upload.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { uploadsDir } from './middleware/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    success: dbReady,
    message: dbReady ? 'Blog API is running' : 'Database not connected',
    database: dbReady ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('FATAL: MongoDB connection failed:', err.message);
    console.error('Check MONGODB_URI in backend/.env and ensure MongoDB is running.');
    process.exit(1);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`FATAL: Port ${PORT} is already in use. Stop the other process first:`);
      console.error(`  sudo ss -tlnp | grep :${PORT}`);
      console.error(`  pm2 list`);
    }
    process.exit(1);
  });
};

startServer();
