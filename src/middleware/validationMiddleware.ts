import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => {
      // Type guard to ensure `param` exists
      if ('path' in error) {
        return {
          field: error.path, // Field causing the error
          message: error.msg, // Error message
        };
      }
      return { field: 'unknown', message: error.msg };
    });

    res.status(422).json({
      message: 'Validation Error',
      errors: formattedErrors,
    });
    return; // Stop further middleware execution
  }

  next(); // Proceed if no validation errors
};