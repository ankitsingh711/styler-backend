import mongoose, { Schema, Document } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '@common/constants';

/**
 * Payment amount breakdown interface
 */
export interface IPaymentAmount {
    total: number;
    services: number;
    homeServiceFee: number;
    platformFee: number;
    tax: number;
}

/**
 * Refund interface
 */
export interface IRefund {
    amount: number;
    reason: string;
    refundedAt: Date;
    refundedBy: mongoose.Types.ObjectId;
    gatewayRefundId?: string;
}

/**
 * Payment document interface
 */
export interface IPayment extends Document {
    appointmentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    salonId: mongoose.Types.ObjectId;
    amount: IPaymentAmount;
    method: PaymentMethod;
    status: PaymentStatus;
    gateway: string; // 'razorpay', 'stripe', etc.
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
    metadata: Record<string, unknown>;
    refund?: IRefund;
    failureReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Payment Amount Schema
 */
const PaymentAmountSchema = new Schema({
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    services: {
        type: Number,
        required: true,
        min: 0,
    },
    homeServiceFee: {
        type: Number,
        default: 0,
        min: 0,
    },
    platformFee: {
        type: Number,
        required: true,
        min: 0,
    },
    tax: {
        type: Number,
        default: 0,
        min: 0,
    },
});

/**
 * Refund Schema
 */
const RefundSchema = new Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    reason: {
        type: String,
        required: true,
    },
    refundedAt: {
        type: Date,
        required: true,
    },
    refundedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gatewayRefundId: String,
});

/**
 * Payment Schema
 */
const PaymentSchema = new Schema<IPayment>(
    {
        appointmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        salonId: {
            type: Schema.Types.ObjectId,
            ref: 'Salon',
            required: true,
            index: true,
        },
        amount: {
            type: PaymentAmountSchema,
            required: true,
        },
        method: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.INITIATED,
            index: true,
        },
        gateway: {
            type: String,
            required: true,
            default: 'razorpay',
        },
        gatewayOrderId: {
            type: String,
            index: true,
        },
        gatewayPaymentId: {
            type: String,
            index: true,
        },
        gatewaySignature: String,
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        refund: RefundSchema,
        failureReason: String,
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.__v;
                delete ret.gatewaySignature; // Don't expose signature
                return ret;
            },
        },
    }
);

// Indexes for better query performance
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ salonId: 1, status: 1 });
PaymentSchema.index({ appointmentId: 1 });
PaymentSchema.index({ gatewayOrderId: 1 });
PaymentSchema.index({ gatewayPaymentId: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

export const PaymentModel = mongoose.model<IPayment>('Payment', PaymentSchema);
