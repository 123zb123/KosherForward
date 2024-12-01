import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const isOperational = 'isOperational' in err ? err.isOperational : false;

  logger.error(`Error: ${err.message}`, {
    error: err,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    isOperational,
    statusCode,
  });

  res.status(statusCode).json({
    status: 'error',
    message: isOperational ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}; 