import mongoose, { Schema, Document } from 'mongoose';
import { GeoPoint, DayOperatingHours } from '@common/interfaces';
import { ServiceGender, DayOfWeek } from '@common/constants';

/**
 * Salon service interface
 */
export interface ISalonService {
    _id?: string;
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number; // in minutes
    gender: ServiceGender;
    image?: string;
    isActive: boolean;
}

/**
 * Operating hours interface
 */
export interface IOperatingHours {
    day: DayOfWeek;
    isOpen: boolean;
    slots: {
        start: string; // HH:mm format
        end: string;
    }[];
}

/**
 * Salon address interface
 */
export interface ISalonAddress {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    location: GeoPoint;
    landmark?: string;
}

/**
 * Salon document interface
 */
export interface ISalon extends Document {
    ownerId: mongoose.Types.ObjectId;
    businessName: string;
    displayName: string;
    description: string;
    images: string[];
    phone: string;
    email: string;
    address: ISalonAddress;
    operatingHours: IOperatingHours[];
    services: ISalonService[];
    barbers: mongoose.Types.ObjectId[];
    amenities: string[];
    rating: {
        average: number;
        count: number;
    };
    isVerified: boolean;
    isActive: boolean;
    verifiedAt?: Date;
    verifiedBy?: mongoose.Types.ObjectId;
    businessLicense?: string;
    taxId?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Salon Service Schema
 */
const SalonServiceSchema = new Schema<ISalonService>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    duration: {
        type: Number,
        required: true,
        min: 15,
    },
    gender: {
        type: String,
        enum: Object.values(ServiceGender),
        required: true,
    },
    image: String,
    isActive: {
        type: Boolean,
        default: true,
    },
});

/**
 * Operating Hours Schema
 */
const OperatingHoursSchema = new Schema<IOperatingHours>({
    day: {
        type: String,
        enum: Object.values(DayOfWeek),
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    },
    slots: [
        {
            start: {
                type: String,
                required: true,
                match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
            end: {
                type: String,
                required: true,
                match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
        },
    ],
});

/**
 * Salon Address Schema
 */
const SalonAddressSchema = new Schema<ISalonAddress>({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
        index: true,
    },
    state: {
        type: String,
        required: true,
        index: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: 'India',
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            index: '2dsphere',
        },
    },
    landmark: String,
});

/**
 * Salon Schema
 */
const SalonSchema = new Schema<ISalon>(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        address: {
            type: SalonAddressSchema,
            required: true,
        },
        operatingHours: [OperatingHoursSchema],
        services: [SalonServiceSchema],
        barbers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Barber',
            },
        ],
        amenities: [String],
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
                min: 0,
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        verifiedAt: Date,
        verifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        businessLicense: String,
        taxId: String,
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
SalonSchema.index({ 'address.location': '2dsphere' });
SalonSchema.index({ 'address.city': 1, isActive: 1 });
SalonSchema.index({ isVerified: 1, isActive: 1 });
SalonSchema.index({ ownerId: 1, isActive: 1 });
SalonSchema.index({ 'rating.average': -1 });
SalonSchema.index({ createdAt: -1 });

// Text index for search
SalonSchema.index({
    businessName: 'text',
    displayName: 'text',
    description: 'text',
    'address.city': 'text',
});

export const SalonModel = mongoose.model<ISalon>('Salon', SalonSchema);
