import { z } from 'zod';
import { ValidationError } from './errors';

// Common validation schemas
export const phoneNumberSchema = z
  .string()
  .regex(/^9\d{8}$/, 'Phone number must be 9 digits starting with 9');

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Validation middleware
export const validate = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => err.message).join(', ');
        throw new ValidationError(messages);
      }
      next(error);
    }
  };
};

// Validate query parameters
export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: any, res: any, next: any) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => err.message).join(', ');
        throw new ValidationError(messages);
      }
      next(error);
    }
  };
};
