import { BaseRepository } from '@infrastructure/database/base.repository';
import { BarberModel, IBarber, IBarberDocument } from '../entities/barber.entity';
import { BarberStatus } from '@common/constants';
import { PaginationMeta } from '@common/interfaces';
import mongoose from 'mongoose';

/**
 * Barber Repository
 * Handles all database operations for barbers
 */
export class BarberRepository extends BaseRepository<IBarber> {
    constructor() {
        super(BarberModel);
    }

    /**
     * Find barber by user ID
     */
    async findByUserId(userId: string): Promise<IBarber | null> {
        return await this.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    }

    /**
     * Find barbers by salon ID
     */
    async findBySalonId(
        salonId: string,
        status?: BarberStatus,
        page?: number,
        limit?: number
    ): Promise<{ data: IBarber[]; meta?: PaginationMeta }> {
        const query: Record<string, unknown> = {
            salonId: new mongoose.Types.ObjectId(salonId),
        };

        if (status) {
            query.status = status;
        }

        if (page && limit) {
            return await this.findWithPagination(query, page, limit, { createdAt: -1 });
        }

        const data = await this.find(query);
        return { data };
    }

    /**
     * Find pending barbers for approval
     */
    async findPendingBarbers(
        salonId: string,
        page: number,
        limit: number
    ): Promise<{ data: IBarber[]; meta: PaginationMeta }> {
        return await this.findWithPagination(
            {
                salonId: new mongoose.Types.ObjectId(salonId),
                status: BarberStatus.PENDING,
            },
            page,
            limit,
            { createdAt: -1 }
        );
    }

    /**
     * Update barber status
     */
    async updateStatus(
        barberId: string,
        status: BarberStatus,
        approvedBy?: string,
        rejectedReason?: string
    ): Promise<IBarber | null> {
        const updates: Record<string, unknown> = { status };

        if (status === BarberStatus.APPROVED && approvedBy) {
            updates.approvedAt = new Date();
            updates.approvedBy = new mongoose.Types.ObjectId(approvedBy);
        }

        if (status === BarberStatus.REJECTED && rejectedReason) {
            updates.rejectedReason = rejectedReason;
        }

        return await this.updateById(barberId, updates);
    }

    /**
     * Add document to barber
     */
    async addDocument(barberId: string, document: IBarberDocument): Promise<IBarber | null> {
        return await BarberModel.findByIdAndUpdate(
            barberId,
            { $push: { documents: document } },
            { new: true }
        ).exec();
    }

    /**
     * Update availability
     */
    async updateAvailability(
        barberId: string,
        availability: IBarber['availability']
    ): Promise<IBarber | null> {
        return await this.updateById(barberId, { availability });
    }

    /**
     * Update rating
     */
    async updateRating(barberId: string, newAverage: number, newCount: number): Promise<void> {
        await BarberModel.updateOne(
            { _id: barberId },
            {
                $set: {
                    'rating.average': newAverage,
                    'rating.count': newCount,
                },
            }
        ).exec();
    }

    /**
     * Update earnings
     */
    async updateEarnings(
        barberId: string,
        earnings: Partial<IBarber['earnings']>
    ): Promise<IBarber | null> {
        const updateFields: Record<string, number> = {};

        if (earnings.total !== undefined) {
            updateFields['earnings.total'] = earnings.total;
        }
        if (earnings.pending !== undefined) {
            updateFields['earnings.pending'] = earnings.pending;
        }
        if (earnings.withdrawn !== undefined) {
            updateFields['earnings.withdrawn'] = earnings.withdrawn;
        }

        return await this.updateById(barberId, updateFields);
    }

    /**
     * Get top rated barbers
     */
    async getTopRatedBarbers(limit: number): Promise<IBarber[]> {
        return await BarberModel.find({
            status: BarberStatus.APPROVED,
            isActive: true,
            'rating.count': { $gte: 5 },
        })
            .sort({ 'rating.average': -1, 'rating.count': -1 })
            .limit(limit)
            .exec();
    }

    /**
     * Soft delete barber
     */
    async softDelete(barberId: string): Promise<void> {
        await this.updateById(barberId, { isActive: false });
    }
}

export const barberRepository = new BarberRepository();
