import { Request, Response, NextFunction } from 'express';
import chatService from '../services/chat.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticationError } from '../utils/errors';
import { z } from 'zod';

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  messageType: z.enum(['TEXT', 'IMAGE', 'FILE', 'PRICE_NEGOTIATION', 'SYSTEM']).optional(),
  attachments: z.array(z.string().url()).optional(),
});

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('50'),
});

export class ChatController {
  // Send message
  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { orderId } = req.params;
      const data = sendMessageSchema.parse(req.body);
      const message = await chatService.sendMessage(orderId, req.user.id, data);
      return sendSuccess(res, message, 'Message sent successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Get order messages
  async getOrderMessages(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { orderId } = req.params;
      const query = querySchema.parse(req.query);
      const { messages, total } = await chatService.getOrderMessages(orderId, req.user.id, {
        page: query.page,
        limit: query.limit,
      });
      return sendPaginated(res, messages, { page: query.page, limit: query.limit, total }, 'Messages retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get conversations
  async getConversations(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const query = querySchema.parse(req.query);
      const conversations = await chatService.getConversations(req.user.id, {
        page: query.page,
        limit: query.limit,
      });
      return sendSuccess(res, conversations, 'Conversations retrieved successfully');
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
      const count = await chatService.getUnreadCount(req.user.id);
      return sendSuccess(res, { unreadCount: count }, 'Unread count retrieved successfully');
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
      const { messageIds } = req.body;
      if (!Array.isArray(messageIds)) {
        throw new Error('messageIds must be an array');
      }
      await chatService.markAsRead(messageIds, req.user.id);
      return sendSuccess(res, null, 'Messages marked as read');
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
