import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Webhook route (no auth, but should verify webhook signature in production)
router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

// Protected routes
router.use(authenticate);

router.post('/:id/initialize', paymentController.initializePayment.bind(paymentController));
router.get('/:id', paymentController.getPaymentById.bind(paymentController));
router.post('/:id/release-escrow', paymentController.releaseEscrow.bind(paymentController));

export default router;
