import { Router } from 'express';
import reviewController from '../controllers/review.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/user/:userId', optionalAuth, reviewController.getUserReviews.bind(reviewController));
router.get('/product/:productId', optionalAuth, reviewController.getProductReviews.bind(reviewController));

// Protected routes
router.use(authenticate);

router.post('/order/:orderId', reviewController.createReview.bind(reviewController));
router.put('/:id', reviewController.updateReview.bind(reviewController));
router.delete('/:id', reviewController.deleteReview.bind(reviewController));

export default router;
