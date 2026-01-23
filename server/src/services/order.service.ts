import prisma from '../config/database';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors';
import { Order, OrderStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import paymentService from './payment.service';
import notificationService from './notification.service';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryDate?: Date;
  notes?: string;
  negotiatedPrice?: number;
}

export class OrderService {
  // Create order
  async createOrder(buyerId: string, data: CreateOrderData): Promise<Order> {
    // Validate items
    if (!data.items || data.items.length === 0) {
      throw new ValidationError('Order must have at least one item');
    }

    // Fetch products and calculate totals
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundError('One or more products not found');
    }

    // Group products by farmer
    const farmerProducts = new Map<string, typeof products>();
    products.forEach((product) => {
      if (!farmerProducts.has(product.farmerId)) {
        farmerProducts.set(product.farmerId, []);
      }
      farmerProducts.get(product.farmerId)!.push(product);
    });

    // Create orders for each farmer (multi-vendor support)
    const orders: Order[] = [];

    for (const [farmerId, farmerProds] of farmerProducts) {
      let totalAmount = 0;
      const orderItems: any[] = [];

      for (const item of data.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product || product.farmerId !== farmerId) continue;

        // Check availability
        if (product.quantity < item.quantity) {
          throw new ValidationError(
            `Insufficient quantity for ${product.title}. Available: ${product.quantity}`
          );
        }

        // Check minimum order
        if (product.minOrder && item.quantity < product.minOrder) {
          throw new ValidationError(
            `Minimum order quantity for ${product.title} is ${product.minOrder}`
          );
        }

        const unitPrice = data.negotiatedPrice || product.price;
        const itemTotal = unitPrice * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          totalPrice: itemTotal,
        });
      }

      if (orderItems.length === 0) continue;

      // Create order
      const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
      const order = await prisma.order.create({
        data: {
          orderNumber,
          buyerId,
          farmerId,
          status: OrderStatus.PENDING,
          totalAmount,
          negotiatedPrice: data.negotiatedPrice,
          deliveryAddress: data.deliveryAddress,
          deliveryLat: data.deliveryLat,
          deliveryLng: data.deliveryLng,
          deliveryDate: data.deliveryDate,
          notes: data.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          farmer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      });

      // Update product quantities
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            soldQuantity: { increment: item.quantity },
          },
        });
      }

      // Create payment with escrow
      await paymentService.createPayment(order.id, {
        amount: totalAmount,
        paymentMethod: 'CHAPA', // Default, can be changed
      });

      // Send notifications
      await notificationService.createNotification(farmerId, {
        type: 'ORDER_PLACED',
        title: 'New Order Received',
        message: `You have received a new order: ${orderNumber}`,
        data: { orderId: order.id, orderNumber },
      });

      orders.push(order);
    }

    // For now, return the first order (in future, return array for multi-vendor)
    return orders[0];
  }

  // Get order by ID
  async getOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        farmer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            farmerProfile: {
              select: {
                verificationStatus: true,
                rating: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    // Check authorization
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (
      order.buyerId !== userId &&
      order.farmerId !== userId &&
      user?.role !== 'ADMIN'
    ) {
      throw new AuthorizationError('You can only view your own orders');
    }

    return order;
  }

  // Get orders for user
  async getOrders(
    userId: string,
    filters: {
      status?: OrderStatus;
      role?: 'buyer' | 'farmer';
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ orders: Order[]; total: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User');
    }

    const where: any = {};
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.role === 'buyer' || (!filters.role && user.role === 'BUYER')) {
      where.buyerId = userId;
    } else if (filters.role === 'farmer' || (!filters.role && user.role === 'FARMER')) {
      where.farmerId = userId;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
          farmer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  // Update order status
  async updateOrderStatus(
    orderId: string,
    userId: string,
    status: OrderStatus
  ): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Authorization checks
    if (status === OrderStatus.CONFIRMED && order.farmerId !== userId) {
      throw new AuthorizationError('Only farmer can confirm order');
    }

    if (status === OrderStatus.CANCELLED) {
      if (order.buyerId !== userId && order.farmerId !== userId && user?.role !== 'ADMIN') {
        throw new AuthorizationError('You cannot cancel this order');
      }

      // Refund payment if exists
      if (order.payment) {
        await paymentService.refundPayment(order.payment.id, 'Order cancelled');
      }

      // Restore product quantities
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: { increment: item.quantity },
            soldQuantity: { decrement: item.quantity },
          },
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        farmer: true,
        buyer: true,
      },
    });

    // Send notifications
    const notificationUserId = order.buyerId === userId ? order.farmerId : order.buyerId;
    await notificationService.createNotification(notificationUserId, {
      type: 'ORDER_CONFIRMED',
      title: 'Order Status Updated',
      message: `Order ${order.orderNumber} status changed to ${status}`,
      data: { orderId: order.id, status },
    });

    return updatedOrder;
  }

  // Negotiate price
  async negotiatePrice(
    orderId: string,
    userId: string,
    newPrice: number
  ): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new ValidationError('Can only negotiate price for pending orders');
    }

    // Only buyer or farmer can negotiate
    if (order.buyerId !== userId && order.farmerId !== userId) {
      throw new AuthorizationError('You cannot negotiate this order');
    }

    return await prisma.order.update({
      where: { id: orderId },
      data: { negotiatedPrice: newPrice },
      include: {
        items: true,
        payment: true,
        farmer: true,
        buyer: true,
      },
    });
  }
}

export default new OrderService();
