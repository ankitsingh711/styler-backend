import { paymentRepository } from '../repositories/payment.repository';
import { appointmentRepository } from '@modules/appointments/repositories/appointment.repository';
import { razorpayService } from '@infrastructure/payment/razorpay.service';
import { logger } from '@infrastructure/logger/logger.service';
import {
    BadRequestException,
    NotFoundException,
    ForbiddenException,
} from '@common/exceptions';
import { IPayment } from '../entities/payment.entity';
import { PaymentStatus, AppointmentStatus, PaymentMethod } from '@common/constants';
import { PaginationMeta } from '@common/interfaces';

/**
 * Initiate Payment DTO
 */
export interface InitiatePaymentDTO {
    appointmentId: string;
    method: PaymentMethod;
}

/**
 * Verify Payment DTO
 */
export interface VerifyPaymentDTO {
    orderId: string;
    paymentId: string;
    signature: string;
}

/**
 * Payment Service
 * Handles payment processing and management
 */
export class PaymentService {
    /**
     * Initiate payment for appointment
     */
    async initiatePayment(userId: string, dto: InitiatePaymentDTO): Promise<{
        payment: IPayment;
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
    }> {
        // Get appointment
        const appointment = await appointmentRepository.findById(dto.appointmentId);
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        // Verify user owns the appointment
        if (appointment.userId.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to pay for this appointment');
        }

        // Check if appointment is in valid state for payment
        if (appointment.status === AppointmentStatus.CANCELLED) {
            throw new BadRequestException('Cannot pay for a cancelled appointment');
        }

        if (appointment.status === AppointmentStatus.COMPLETED) {
            throw new BadRequestException('Appointment is already completed');
        }

        // Check if payment already exists
        const existingPayment = await paymentRepository.findByAppointmentId(dto.appointmentId);
        if (existingPayment && existingPayment.status === PaymentStatus.SUCCESSFUL) {
            throw new BadRequestException('Payment already completed for this appointment');
        }

        // Create Razorpay order
        const razorpayOrder = await razorpayService.createOrder({
            amount: appointment.pricing.total,
            receipt: `apt_${appointment._id}`,
            notes: {
                appointmentId: appointment._id.toString(),
                userId: userId,
                salonId: appointment.salonId.toString(),
            },
        });

        // Create payment record
        const payment = await paymentRepository.create({
            appointmentId: appointment._id,
            userId: appointment.userId,
            salonId: appointment.salonId,
            amount: {
                total: appointment.pricing.total,
                services: appointment.pricing.services,
                homeServiceFee: appointment.pricing.homeServiceFee,
                platformFee: appointment.pricing.platformFee,
                tax: 0, // Can be calculated based on location
            },
            method: dto.method,
            status: PaymentStatus.INITIATED,
            gateway: 'razorpay',
            gatewayOrderId: razorpayOrder.id,
            metadata: {
                orderDetails: razorpayOrder,
            },
        });

        logger.info(`Payment initiated for appointment ${dto.appointmentId}: ${payment._id}`);

        return {
            payment,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: razorpayService.getKeyId(),
        };
    }

    /**
     * Verify payment after successful transaction
     */
    async verifyPayment(userId: string, dto: VerifyPaymentDTO): Promise<IPayment> {
        // Find payment by order ID
        const payment = await paymentRepository.findByGatewayOrderId(dto.orderId);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Verify user owns the payment
        if (payment.userId.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to verify this payment');
        }

        // Verify signature
        const isValid = razorpayService.verifyPaymentSignature({
            orderId: dto.orderId,
            paymentId: dto.paymentId,
            signature: dto.signature,
        });

        if (!isValid) {
            logger.warn(`Invalid payment signature for order ${dto.orderId}`);
            await paymentRepository.markAsFailed(payment._id.toString(), 'Invalid signature');
            throw new BadRequestException('Payment verification failed');
        }

        // Update payment status
        const updatedPayment = await paymentRepository.updatePaymentStatus(
            payment._id.toString(),
            PaymentStatus.SUCCESSFUL,
            dto.paymentId,
            dto.signature
        );

        if (!updatedPayment) {
            throw new NotFoundException('Payment not found');
        }

        // Update appointment payment status and confirm appointment
        await appointmentRepository.updateById(payment.appointmentId.toString(), {
            paymentStatus: PaymentStatus.SUCCESSFUL,
            paymentId: updatedPayment._id.toString(),
            status: AppointmentStatus.CONFIRMED,
        });

        logger.info(`Payment verified and confirmed: ${updatedPayment._id}`);

        return updatedPayment;
    }

