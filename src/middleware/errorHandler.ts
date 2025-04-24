/**
 * Global error handling middleware
 * Provides consistent error responses across the application
 */
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Custom error class with status code support
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  // Set default status code and message
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error details for server-side debugging
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  // Return standardized error response
  const response: ApiResponse = {
    status: 'error',
    message,
    // Include stack trace in development, but not in production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };
  
  res.status(statusCode).json(response);
};

/**
 * Utility function to wrap async route handlers
 * Eliminates the need for try/catch blocks in controllers
 */
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};