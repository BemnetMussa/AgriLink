import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/otp/request', otpLimiter, authController.requestOTP.bind(authController));
router.post('/otp/verify', otpLimiter, authController.verifyOTP.bind(authController));
router.post('/register', authLimiter, authController.register.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));
router.post('/reset-password', authLimiter, authController.resetPassword.bind(authController));

// Protected routes
router.post('/logout', authController.logout.bind(authController));
router.post('/change-password', authController.changePassword.bind(authController));

export default router;
