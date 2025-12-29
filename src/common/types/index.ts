/**
 * Common type definitions
 */

import { UserRole, AppointmentStatus, PaymentStatus, BarberStatus } from '@common/constants';

/**
 * User role type
 */
export type UserRoleType = `${UserRole}`;

/**
 * Appointment status type
 */
export type AppointmentStatusType = `${AppointmentStatus}`;

/**
 * Payment status type
 */
export type PaymentStatusType = `${PaymentStatus}`;

/**
 * Barber status type
 */
export type BarberStatusType = `${BarberStatus}`;

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Async function type
 */
export type AsyncFunction<T = void> = (...args: unknown[]) => Promise<T>;

/**
 * Constructor type
 */
export type Constructor<T = object> = new (...args: unknown[]) => T;

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Optional type
 */
export type Optional<T> = T | undefined;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * ID type
 */
export type ID = string;

/**
 * Timestamp type
 */
export type Timestamp = Date;

/**
 * MongoDB ObjectId type
 */
export type ObjectId = string;

/**
 * Omit type with multiple keys
 */
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

/**
 * Pick type with  multiple keys
 */
export type PickMultiple<T, K extends keyof T> = Pick<T, K>;
