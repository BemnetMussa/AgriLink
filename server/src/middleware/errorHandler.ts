import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Log error
  logger.error('Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err);
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return sendError(res, 'Duplicate entry. This record already exists.', 409, err);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Record not found.', 404, err);
    }
    return sendError(res, 'Database error occurred.', 500, err);
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return sendError(res, 'Invalid data provided.', 400, err);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token.', 401, err);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired.', 401, err);
  }

  // Default error
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500,
    err
  );
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): Response => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};
