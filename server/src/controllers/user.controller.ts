import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticationError } from '../utils/errors';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  language: z.enum(['english', 'amharic', 'oromo']).optional(),
  avatar: z.string().url().optional(),
  role: z.enum(['FARMER', 'BUYER']).optional(), // Allow role update during profile setup
});

const updateFarmerProfileSchema = z.object({
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const updateBuyerProfileSchema = z.object({
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  address: z.string().optional(),
});

const submitVerificationSchema = z.object({
  documents: z.array(z.string().url()).min(1, 'At least one document is required'),
});

export class UserController {
  // Get current user
  async getMe(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const user = await userService.getUserById(req.user.id);
      return sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      return sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update profile
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const data = updateProfileSchema.parse(req.body);
      const user = await userService.updateProfile(req.user.id, data);
      return sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update farmer profile
  async updateFarmerProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const data = updateFarmerProfileSchema.parse(req.body);
      const profile = await userService.updateFarmerProfile(req.user.id, data);
      return sendSuccess(res, profile, 'Farmer profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Submit verification documents
  async submitVerification(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const data = submitVerificationSchema.parse(req.body);
      const profile = await userService.submitVerificationDocuments(req.user.id, data.documents);
      return sendSuccess(res, profile, 'Verification documents submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update buyer profile
  async updateBuyerProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const data = updateBuyerProfileSchema.parse(req.body);
      const profile = await userService.updateBuyerProfile(req.user.id, data);
      return sendSuccess(res, profile, 'Buyer profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get user stats
  async getUserStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const stats = await userService.getUserStats(req.user.id);
      return sendSuccess(res, stats, 'Stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Verify farmer
  async verifyFarmer(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { farmerId } = req.params;
      const profile = await userService.verifyFarmer(farmerId, req.user.id);
      return sendSuccess(res, profile, 'Farmer verified successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Reject farmer verification
  async rejectFarmerVerification(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { farmerId } = req.params;
      const { reason } = req.body;
      const profile = await userService.rejectFarmerVerification(farmerId, req.user.id, reason);
      return sendSuccess(res, profile, 'Farmer verification rejected');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
