/**
 * Global error handling middleware
 * Provides consistent error responses across the application
 */
const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error details for server-side debugging
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  // Return standardized error response
  res.status(statusCode).json({
    status: 'error',
    message,
    // Include stack trace in development, but not in production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * Custom error class with status code support
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Utility function to wrap async route handlers
 * Eliminates the need for try/catch blocks in controllers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  AppError,
  asyncHandler
};