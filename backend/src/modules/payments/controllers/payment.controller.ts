import { Request, Response, NextFunction } from 'express';
import { paymentService, InitiatePaymentDTO, VerifyPaymentDTO } from '../services/payment.service';
import { AuthenticatedRequest } from '@common/interfaces';
import { HttpStatus } from '@common/constants';
import { BadRequestException } from '@common/exceptions';
import { parsePaginationQuery } from '@common/utils';

/**
 * Payment Controller
 * Handles HTTP requests for payment operations
 */
export class PaymentController {
    /**
     * Initiate payment
     * POST /api/v1/payments/initiate
     */
    async initiatePayment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: InitiatePaymentDTO = req.body;

            if (!dto.appointmentId || !dto.method) {
                throw new BadRequestException('Appointment ID and payment method are required');
            }

            const result = await paymentService.initiatePayment(userId, dto);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Payment initiated successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify payment
     * POST /api/v1/payments/verify
     */
    async verifyPayment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: VerifyPaymentDTO = req.body;

            if (!dto.orderId || !dto.paymentId || !dto.signature) {
                throw new BadRequestException('Order ID, payment ID, and signature are required');
            }

            const payment = await paymentService.verifyPayment(userId, dto);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Payment verified successfully',
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handle Razorpay webhook
     * POST /api/v1/payments/webhook
     */
    async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const signature = req.headers['x-razorpay-signature'] as string;

            if (!signature) {
                throw new BadRequestException('Webhook signature missing');
            }

            const body = JSON.stringify(req.body);

            await paymentService.handleWebhook(body, signature);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Webhook processed successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get payment history
     * GET /api/v1/payments
     */
    async getPaymentHistory(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const { page, limit } = parsePaginationQuery(req.query);
            const result = await paymentService.getUserPayments(userId, page, limit);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result.data,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Refund payment
     * POST /api/v1/payments/:id/refund
     */
    async refundPayment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { reason, amount } = req.body;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!reason) {
                throw new BadRequestException('Refund reason is required');
            }

            const payment = await paymentService.refundPayment(id, userId, reason, amount);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Payment refunded successfully',
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get salon payment statistics
     * GET /api/v1/payments/salon/:salonId/statistics
     */
    async getSalonStatistics(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { salonId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                throw new BadRequestException('Start date and end date are required');
            }

            const statistics = await paymentService.getSalonPaymentStats(
                salonId,
                new Date(startDate as string),
                new Date(endDate as string)
            );

            res.status(HttpStatus.OK).json({
                success: true,
                data: statistics,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const paymentController = new PaymentController();
