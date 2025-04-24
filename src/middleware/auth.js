/**
 * Authentication middleware to verify API tokens
 */
const config = require('../config');
const { AppError } = require('./errorHandler');

const authMiddleware = (req, res, next) => {
  // Get token from request header
  const token = req.headers['x-api-token'];
  
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

module.exports = authMiddleware;