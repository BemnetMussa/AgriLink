import { Router } from 'express';
import chatController from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/order/:orderId/messages', chatController.sendMessage.bind(chatController));
router.get('/order/:orderId/messages', chatController.getOrderMessages.bind(chatController));
router.get('/conversations', chatController.getConversations.bind(chatController));
router.get('/unread-count', chatController.getUnreadCount.bind(chatController));
router.post('/mark-read', chatController.markAsRead.bind(chatController));

export default router;
