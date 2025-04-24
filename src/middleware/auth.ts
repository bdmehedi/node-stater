/**
 * Authentication middleware to verify API tokens
 */
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { AppError } from './errorHandler';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from request header
  const token = req.headers['x-api-token'] as string;
  
  // Check if token exists
  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }
  
  // Validate token
  if (token !== config.security.apiToken) {
    return next(new AppError('Access denied. Invalid token.', 403));
  }
  
  // If token is valid, proceed to the next middleware/controller
  next();
};

export default authMiddleware;