import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { ValidationError, AuthenticationError } from '../utils/errors';
import { z } from 'zod';
import { phoneNumberSchema, passwordSchema } from '../utils/validation';

// Validation schemas
const requestOTPSchema = z.object({
  phoneNumber: phoneNumberSchema,
  purpose: z.enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'PHONE_VERIFICATION']),
});

const verifyOTPSchema = z.object({
  phoneNumber: phoneNumberSchema,
  code: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'PHONE_VERIFICATION']),
});

const registerSchema = z.object({
  phoneNumber: phoneNumberSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional(),
  password: passwordSchema.optional(),
  role: z.enum(['FARMER', 'BUYER']).optional(),
  language: z.enum(['english', 'amharic', 'oromo']).optional(),
});

const loginSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: passwordSchema,
});

const resetPasswordSchema = z.object({
  phoneNumber: phoneNumberSchema,
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: passwordSchema,
});

export class AuthController {
  // Request OTP
  async requestOTP(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = requestOTPSchema.parse(req.body);
      const otp = await authService.generateOTP(data.phoneNumber, data.purpose as any);
      return sendSuccess(res, { otp: process.env.NODE_ENV === 'development' ? otp : undefined }, 'OTP sent successfully');
    } catch (error) {
      next(error);
    }
  }

  // Verify OTP
  async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = verifyOTPSchema.parse(req.body);
      const user = await authService.verifyOTP(data.phoneNumber, data.code, data.purpose as any);
      const tokens = await authService.generateTokens(user);
      return sendSuccess(res, { user, ...tokens }, 'OTP verified successfully');
    } catch (error) {
      next(error);
    }
  }

  // Register
  async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = registerSchema.parse(req.body);
      const user = await authService.register(data);
      const tokens = await authService.generateTokens(user);
      return sendSuccess(res, { user, ...tokens }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  // Login
  async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data.phoneNumber, data.password);
      return sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = refreshTokenSchema.parse(req.body);
      const tokens = await authService.refreshToken(data.refreshToken);
      return sendSuccess(res, tokens, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  // Logout
  async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      return sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const data = changePasswordSchema.parse(req.body);
      await authService.changePassword(req.user.id, data.oldPassword, data.newPassword);
      return sendSuccess(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  // Reset password
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(data.phoneNumber, data.otp, data.newPassword);
      return sendSuccess(res, null, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
