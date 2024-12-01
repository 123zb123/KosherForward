import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { logger, stream } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import { setupProcessHandlers } from './utils/processHandlers';
import { AppError } from './utils/errors';

// Setup process handlers for uncaught exceptions and unhandled rejections
setupProcessHandlers();

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const isTesting = process.env.NODE_ENV === 'test';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add morgan middleware with our custom stream (skip in test mode unless DEBUG is set)
if (!isTesting || process.env.DEBUG) {
  app.use(morgan('combined', { stream }));
}

// Test route for errors (only in test environment)
if (process.env.NODE_ENV === 'test') {
  app.get('/api/error-test', () => {
    throw new Error('Test error');
  });
}

// Test route
app.get('/api/health', (req: Request, res: Response) => {
  logger.info('Health check endpoint called', {
    timestamp: new Date().toISOString(),
    endpoint: '/api/health'
  });
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  logger.info(`Server is running`, {
    port,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    logger.info('Server closed. Process terminated.');
    process.exit(0);
  });
});

export { app, server }; 