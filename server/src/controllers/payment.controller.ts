import { Request, Response, NextFunction } from 'express';
import paymentService from '../services/payment.service';
import { sendSuccess } from '../utils/response';
import { AuthenticationError } from '../utils/errors';
import { z } from 'zod';

const initializePaymentSchema = z.object({
  paymentMethod: z.enum(['CHAPA', 'TELEBIRR', 'CBE_BIRR', 'HELLO_CASH', 'AMOLE', 'BANK_TRANSFER']).optional(),
});

export class PaymentController {
  // Initialize payment
  async initializePayment(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const data = initializePaymentSchema.parse(req.body);
      const result = await paymentService.initializePayment(id);
      return sendSuccess(res, result, 'Payment initialized successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get payment by ID
  async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id, req.user.id);
      return sendSuccess(res, payment, 'Payment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Release escrow
  async releaseEscrow(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      const { id } = req.params;
      const payment = await paymentService.releaseEscrow(id, req.user.id);
      return sendSuccess(res, payment, 'Escrow released successfully');
    } catch (error) {
      next(error);
    }
  }

  // Handle payment webhook
  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { transactionId, status, data: gatewayData } = req.body;
      if (!transactionId || !status) {
        throw new Error('transactionId and status are required');
      }
      const payment = await paymentService.handleWebhook(transactionId, status, gatewayData);
      return sendSuccess(res, payment, 'Webhook processed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
