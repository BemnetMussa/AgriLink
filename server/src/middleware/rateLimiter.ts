import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Helper to send JSON error response
const sendJsonError = (res: Response, message: string, statusCode: number = 429) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: message,
  });
};

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    sendJsonError(res, 'Too many requests from this IP, please try again later.', 429);
  },
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    sendJsonError(res, 'Too many authentication attempts, please try again later.', 429);
  },
});

// OTP rate limiter - more lenient for better UX
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // Allow 2 OTP requests per minute (increased from 1)
  message: 'Please wait before requesting another OTP.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    sendJsonError(res, 'Please wait before requesting another OTP. You can request a new OTP in a few seconds.', 429);
  },
});
