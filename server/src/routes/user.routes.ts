import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User profile routes
router.get('/me', userController.getMe.bind(userController));
router.get('/stats', userController.getUserStats.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));

// Farmer profile routes
router.put('/farmer/profile', authorize(UserRole.FARMER), userController.updateFarmerProfile.bind(userController));
router.post('/farmer/verification', authorize(UserRole.FARMER), userController.submitVerification.bind(userController));

// Buyer profile routes
router.put('/buyer/profile', authorize(UserRole.BUYER), userController.updateBuyerProfile.bind(userController));

// Admin routes
router.post('/farmer/:farmerId/verify', authorize(UserRole.ADMIN), userController.verifyFarmer.bind(userController));
router.post('/farmer/:farmerId/reject', authorize(UserRole.ADMIN), userController.rejectFarmerVerification.bind(userController));

// Public route (get user by ID)
router.get('/:id', userController.getUserById.bind(userController));

export default router;
