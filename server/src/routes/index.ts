import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import reviewRoutes from './review.routes';
import chatRoutes from './chat.routes';
import notificationRoutes from './notification.routes';
import { config } from '../config/env';

const router = Router();
const apiPrefix = `/api/${config.apiVersion}`;

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriLink API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use(`${apiPrefix}/auth`, authRoutes);
router.use(`${apiPrefix}/users`, userRoutes);
router.use(`${apiPrefix}/products`, productRoutes);
router.use(`${apiPrefix}/orders`, orderRoutes);
router.use(`${apiPrefix}/payments`, paymentRoutes);
router.use(`${apiPrefix}/reviews`, reviewRoutes);
router.use(`${apiPrefix}/chat`, chatRoutes);
router.use(`${apiPrefix}/notifications`, notificationRoutes);

export default router;
