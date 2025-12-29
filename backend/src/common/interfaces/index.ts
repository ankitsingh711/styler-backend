/**
 * Common interfaces used across the application
 */

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Geolocation coordinates
 */
export interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * GeoJSON Point
 */
export interface GeoPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Address interface
 */
export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    location?: GeoPoint;
}

/**
 * Time slot interface
 */
export interface TimeSlot {
    start: string; // HH:mm format
    end: string; // HH:mm format
}

/**
 * Operating hours for a single day
 */
export interface DayOperatingHours {
    day: string;
    isOpen: boolean;
    slots: TimeSlot[];
}

/**
 * File upload interface
 */
export interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

/**
 * Uploaded file result
 */
export interface UploadedFile {
    url: string;
    key: string;
    mimetype: string;
    size: number;
}

/**
 * JWT Payload
 */
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

/**
 * Token pair
 */
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

/**
 * Request with authenticated user
 */
export interface AuthenticatedRequest extends Express.Request {
    user?: JwtPayload;
    userId?: string;
}

/**
 * Search filters
 */
export interface SearchFilters {
    [key: string]: unknown;
}

/**
 * Email options
 */
export interface EmailOptions {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    template?: string;
    context?: Record<string, unknown>;
}

/**
 * SMS options
 */
export interface SMSOptions {
    to: string;
    message: string;
}

/**
 * Notification options
 */
export interface NotificationOptions {
    userId: string;
    type: string;
    channel: string;
    subject: string;
    message: string;
    metadata?: Record<string, unknown>;
}

/**
 * Rating aggregate
 */
export interface RatingAggregate {
    average: number;
    count: number;
    distribution?: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}
