import prisma from '../config/database';
import { NotFoundError, ValidationError, PaymentError } from '../utils/errors';
import { Payment, PaymentStatus, EscrowStatus, PaymentMethod } from '@prisma/client';
import logger from '../utils/logger';
import { config } from '../config/env';

export interface CreatePaymentData {
  amount: number;
  paymentMethod?: PaymentMethod;
  currency?: string;
}

export class PaymentService {
  // Create payment with escrow
  async createPayment(orderId: string, data: CreatePaymentData): Promise<Payment> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      throw new ValidationError('Payment already exists for this order');
    }

    // Use negotiated price if available, otherwise use total amount
    const amount = order.negotiatedPrice || data.amount || order.totalAmount;

    // Calculate escrow release date (default: 7 days after delivery or 14 days after payment)
    const escrowReleaseAt = new Date();
    escrowReleaseAt.setDate(escrowReleaseAt.getDate() + 14); // 14 days default

    return await prisma.payment.create({
      data: {
        orderId,
        amount,
        currency: data.currency || 'ETB',
        status: PaymentStatus.PENDING,
        paymentMethod: data.paymentMethod || PaymentMethod.CHAPA,
        escrowStatus: EscrowStatus.HELD,
        escrowReleaseAt,
      },
    });
  }

  // Initialize payment with external gateway
  async initializePayment(paymentId: string): Promise<{ paymentUrl: string; transactionId: string }> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new ValidationError('Payment already processed');
    }

    // Update status to processing
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.PROCESSING },
    });

    // TODO: Integrate with Chapa/Telebirr API
    // For now, simulate payment initialization
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // In production, this would call the actual payment gateway
    logger.info(`Initializing payment ${paymentId} with transaction ${transactionId}`);

    // Simulate payment URL
    const paymentUrl = `https://checkout.chapa.co/checkout/payment/${transactionId}`;

    // Update payment with transaction ID
    await prisma.payment.update({
      where: { id: paymentId },
      data: { transactionId },
    });

    return { paymentUrl, transactionId };
  }

  // Handle payment webhook (from Chapa/Telebirr)
  async handleWebhook(
    transactionId: string,
    status: 'success' | 'failed',
    gatewayData: any
  ): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    if (status === 'success') {
      // Mark payment as completed
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
          gatewayResponse: gatewayData,
        },
      });

      // Update order status
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' },
      });

      // Send notifications
      const { notificationService } = await import('./notification.service');
      await notificationService.createNotification(payment.order.farmerId, {
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received',
        message: `Payment of ${payment.amount} ETB received for order ${payment.order.orderNumber}`,
        data: { paymentId: payment.id, orderId: payment.orderId },
      });

      return updatedPayment;
    } else {
      // Mark payment as failed
      return await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: gatewayData,
        },
      });
    }
  }

  // Release escrow payment
  async releaseEscrow(paymentId: string, userId: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    if (payment.escrowStatus !== EscrowStatus.HELD) {
      throw new ValidationError('Payment is not in escrow');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new ValidationError('Payment must be completed before releasing escrow');
    }

    // Only buyer or admin can release escrow (after delivery confirmation)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (payment.order.buyerId !== userId && user?.role !== 'ADMIN') {
      throw new ValidationError('Only buyer or admin can release escrow');
    }

    // Release escrow
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        escrowStatus: EscrowStatus.RELEASED,
        releasedAt: new Date(),
      },
    });

    // Update order status if delivered
    if (payment.order.status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    // Send notification to farmer
    const { notificationService } = await import('./notification.service');
    await notificationService.createNotification(payment.order.farmerId, {
      type: 'PAYMENT_RELEASED',
      title: 'Escrow Released',
      message: `Payment of ${payment.amount} ETB has been released from escrow`,
      data: { paymentId: payment.id, orderId: payment.orderId },
    });

    return updatedPayment;
  }

  // Auto-release escrow (called by scheduled job)
  async autoReleaseEscrow(): Promise<void> {
    const now = new Date();
    const payments = await prisma.payment.findMany({
      where: {
        escrowStatus: EscrowStatus.HELD,
        status: PaymentStatus.COMPLETED,
        escrowReleaseAt: {
          lte: now,
        },
      },
      include: { order: true },
    });

    for (const payment of payments) {
      try {
        await this.releaseEscrow(payment.id, payment.order.buyerId);
        logger.info(`Auto-released escrow for payment ${payment.id}`);
      } catch (error) {
        logger.error(`Failed to auto-release escrow for payment ${payment.id}:`, error);
      }
    }
  }

  // Refund payment
  async refundPayment(paymentId: string, reason: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new ValidationError('Can only refund completed payments');
    }

    // TODO: Process refund with payment gateway
    logger.info(`Processing refund for payment ${paymentId}: ${reason}`);

    return await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.REFUNDED,
        escrowStatus: EscrowStatus.REFUNDED,
        refundedAt: new Date(),
        refundReason: reason,
      },
    });
  }

  // Get payment by ID
  async getPaymentById(paymentId: string, userId: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            buyer: true,
            farmer: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    // Check authorization
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (
      payment.order.buyerId !== userId &&
      payment.order.farmerId !== userId &&
      user?.role !== 'ADMIN'
    ) {
      throw new ValidationError('You can only view your own payments');
    }

    return payment;
  }
}

export default new PaymentService();
