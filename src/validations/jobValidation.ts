import { body, ValidationChain } from 'express-validator';

export const enqueueJobValidation: ValidationChain[] = [
  body('data')
    .notEmpty()
    .withMessage('The data field is required.')
    .isString()
    .withMessage('The data field must be a string.'),
];