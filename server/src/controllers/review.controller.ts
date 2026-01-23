import { Request, Response, NextFunction } from 'express';
import reviewService from '../services/review.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticationError } from '../utils/errors';
import { z } from 'zod';

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const updateReviewSchema = createReviewSchema.partial();

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('20'),
});

export class ReviewController {
  // Create review
  async createReview(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { orderId } = req.params;
      const data = createReviewSchema.parse(req.body);
      const review = await reviewService.createReview(orderId, req.user.id, data);
      return sendSuccess(res, review, 'Review created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Get user reviews
  async getUserReviews(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { userId } = req.params;
      const query = querySchema.parse(req.query);
      const { reviews, total } = await reviewService.getUserReviews(userId, {
        page: query.page,
        limit: query.limit,
      });
      return sendPaginated(res, reviews, { page: query.page, limit: query.limit, total }, 'Reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get product reviews
  async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { productId } = req.params;
      const query = querySchema.parse(req.query);
      const { reviews, total } = await reviewService.getProductReviews(productId, {
        page: query.page,
        limit: query.limit,
      });
      return sendPaginated(res, reviews, { page: query.page, limit: query.limit, total }, 'Reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update review
  async updateReview(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const data = updateReviewSchema.parse(req.body);
      const review = await reviewService.updateReview(id, req.user.id, data);
      return sendSuccess(res, review, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete review
  async deleteReview(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      await reviewService.deleteReview(id, req.user.id);
      return sendSuccess(res, null, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
