import { logger } from './logger';

export const setupProcessHandlers = () => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', {
      error: error,
      stack: error.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection:', {
      reason: reason,
      stack: reason?.stack,
    });
    process.exit(1);
  });
}; 