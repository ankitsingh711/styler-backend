import { BaseRepository } from '@infrastructure/database/base.repository';
import { AppointmentModel, IAppointment } from '../entities/appointment.entity';
import { AppointmentStatus } from '@common/constants';
import { PaginationMeta } from '@common/interfaces';
import mongoose from 'mongoose';

/**
 * Appointment filters
 */
export interface AppointmentFilters {
    userId?: string;
    salonId?: string;
    barberId?: string;
    status?: AppointmentStatus;
    startDate?: Date;
    endDate?: Date;
}

/**
 * Appointment Repository
 * Handles all database operations for appointments
 */
export class AppointmentRepository extends BaseRepository<IAppointment> {
    constructor() {
        super(AppointmentModel);
    }

    /**
     * Find appointments by user ID
     */
    async findByUserId(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ data: IAppointment[]; meta: PaginationMeta }> {
        return await this.findWithPagination(
            { userId: new mongoose.Types.ObjectId(userId) },
            page,
            limit,
            { scheduledAt: -1 }
        );
    }

    /**
     * Find appointments by salon ID
     */
    async findBySalonId(
        salonId: string,
        filters: Partial<AppointmentFilters>,
        page: number,
        limit: number
    ): Promise<{ data: IAppointment[]; meta: PaginationMeta }> {
        const query: Record<string, unknown> = {
            salonId: new mongoose.Types.ObjectId(salonId),
        };

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.startDate && filters.endDate) {
            query.scheduledAt = {
                $gte: filters.startDate,
                $lte: filters.endDate,
            };
        }

        return await this.findWithPagination(query, page, limit, { scheduledAt: 1 });
    }

    /**
     * Find appointments by barber ID
     */
    async findByBarberId(
        barberId: string,
        page: number,
        limit: number
    ): Promise<{ data: IAppointment[]; meta: PaginationMeta }> {
        return await this.findWithPagination(
            { barberId: new mongoose.Types.ObjectId(barberId) },
            page,
            limit,
            { scheduledAt: 1 }
        );
    }

    /**
     * Check if time slot is available
     */
    async isSlotAvailable(
        salonId: string,
        barberId: string | undefined,
        scheduledAt: Date,
        duration: number,
        excludeAppointmentId?: string
    ): Promise<boolean> {
        const endTime = new Date(scheduledAt.getTime() + duration * 60000);

        const query: Record<string, unknown> = {
            salonId: new mongoose.Types.ObjectId(salonId),
            status: {
                $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS],
            },
            $or: [
                // Overlapping at start
                {
                    scheduledAt: { $lte: scheduledAt },
                    $expr: {
                        $gte: [{ $add: ['$scheduledAt', { $multiply: ['$duration', 60000] }] }, scheduledAt],
                    },
                },
                // Overlapping at end
                {
                    scheduledAt: { $gte: scheduledAt, $lt: endTime },
                },
                // Completely containing
                {
                    scheduledAt: { $gte: scheduledAt },
                    $expr: {
                        $lte: [{ $add: ['$scheduledAt', { $multiply: ['$duration', 60000] }] }, endTime],
                    },
                },
            ],
        };

        if (barberId) {
            query.barberId = new mongoose.Types.ObjectId(barberId);
        }

        if (excludeAppointmentId) {
            query._id = { $ne: new mongoose.Types.ObjectId(excludeAppointmentId) };
        }

        const conflictingAppointments = await this.count(query);
        return conflictingAppointments === 0;
    }

    /**
     * Update appointment status
     */
    async updateStatus(appointmentId: string, status: AppointmentStatus): Promise<IAppointment | null> {
        const updates: Record<string, unknown> = { status };

        if (status === AppointmentStatus.COMPLETED) {
            updates.completedAt = new Date();
        }

        return await this.updateById(appointmentId, updates);
    }

    /**
     * Cancel appointment
     */
    async cancelAppointment(
        appointmentId: string,
        cancelledBy: string,
        reason?: string
    ): Promise<IAppointment | null> {
        return await this.updateById(appointmentId, {
            status: AppointmentStatus.CANCELLED,
            cancelledBy: new mongoose.Types.ObjectId(cancelledBy),
            cancelReason: reason,
            cancelledAt: new Date(),
        });
    }

    /**
     * Get upcoming appointments for user
     */
    async getUpcomingAppointments(userId: string): Promise<IAppointment[]> {
        return await this.find({
            userId: new mongoose.Types.ObjectId(userId),
            scheduledAt: { $gte: new Date() },
            status: {
                $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
            },
        });
    }

    /**
     * Get appointment statistics for salon
     */
    async getSalonStatistics(salonId: string, startDate: Date, endDate: Date): Promise<{
        total: number;
        completed: number;
        cancelled: number;
        revenue: number;
    }> {
        const stats = await this.aggregate([
            {
                $match: {
                    salonId: new mongoose.Types.ObjectId(salonId),
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', AppointmentStatus.COMPLETED] }, 1, 0] },
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ['$status', AppointmentStatus.CANCELLED] }, 1, 0] },
                    },
                    revenue: {
                        $sum: {
                            $cond: [{ $eq: ['$status', AppointmentStatus.COMPLETED] }, '$pricing.total', 0],
                        },
                    },
                },
            },
        ]);

        return stats[0] || { total: 0, completed: 0, cancelled: 0, revenue: 0 };
    }
}

export const appointmentRepository = new AppointmentRepository();
