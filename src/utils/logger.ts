/**
 * Logger configuration with environment-specific settings
 */
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment 
    ? { target: 'pino-pretty', options: { colorize: true } } 
    : undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  // Don't log sensitive data in production
  redact: {
    paths: ['req.headers.authorization', 'req.headers["x-api-token"]', '*.password'],
    censor: '[REDACTED]'
  }
});

export default logger;