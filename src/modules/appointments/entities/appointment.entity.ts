import mongoose, { Schema, Document } from 'mongoose';
import { AppointmentStatus, PaymentStatus, LocationType } from '@common/constants';
import { GeoPoint } from '@common/interfaces';

/**
 * Appointment pricing interface
 */
export interface IAppointmentPricing {
    services: number;
    homeServiceFee: number;
    platformFee: number;
    total: number;
}

/**
 * Appointment location interface
 */
export interface IAppointmentLocation {
    type: LocationType;
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        location?: GeoPoint;
    };
}

/**
 * Appointment document interface
 */
export interface IAppointment extends Document {
    userId: mongoose.Types.ObjectId;
    salonId: mongoose.Types.ObjectId;
    barberId?: mongoose.Types.ObjectId;
    serviceIds: string[]; // Service IDs from salon.services
    scheduledAt: Date;
    duration: number; // total minutes
    location: IAppointmentLocation;
    pricing: IAppointmentPricing;
    status: AppointmentStatus;
    paymentStatus: PaymentStatus;
    paymentId?: string;
    notes?: string;
    cancelledBy?: mongoose.Types.ObjectId;
    cancelReason?: string;
    cancelledAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Appointment Location Schema
 */
const AppointmentLocationSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(LocationType),
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: [Number],
        },
    },
});

/**
 * Appointment Pricing Schema
 */
const AppointmentPricingSchema = new Schema({
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
    total: {
        type: Number,
        required: true,
        min: 0,
    },
});

/**
 * Appointment Schema
 */
const AppointmentSchema = new Schema<IAppointment>(
    {
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
        barberId: {
            type: Schema.Types.ObjectId,
            ref: 'Barber',
            index: true,
        },
        serviceIds: [
            {
                type: String,
                required: true,
            },
        ],
        scheduledAt: {
            type: Date,
            required: true,
            index: true,
        },
        duration: {
            type: Number,
            required: true,
            min: 15,
        },
        location: {
            type: AppointmentLocationSchema,
            required: true,
        },
        pricing: {
            type: AppointmentPricingSchema,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(AppointmentStatus),
            default: AppointmentStatus.PENDING,
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.INITIATED,
            index: true,
        },
        paymentId: String,
        notes: String,
        cancelledBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        cancelReason: String,
        cancelledAt: Date,
        completedAt: Date,
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes for better query performance
AppointmentSchema.index({ userId: 1, status: 1 });
AppointmentSchema.index({ salonId: 1, scheduledAt: 1 });
AppointmentSchema.index({ barberId: 1, scheduledAt: 1 });
AppointmentSchema.index({ status: 1, scheduledAt: 1 });
AppointmentSchema.index({ createdAt: -1 });

// Compound index for availability checking
AppointmentSchema.index({ salonId: 1, barberId: 1, scheduledAt: 1, status: 1 });

export const AppointmentModel = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
