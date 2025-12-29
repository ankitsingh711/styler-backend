import mongoose, { Schema, Document } from 'mongoose';
import { BarberStatus } from '@common/constants';

/**
 * Barber document interface
 */
export interface IBarberDocument {
    type: 'certificate' | 'id_proof' | 'qualification' | 'other';
    url: string;
    uploadedAt: Date;
    verifiedAt?: Date;
    verifiedBy?: mongoose.Types.ObjectId;
}

/**
 * Barber availability slot
 */
export interface IAvailabilitySlot {
    day: string; // 'monday', 'tuesday', etc.
    isAvailable: boolean;
    timeSlots: {
        start: string; // HH:mm format
        end: string;
    }[];
}

/**
 * Barber earnings
 */
export interface IBarberEarnings {
    total: number;
    pending: number;
    withdrawn: number;
}

/**
 * Barber document interface
 */
export interface IBarber extends Document {
    userId: mongoose.Types.ObjectId;
    salonId: mongoose.Types.ObjectId;
    displayName: string;
    bio?: string;
    specializations: string[];
    experience: number; // years
    certifications: string[];
    documents: IBarberDocument[];
    availability: IAvailabilitySlot[];
    profileImage?: string;
    rating: {
        average: number;
        count: number;
    };
    status: BarberStatus;
    earnings: IBarberEarnings;
    isActive: boolean;
    approvedAt?: Date;
    approvedBy?: mongoose.Types.ObjectId;
    rejectedReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Barber Document Schema
 */
const BarberDocumentSchema = new Schema({
    type: {
        type: String,
        enum: ['certificate', 'id_proof', 'qualification', 'other'],
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    verifiedAt: Date,
    verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

/**
 * Availability Slot Schema
 */
const AvailabilitySlotSchema = new Schema({
    day: {
        type: String,
        required: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    timeSlots: [
        {
            start: String,
            end: String,
        },
    ],
});

/**
 * Barber Schema
 */
const BarberSchema = new Schema<IBarber>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        salonId: {
            type: Schema.Types.ObjectId,
            ref: 'Salon',
            required: true,
            index: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        specializations: [String],
        experience: {
            type: Number,
            required: true,
            min: 0,
        },
        certifications: [String],
        documents: [BarberDocumentSchema],
        availability: [AvailabilitySlotSchema],
        profileImage: String,
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
            },
        },
        status: {
            type: String,
            enum: Object.values(BarberStatus),
            default: BarberStatus.PENDING,
            index: true,
        },
        earnings: {
            total: {
                type: Number,
                default: 0,
            },
            pending: {
                type: Number,
                default: 0,
            },
            withdrawn: {
                type: Number,
                default: 0,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        approvedAt: Date,
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        rejectedReason: String,
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
BarberSchema.index({ salonId: 1, status: 1 });
BarberSchema.index({ userId: 1 });
BarberSchema.index({ status: 1, createdAt: -1 });
BarberSchema.index({ 'rating.average': -1 });

export const BarberModel = mongoose.model<IBarber>('Barber', BarberSchema);
