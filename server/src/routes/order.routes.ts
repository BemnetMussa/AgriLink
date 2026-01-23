import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Buyer and Farmer routes
router.post('/', authorize(UserRole.BUYER), orderController.createOrder.bind(orderController));
router.get('/', orderController.getOrders.bind(orderController));
router.get('/:id', orderController.getOrderById.bind(orderController));
router.patch('/:id/status', orderController.updateOrderStatus.bind(orderController));
router.post('/:id/negotiate', orderController.negotiatePrice.bind(orderController));

export default router;
