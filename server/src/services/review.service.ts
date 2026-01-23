import prisma from '../config/database';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { Review } from '@prisma/client';

export class ReviewService {
  // Create review
  async createReview(
    orderId: string,
    reviewerId: string,
    data: {
      rating: number;
      comment?: string;
    }
  ): Promise<Review> {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    // Check if order exists and is completed
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (order.status !== 'DELIVERED') {
      throw new ValidationError('Can only review delivered orders');
    }

    // Check if reviewer is buyer or farmer
    const reviewedUserId = order.buyerId === reviewerId ? order.farmerId : order.buyerId;

    if (reviewedUserId === reviewerId) {
      throw new ValidationError('Cannot review yourself');
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        orderId_reviewerId: {
          orderId,
          reviewerId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictError('Review already exists for this order');
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId,
        reviewerId,
        reviewedUserId,
        productId: order.items[0]?.productId,
        rating: data.rating,
        comment: data.comment,
        isVerified: order.status === 'DELIVERED',
      },
    });

    // Update user/product ratings
    await this.updateRatings(reviewedUserId, order.items[0]?.productId);

    return review;
  }

  // Update ratings
  private async updateRatings(userId: string, productId?: string): Promise<void> {
    // Update user rating
    const userReviews = await prisma.review.findMany({
      where: { reviewedUserId: userId },
    });

    if (userReviews.length > 0) {
      const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;

      // Update farmer profile if user is a farmer
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { farmerProfile: true },
      });

      if (user?.role === 'FARMER' && user.farmerProfile) {
        await prisma.farmerProfile.update({
          where: { userId },
          data: {
            rating: avgRating,
            totalRatings: userReviews.length,
          },
        });
      }
    }

    // Update product rating
    if (productId) {
      const productReviews = await prisma.review.findMany({
        where: { productId },
      });

      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

        await prisma.product.update({
          where: { id: productId },
          data: {
            rating: avgRating,
            totalRatings: productReviews.length,
          },
        });
      }
    }
  }

  // Get reviews for user
  async getUserReviews(
    userId: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ reviews: Review[]; total: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewedUserId: userId },
        include: {
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              images: true,
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { reviewedUserId: userId } }),
    ]);

    return { reviews, total };
  }

  // Get reviews for product
  async getProductReviews(
    productId: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ reviews: Review[]; total: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    return { reviews, total };
  }

  // Update review
  async updateReview(
    reviewId: string,
    reviewerId: string,
    data: {
      rating?: number;
      comment?: string;
    }
  ): Promise<Review> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review');
    }

    if (review.reviewerId !== reviewerId) {
      throw new ValidationError('You can only update your own reviews');
    }

    const updateData: any = {};
    if (data.rating !== undefined) {
      if (data.rating < 1 || data.rating > 5) {
        throw new ValidationError('Rating must be between 1 and 5');
      }
      updateData.rating = data.rating;
    }
    if (data.comment !== undefined) updateData.comment = data.comment;

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
    });

    // Update ratings
    await this.updateRatings(updatedReview.reviewedUserId, updatedReview.productId || undefined);

    return updatedReview;
  }

  // Delete review
  async deleteReview(reviewId: string, reviewerId: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review');
    }

    if (review.reviewerId !== reviewerId) {
      throw new ValidationError('You can only delete your own reviews');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update ratings
    await this.updateRatings(review.reviewedUserId, review.productId || undefined);
  }
}

export default new ReviewService();
