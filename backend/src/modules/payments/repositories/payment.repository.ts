import { BaseRepository } from '@infrastructure/database/base.repository';
import { PaymentModel, IPayment } from '../entities/payment.entity';
import { PaymentStatus } from '@common/constants';
import { PaginationMeta } from '@common/interfaces';
import mongoose from 'mongoose';

/**
 * Payment Repository
 * Handles all database operations for payments
 */
export class PaymentRepository extends BaseRepository<IPayment> {
    constructor() {
        super(PaymentModel);
    }

    /**
     * Find payment by appointment ID
     */
    async findByAppointmentId(appointmentId: string): Promise<IPayment | null> {
        return await this.findOne({
            appointmentId: new mongoose.Types.ObjectId(appointmentId),
        });
    }

    /**
     * Find payment by gateway order ID
     */
    async findByGatewayOrderId(orderId: string): Promise<IPayment | null> {
        return await this.findOne({ gatewayOrderId: orderId });
    }

    /**
     * Find payment by gateway payment ID
     */
    async findByGatewayPaymentId(paymentId: string): Promise<IPayment | null> {
        return await this.findOne({ gatewayPaymentId: paymentId });
    }

    /**
     * Find payments by user ID
     */
    async findByUserId(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ data: IPayment[]; meta: PaginationMeta }> {
        return await this.findWithPagination(
            { userId: new mongoose.Types.ObjectId(userId) },
            page,
            limit,
            { createdAt: -1 }
        );
    }

    /**
     * Find payments by salon ID
     */
    async findBySalonId(
        salonId: string,
        page: number,
        limit: number
    ): Promise<{ data: IPayment[]; meta: PaginationMeta }> {
        return await this.findWithPagination(
            { salonId: new mongoose.Types.ObjectId(salonId) },
            page,
            limit,
            { createdAt: -1 }
        );
    }

    /**
     * Update payment status
     */
    async updatePaymentStatus(
        paymentId: string,
        status: PaymentStatus,
        gatewayPaymentId?: string,
        gatewaySignature?: string
    ): Promise<IPayment | null> {
        const updates: Record<string, unknown> = { status };

        if (gatewayPaymentId) {
            updates.gatewayPaymentId = gatewayPaymentId;
        }

        if (gatewaySignature) {
            updates.gatewaySignature = gatewaySignature;
        }

        return await this.updateById(paymentId, updates);
    }

    /**
     * Mark payment as failed
     */
    async markAsFailed(paymentId: string, reason: string): Promise<IPayment | null> {
        return await this.updateById(paymentId, {
            status: PaymentStatus.FAILED,
            failureReason: reason,
        });
    }

    /**
     * Add refund details
     */
    async addRefund(
        paymentId: string,
        refundAmount: number,
        reason: string,
        refundedBy: string,
        gatewayRefundId?: string
    ): Promise<IPayment | null> {
        return await this.updateById(paymentId, {
            status: PaymentStatus.REFUNDED,
            refund: {
                amount: refundAmount,
                reason,
                refundedAt: new Date(),
                refundedBy: new mongoose.Types.ObjectId(refundedBy),
                gatewayRefundId,
            },
        });
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
        const stats = await this.aggregate([
            {
                $match: {
                    salonId: new mongoose.Types.ObjectId(salonId),
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [{ $eq: ['$status', PaymentStatus.SUCCESSFUL] }, '$amount.total', 0],
                        },
                    },
                    platformFees: {
                        $sum: {
                            $cond: [{ $eq: ['$status', PaymentStatus.SUCCESSFUL] }, '$amount.platformFee', 0],
                        },
                    },
                    successfulPayments: {
                        $sum: { $cond: [{ $eq: ['$status', PaymentStatus.SUCCESSFUL] }, 1, 0] },
                    },
                    failedPayments: {
                        $sum: { $cond: [{ $eq: ['$status', PaymentStatus.FAILED] }, 1, 0] },
                    },
                    refundedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', PaymentStatus.REFUNDED] }, '$refund.amount', 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    platformFees: 1,
                    netRevenue: { $subtract: ['$totalRevenue', '$platformFees'] },
                    successfulPayments: 1,
                    failedPayments: 1,
                    refundedAmount: 1,
                },
            },
        ]);

        return (
            stats[0] || {
                totalRevenue: 0,
                platformFees: 0,
                netRevenue: 0,
                successfulPayments: 0,
                failedPayments: 0,
                refundedAmount: 0,
            }
        );
    }

    /**
     * Get successful payments for payout
     */
    async getSuccessfulPaymentsForPayout(salonId: string, startDate: Date, endDate: Date): Promise<IPayment[]> {
        return await this.find({
            salonId: new mongoose.Types.ObjectId(salonId),
            status: PaymentStatus.SUCCESSFUL,
            createdAt: { $gte: startDate, $lte: endDate },
        });
    }
}

export const paymentRepository = new PaymentRepository();