    /**
     * Handle payment webhook from Razorpay
     */
    async handleWebhook(body: string, signature: string): Promise<void> {
        // Verify webhook signature
        const isValid = razorpayService.verifyWebhookSignature(body, signature);
        if (!isValid) {
            logger.warn('Invalid webhook signature');
            throw new BadRequestException('Invalid webhook signature');
        }

        const event = JSON.parse(body);
        logger.info(`Received webhook event: ${event.event}`);

        // Handle different event types
        switch (event.event) {
            case 'payment.captured':
                await this.handlePaymentCaptured(event.payload.payment.entity);
                break;
            case 'payment.failed':
                await this.handlePaymentFailed(event.payload.payment.entity);
                break;
            case 'refund.created':
                await this.handleRefundCreated(event.payload.refund.entity);
                break;
            default:
                logger.info(`Unhandled webhook event: ${event.event}`);
        }
    }

    /**
     * Handle payment captured event
     */
    private async handlePaymentCaptured(paymentData: {
        id: string;
        order_id: string;
        status: string;
    }): Promise<void> {
        const payment = await paymentRepository.findByGatewayOrderId(paymentData.order_id);
        if (payment && payment.status !== PaymentStatus.SUCCESSFUL) {
            await paymentRepository.updatePaymentStatus(
                payment._id.toString(),
                PaymentStatus.SUCCESSFUL,
                paymentData.id
            );

            // Update appointment
            await appointmentRepository.updateById(payment.appointmentId.toString(), {
                paymentStatus: PaymentStatus.SUCCESSFUL,
                status: AppointmentStatus.CONFIRMED,
            });

            logger.info(`Payment captured via webhook: ${payment._id}`);
        }
    }

    /**
     * Handle payment failed event
     */
    private async handlePaymentFailed(paymentData: {
        id: string;
        order_id: string;
        error_description: string;
    }): Promise<void> {
        const payment = await paymentRepository.findByGatewayOrderId(paymentData.order_id);
        if (payment) {
            await paymentRepository.markAsFailed(
                payment._id.toString(),
                paymentData.error_description || 'Payment failed'
            );

            logger.info(`Payment failed via webhook: ${payment._id}`);
        }
    }

    /**
     * Handle refund created event
     */
    private async handleRefundCreated(refundData: {
        id: string;
        payment_id: string;
        amount: number;
    }): Promise<void> {
        const payment = await paymentRepository.findByGatewayPaymentId(refundData.payment_id);
        if (payment) {
            logger.info(`Refund processed via webhook for payment: ${payment._id}`);
        }
    }

    /**
     * Refund payment
     */
    async refundPayment(
        paymentId: string,
        userId: string,
        reason: string,
        amount?: number
    ): Promise<IPayment> {
        const payment = await paymentRepository.findById(paymentId);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Check if payment is successful
        if (payment.status !== PaymentStatus.SUCCESSFUL) {
            throw new BadRequestException('Only successful payments can be refunded');
        }

        // Check if already refunded
        if (payment.status === PaymentStatus.REFUNDED) {
            throw new BadRequestException('Payment already refunded');
        }

        // Process refund with Razorpay
        if (!payment.gatewayPaymentId) {
            throw new BadRequestException('Payment ID not found');
        }

        const refund = await razorpayService.refundPayment(payment.gatewayPaymentId, amount);

        // Update payment with refund details
        const refundedPayment = await paymentRepository.addRefund(
            paymentId,
            amount || payment.amount.total,
            reason,
            userId,
            refund.id
        );

        if (!refundedPayment) {
            throw new NotFoundException('Payment not found');
        }

        // Update appointment payment status
        await appointmentRepository.updateById(payment.appointmentId.toString(), {
            paymentStatus: PaymentStatus.REFUNDED,
        });

        logger.info(`Payment refunded: ${paymentId}`);

        return refundedPayment;
    }

    /**
     * Get payment history for user
     */
    async getUserPayments(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ data: IPayment[]; meta: PaginationMeta }> {
        return await paymentRepository.findByUserId(userId, page, limit);
    }

    /**
     * Get payment statistics for salon
     */
    async getSalonPaymentStats(
        salonId: string,
        startDate: Date,
        endDate: Date
    ): Promise<{
        totalRevenue: number;
        platformFees: number;
        netRevenue: number;
        successfulPayments: number;
        failedPayments: number;
        refundedAmount: number;
    }> {
        return await paymentRepository.getSalonPaymentStats(salonId, startDate, endDate);
    }
}

export const paymentService = new PaymentService();
