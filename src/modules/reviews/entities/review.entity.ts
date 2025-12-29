import mongoose, { Schema, Document } from 'mongoose';
import { ReviewStatus } from '@common/constants';

/**
 * Review response interface
 */
export interface IReviewResponse {
    message: string;
    respondedBy: mongoose.Types.ObjectId;
    respondedAt: Date;
}

/**
 * Review document interface
 */
export interface IReview extends Document {
    appointmentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    salonId: mongoose.Types.ObjectId;
    barberId?: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    serviceQuality: number;
    punctuality: number;
    cleanliness: number;
    valueForMoney: number;
    images?: string[];
    helpfulVotes: number;
    status: ReviewStatus;
    response?: IReviewResponse;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Review Response Schema
 */
const ReviewResponseSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    respondedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    respondedAt: {
        type: Date,
        required: true,
    },
});

/**
 * Review Schema
 */
const ReviewSchema = new Schema<IReview>(
    {
        appointmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
            unique: true, // One review per appointment
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
        barberId: {
            type: Schema.Types.ObjectId,
            ref: 'Barber',
            index: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        serviceQuality: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        punctuality: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        cleanliness: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        valueForMoney: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        images: [String],
        helpfulVotes: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: Object.values(ReviewStatus),
            default: ReviewStatus.APPROVED,
            index: true,
        },
        response: ReviewResponseSchema,
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes for better query performance
ReviewSchema.index({ salonId: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ barberId: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ helpfulVotes: -1 });

// Compound index for salon reviews
ReviewSchema.index({ salonId: 1, status: 1, rating: -1 });

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);
