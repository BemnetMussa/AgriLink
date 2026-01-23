import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AuthenticationError } from '../utils/errors';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
  })).min(1, 'At least one item is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  deliveryLat: z.number().optional(),
  deliveryLng: z.number().optional(),
  deliveryDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  negotiatedPrice: z.number().positive().optional(),
});

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('20'),
  status: z.enum(['PENDING', 'CONFIRMED', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'DISPUTED', 'REFUNDED']).optional(),
  role: z.enum(['buyer', 'farmer']).optional(),
});

export class OrderController {
  // Create order
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const data = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder(req.user.id, data);
      return sendSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Get orders
  async getOrders(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const query = querySchema.parse(req.query);
      const { orders, total } = await orderService.getOrders(req.user.id, {
        status: query.status as any,
        role: query.role,
      }, {
        page: query.page,
        limit: query.limit,
      });
      return sendPaginated(res, orders, { page: query.page, limit: query.limit, total }, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get order by ID
  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const order = await orderService.getOrderById(id, req.user.id);
      return sendSuccess(res, order, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update order status
  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        throw new Error('Status is required');
      }
      const order = await orderService.updateOrderStatus(id, req.user.id, status as any);
      return sendSuccess(res, order, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Negotiate price
  async negotiatePrice(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const { newPrice } = req.body;
      if (typeof newPrice !== 'number' || newPrice <= 0) {
        throw new Error('Valid newPrice is required');
      }
      const order = await orderService.negotiatePrice(id, req.user.id, newPrice);
      return sendSuccess(res, order, 'Price negotiated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
