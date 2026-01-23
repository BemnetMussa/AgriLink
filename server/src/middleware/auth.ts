import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        phoneNumber: string;
      };
    }
  }
}

export interface JWTPayload {
  id: string;
  role: UserRole;
  phoneNumber: string;
}

// Verify JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, phoneNumber: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    req.user = {
      id: user.id,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };

    next();
  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    // Provide more specific error messages for JWT errors
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token format');
    }
    
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired. Please login again');
    }
    
    if (error.name === 'NotBeforeError') {
      throw new AuthenticationError('Token not yet valid');
    }
    
    // Only log unexpected errors in development
    // Don't log expected authentication failures (missing/invalid tokens)
    if (process.env.NODE_ENV === 'development' && error.name !== 'JsonWebTokenError') {
      console.error('Authentication error:', error);
    }
    throw new AuthenticationError('Invalid or expired token');
  }
};

// Role-based authorization
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true, phoneNumber: true, isActive: true },
      });

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          role: user.role,
          phoneNumber: user.phoneNumber,
        };
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
};
