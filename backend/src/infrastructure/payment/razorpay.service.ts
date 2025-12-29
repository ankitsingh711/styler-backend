import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '@config/environment';
import { logger } from '@infrastructure/logger/logger.service';
import { ExternalServiceException, BadRequestException } from '@common/exceptions';

/**
 * Create Order Options
 */
export interface CreateOrderOptions {
    amount: number; // in rupees
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
}

/**
 * Verify Payment Options
 */
export interface VerifyPaymentOptions {
    orderId: string;
    paymentId: string;
    signature: string;
}

/**
 * Razorpay Service
 * Handles Razorpay payment gateway integration
 */
export class RazorpayService {
    private razorpay: Razorpay;
    private keySecret: string;

    constructor() {
        this.keySecret = config.razorpay.keySecret;
        this.razorpay = new Razorpay({
            key_id: config.razorpay.keyId,
            key_secret: this.keySecret,
        });
    }

    /**
     * Create payment order
     */
    async createOrder(options: CreateOrderOptions): Promise<{
        id: string;
        amount: number;
        currency: string;
        receipt: string;
    }> {
        try {
            const order = await this.razorpay.orders.create({
                amount: Math.round(options.amount * 100), // Convert to paise
                currency: options.currency || 'INR',
                receipt: options.receipt,
                notes: options.notes,
            });

            logger.info(`Razorpay order created: ${order.id}`);

            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
            };
        } catch (error) {
            logger.error('Error creating Razorpay order:', error);
            throw new ExternalServiceException('Failed to create payment order');
        }
    }

    /**
     * Verify payment signature
     */
    verifyPaymentSignature(options: VerifyPaymentOptions): boolean {
        try {
            const { orderId, paymentId, signature } = options;

            const generatedSignature = crypto
                .createHmac('sha256', this.keySecret)
                .update(`${orderId}|${paymentId}`)
                .digest('hex');

            const isValid = generatedSignature === signature;

            if (isValid) {
                logger.info(`Payment signature verified for order: ${orderId}`);
            } else {
                logger.warn(`Invalid payment signature for order: ${orderId}`);
            }

            return isValid;
        } catch (error) {
            logger.error('Error verifying payment signature:', error);
            return false;
        }
    }

    /**
     * Fetch payment details
     */
    async fetchPayment(paymentId: string): Promise<{
        id: string;
        amount: number;
        status: string;
        method: string;
        orderId: string;
    }> {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);

            return {
                id: payment.id,
                amount: payment.amount / 100, // Convert from paise to rupees
                status: payment.status,
                method: payment.method,
                orderId: payment.order_id,
            };
        } catch (error) {
            logger.error(`Error fetching payment ${paymentId}:`, error);
            throw new ExternalServiceException('Failed to fetch payment details');
        }
    }

    /**
     * Refund payment
     */
    async refundPayment(
        paymentId: string,
        amount?: number
    ): Promise<{
        id: string;
        amount: number;
        status: string;
    }> {
        try {
            const options: { amount?: number } = {};
            if (amount) {
                options.amount = Math.round(amount * 100); // Convert to paise
            }

            const refund = await this.razorpay.payments.refund(paymentId, options);

            logger.info(`Refund created for payment ${paymentId}: ${refund.id}`);

            return {
                id: refund.id,
                amount: refund.amount / 100, // Convert to rupees
                status: refund.status,
            };
        } catch (error) {
            logger.error(`Error refunding payment ${paymentId}:`, error);
            throw new ExternalServiceException('Failed to process refund');
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(body: string, signature: string): boolean {
        try {
            const webhookSecret = config.razorpay.webhookSecret;
            if (!webhookSecret) {
                logger.warn('Webhook secret not configured');
                return false;
            }

            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(body)
                .digest('hex');

            return expectedSignature === signature;
        } catch (error) {
            logger.error('Error verifying webhook signature:', error);
            return false;
        }
    }

    /**
     * Get Razorpay key ID for frontend
     */
    getKeyId(): string {
        return config.razorpay.keyId;
    }
}

export const razorpayService = new RazorpayService();
