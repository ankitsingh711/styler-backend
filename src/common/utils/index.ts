import { Pagination } from '@common/constants';
import { PaginationMeta, PaginationQuery } from '@common/interfaces';

/**
 * Utility functions for common operations
 */

/**
 * Generate pagination metadata
 */
export function generatePaginationMeta(
    page: number,
    limit: number,
    total: number
): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
}

/**
 * Parse pagination query parameters
 */
export function parsePaginationQuery(query: PaginationQuery): {
    page: number;
    limit: number;
    skip: number;
    sort: string;
    order: 'asc' | 'desc';
} {
    const page = Math.max(1, parseInt(String(query.page || Pagination.DEFAULT_PAGE), 10));
    const limit = Math.min(
        Pagination.MAX_LIMIT,
        Math.max(1, parseInt(String(query.limit || Pagination.DEFAULT_LIMIT), 10))
    );
    const skip = (page - 1) * limit;
    const sort = query.sort || 'createdAt';
    const order = query.order === 'asc' ? 'asc' : 'desc';

    return { page, limit, skip, sort, order };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Sanitize string for safe storage
 */
export function sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
}

/**
 * Generate random OTP
 */
export function generateOTP(length = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Format currency (INR)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                await sleep(delay);
            }
        }
    }

    throw lastError;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
}

/**
 * Remove undefined and null values from object
 */
export function removeNullish<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== null && value !== undefined)
    ) as Partial<T>;
}

/**
 * Parse time string (HH:mm) to minutes
 */
export function parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Format minutes to time string (HH:mm)
 */
export function formatMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Check if time range overlaps
 */
export function isTimeRangeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
): boolean {
    const start1Minutes = parseTimeToMinutes(start1);
    const end1Minutes = parseTimeToMinutes(end1);
    const start2Minutes = parseTimeToMinutes(start2);
    const end2Minutes = parseTimeToMinutes(end2);

    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
}
