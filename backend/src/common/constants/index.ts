/**
 * Application-wide constants
 */

/**
 * User roles in the system
 */
export enum UserRole {
    SUPER_ADMIN = 'superadmin',
    SALON_OWNER = 'salon_owner',
    BARBER = 'barber',
    CUSTOMER = 'customer',
    RECEPTIONIST = 'receptionist',
    SUPPORT = 'support',
}

/**
 * Appointment status
 */
export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
}

/**
 * Payment status
 */
export enum PaymentStatus {
    INITIATED = 'initiated',
    PROCESSING = 'processing',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

/**
 * Payment methods
 */
export enum PaymentMethod {
    UPI = 'upi',
    DEBIT_CARD = 'debit_card',
    CREDIT_CARD = 'credit_card',
    WALLET = 'wallet',
}

/**
 * Barber status
 */
export enum BarberStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended',
}

/**
 * Review status
 */
export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

/**
 * Notification types
 */
export enum NotificationType {
    APPOINTMENT = 'appointment',
    PAYMENT = 'payment',
    REVIEW = 'review',
    PROMOTION = 'promotion',
    SYSTEM = 'system',
}

/**
 * Notification channels
 */
export enum NotificationChannel {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
}

/**
 * Gender options
 */
export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

/**
 * Service gender target
 */
export enum ServiceGender {
    MALE = 'male',
    FEMALE = 'female',
    UNISEX = 'unisex',
}

/**
 * Address types
 */
export enum AddressType {
    HOME = 'home',
    WORK = 'work',
    OTHER = 'other',
}

/**
 * Location service type
 */
export enum LocationType {
    SALON = 'salon',
    HOME = 'home',
}

/**
 * Document types for barber verification
 */
export enum DocumentType {
    CERTIFICATE = 'certificate',
    ID_PROOF = 'id_proof',
    QUALIFICATION = 'qualification',
    OTHER = 'other',
}

/**
 * Days of week
 */
export enum DayOfWeek {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}

/**
 * HTTP status codes
 */
export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

/**
 * Error codes
 */
export enum ErrorCode {
    // Authentication errors
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',

    // Validation errors
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INVALID_INPUT = 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

    // Resource errors
    NOT_FOUND = 'NOT_FOUND',
    ALREADY_EXISTS = 'ALREADY_EXISTS',
    CONFLICT = 'CONFLICT',

    // Business logic errors
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
    APPOINTMENT_UNAVAILABLE = 'APPOINTMENT_UNAVAILABLE',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    BARBER_NOT_AVAILABLE = 'BARBER_NOT_AVAILABLE',

    // System errors
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Cache keys
 */
export const CacheKeys = {
    USER_PROFILE: (userId: string) => `user:profile:${userId}`,
    SALON_DETAILS: (salonId: string) => `salon:details:${salonId}`,
    BARBER_DETAILS: (barberId: string) => `barber:details:${barberId}`,
    NEARBY_SALONS: (lat: number, lng: number, radius: number) =>
        `salons:nearby:${lat}:${lng}:${radius}`,
    BARBER_AVAILABILITY: (barberId: string, date: string) =>
        `barber:availability:${barberId}:${date}`,
    SALON_SERVICES: (salonId: string) => `salon:services:${salonId}`,
    REVIEWS: (targetType: string, targetId: string) => `reviews:${targetType}:${targetId}`,
} as const;

/**
 * Cache TTL (in seconds)
 */
export const CacheTTL = {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    DAY: 86400, // 24 hours
} as const;

/**
 * Pagination defaults
 */
export const Pagination = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;

/**
 * File upload constraints
 */
export const FileUpload = {
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Distance units and defaults
 */
export const Distance = {
    DEFAULT_SEARCH_RADIUS_KM: 10,
    MAX_SEARCH_RADIUS_KM: 50,
    EARTH_RADIUS_KM: 6371,
} as const;
