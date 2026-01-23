import prisma from '../config/database';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors';
import { Message, MessageType } from '@prisma/client';
import notificationService from './notification.service';

export class ChatService {
  // Send message
  async sendMessage(
    orderId: string,
    senderId: string,
    data: {
      content: string;
      messageType?: MessageType;
      attachments?: string[];
    }
  ): Promise<Message> {
    // Verify order exists and user is part of it
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (order.buyerId !== senderId && order.farmerId !== senderId) {
      throw new AuthorizationError('You are not part of this order');
    }

    const receiverId = order.buyerId === senderId ? order.farmerId : order.buyerId;

    // Create message
    const message = await prisma.message.create({
      data: {
        orderId,
        senderId,
        receiverId,
        content: data.content,
        messageType: data.messageType || MessageType.TEXT,
        attachments: data.attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Send notification
    await notificationService.createNotification(receiverId, {
      type: 'MESSAGE_RECEIVED',
      title: 'New Message',
      message: `You have a new message from ${message.sender.firstName}`,
      data: { orderId, messageId: message.id },
    });

    return message;
  }

  // Get messages for order
  async getOrderMessages(
    orderId: string,
    userId: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 50 }
  ): Promise<{ messages: Message[]; total: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Verify order exists and user is part of it
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (order.buyerId !== userId && order.farmerId !== userId) {
      throw new AuthorizationError('You are not part of this order');
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { orderId },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.message.count({ where: { orderId } }),
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        orderId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { messages, total };
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  // Mark messages as read
  async markAsRead(messageIds: string[], userId: string): Promise<void> {
    await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: userId,
      },
      data: { isRead: true },
    });
  }

  // Get conversations for user
  async getConversations(
    userId: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<any[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Get unique orders where user has messages
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { farmerId: userId },
        ],
        messages: {
          some: {},
        },
      },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        farmer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                receiverId: userId,
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: limit,
    });

    return orders.map((order) => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      otherUser: order.buyerId === userId ? order.farmer : order.buyer,
      lastMessage: order.messages[0],
      unreadCount: order._count.messages,
      orderStatus: order.status,
    }));
  }
}

export default new ChatService();
