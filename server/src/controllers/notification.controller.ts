import { Request, Response, NextFunction } from 'express';
import notificationService from '../services/notification.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticationError } from '../utils/errors';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('20'),
  isRead: z.string().transform((val) => val === 'true').optional(),
  type: z.enum(['ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_CANCELLED', 'PAYMENT_RECEIVED', 'PAYMENT_RELEASED', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'REVIEW_RECEIVED', 'MESSAGE_RECEIVED', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'SYSTEM_ANNOUNCEMENT']).optional(),
});

export class NotificationController {
  // Get notifications
  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const query = querySchema.parse(req.query);
      const { notifications, total, unreadCount } = await notificationService.getUserNotifications(req.user.id, {
        isRead: query.isRead,
        type: query.type as any,
      }, {
        page: query.page,
        limit: query.limit,
      });
      return res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
        },
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark as read
  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      await notificationService.markAsRead(id, req.user.id);
      return sendSuccess(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  // Mark all as read
  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      await notificationService.markAllAsRead(req.user.id);
      return sendSuccess(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }

  // Delete notification
  async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      await notificationService.deleteNotification(id, req.user.id);
      return sendSuccess(res, null, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get unread count
  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const count = await notificationService.getUnreadCount(req.user.id);
      return sendSuccess(res, { unreadCount: count }, 'Unread count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
