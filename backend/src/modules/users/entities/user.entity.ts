import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, Gender } from '@common/constants';
import { GeoPoint } from '@common/interfaces';

/**
 * Address subdocument interface
 */
export interface IAddress {
    _id?: string;
    type: 'home' | 'work' | 'other';
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    location?: GeoPoint;
    isDefault: boolean;
}

/**
 * User preferences interface
 */
export interface IUserPreferences {
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    language: string;
    currency: string;
}

/**
 * User document interface
 */
export interface IUser extends Document {
    email: string;
    phone: string;
    password: string;
    name: string;
    gender?: Gender;
    dateOfBirth?: Date;
    profilePicture?: string;
    addresses: IAddress[];
    preferences: IUserPreferences;
    role: UserRole;
    customPermissions: string[];
    isActive: boolean;
    isVerified: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Address Schema
 */
const AddressSchema = new Schema<IAddress>({
    type: {
        type: String,
        enum: ['home', 'work', 'other'],
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
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
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere',
        },
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

/**
 * User Schema
 */
const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // Don't return password by default
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            enum: Object.values(Gender),
        },
        dateOfBirth: {
            type: Date,
        },
        profilePicture: {
            type: String,
        },
        addresses: [AddressSchema],
        preferences: {
            notifications: {
                email: {
                    type: Boolean,
                    default: true,
                },
                sms: {
                    type: Boolean,
                    default: true,
                },
                push: {
                    type: Boolean,
                    default: true,
                },
            },
            language: {
                type: String,
                default: 'en',
            },
            currency: {
                type: String,
                default: 'INR',
            },
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.CUSTOMER,
            index: true,
        },
        customPermissions: [
            {
                type: String,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        phoneVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes for better query performance
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ phone: 1, isActive: 1 });
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function (this: IUser) {
    return !!(this.lockUntil && this.lockUntil > new Date());
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
