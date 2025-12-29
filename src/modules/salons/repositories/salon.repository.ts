import { BaseRepository } from '@infrastructure/database/base.repository';
import { SalonModel, ISalon, ISalonService } from '../entities/salon.entity';
import { PaginationMeta } from '@common/interfaces';
import { generatePaginationMeta } from '@common/utils';
import mongoose from 'mongoose';

/**
 * Salon search filters
 */
export interface SalonSearchFilters {
    city?: string;
    state?: string;
    serviceCategory?: string;
    minRating?: number;
    isVerified?: boolean;
    searchText?: string;
}

/**
 * Nearby salon filters
 */
export interface NearbySalonFilters extends SalonSearchFilters {
    latitude: number;
    longitude: number;
    radiusKm?: number;
}

/**
 * Salon Repository
 * Handles all database operations for salons
 */
export class SalonRepository extends BaseRepository<ISalon> {
    constructor() {
        super(SalonModel);
    }

    /**
     * Find salon by owner ID
     */
    async findByOwnerId(ownerId: string): Promise<ISalon[]> {
        return await this.find({ ownerId: new mongoose.Types.ObjectId(ownerId), isActive: true });
    }

    /**
     * Find nearby salons using geospatial query
     */
    async findNearby(
        filters: NearbySalonFilters,
        page: number,
        limit: number
    ): Promise<{ data: ISalon[]; meta: PaginationMeta }> {
        const { latitude, longitude, radiusKm = 10, ...otherFilters } = filters;

        const query: Record<string, unknown> = {
            isActive: true,
            'address.location': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: radiusKm * 1000, // Convert km to meters
                },
            },
        };

        // Apply additional filters
        if (otherFilters.city) {
            query['address.city'] = new RegExp(otherFilters.city, 'i');
        }

        if (otherFilters.state) {
            query['address.state'] = new RegExp(otherFilters.state, 'i');
        }

        if (otherFilters.serviceCategory) {
            query['services.category'] = otherFilters.serviceCategory;
        }

        if (otherFilters.minRating) {
            query['rating.average'] = { $gte: otherFilters.minRating };
        }

        if (otherFilters.isVerified !== undefined) {
            query.isVerified = otherFilters.isVerified;
        }

        if (otherFilters.searchText) {
            query.$text = { $search: otherFilters.searchText };
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            SalonModel.find(query).skip(skip).limit(limit).exec(),
            SalonModel.countDocuments(query).exec(),
        ]);

        const meta = generatePaginationMeta(page, limit, total);

        return { data, meta };
    }

    /**
     * Search salons with filters
     */
    async search(
        filters: SalonSearchFilters,
        page: number,
        limit: number
    ): Promise<{ data: ISalon[]; meta: PaginationMeta }> {
        const query: Record<string, unknown> = { isActive: true };

        if (filters.city) {
            query['address.city'] = new RegExp(filters.city, 'i');
        }

        if (filters.state) {
            query['address.state'] = new RegExp(filters.state, 'i');
        }

        if (filters.serviceCategory) {
            query['services.category'] = filters.serviceCategory;
        }

        if (filters.minRating) {
            query['rating.average'] = { $gte: filters.minRating };
        }

        if (filters.isVerified !== undefined) {
            query.isVerified = filters.isVerified;
        }

        if (filters.searchText) {
            query.$text = { $search: filters.searchText };
        }

        return await this.findWithPagination(query, page, limit, { 'rating.average': -1 });
    }

    /**
     * Add service to salon
     */
    async addService(salonId: string, service: ISalonService): Promise<ISalon | null> {
        return await SalonModel.findByIdAndUpdate(
            salonId,
            { $push: { services: service } },
            { new: true, runValidators: true }
        ).exec();
    }

    /**
     * Update service
     */
    async updateService(
        salonId: string,
        serviceId: string,
        updates: Partial<ISalonService>
    ): Promise<ISalon | null> {
        return await SalonModel.findOneAndUpdate(
            { _id: salonId, 'services._id': serviceId },
            { $set: { 'services.$': { ...updates, _id: serviceId } } },
            { new: true, runValidators: true }
        ).exec();
    }

    /**
     * Remove service
     */
    async removeService(salonId: string, serviceId: string): Promise<ISalon | null> {
        return await SalonModel.findByIdAndUpdate(
            salonId,
            { $pull: { services: { _id: serviceId } } },
            { new: true }
        ).exec();
    }

    /**
     * Add barber to salon
     */
    async addBarber(salonId: string, barberId: string): Promise<ISalon | null> {
        return await SalonModel.findByIdAndUpdate(
            salonId,
            { $addToSet: { barbers: new mongoose.Types.ObjectId(barberId) } },
            { new: true }
        ).exec();
    }

    /**
     * Remove barber from salon
     */
    async removeBarber(salonId: string, barberId: string): Promise<ISalon | null> {
        return await SalonModel.findByIdAndUpdate(
            salonId,
            { $pull: { barbers: new mongoose.Types.ObjectId(barberId) } },
            { new: true }
        ).exec();
    }

    /**
     * Update rating
     */
    async updateRating(salonId: string, newAverage: number, newCount: number): Promise<void> {
        await SalonModel.updateOne(
            { _id: salonId },
            {
                $set: {
                    'rating.average': newAverage,
                    'rating.count': newCount,
                },
            }
        ).exec();
    }

    /**
     * Verify salon
     */
    async verifySalon(salonId: string, verifiedBy: string): Promise<ISalon | null> {
        return await this.updateById(salonId, {
            isVerified: true,
            verifiedAt: new Date(),
            verifiedBy: new mongoose.Types.ObjectId(verifiedBy),
        });
    }

    /**
     * Get salon services
     */
    async getSalonServices(salonId: string): Promise<ISalonService[]> {
        const salon = await this.findById(salonId);
        return salon?.services || [];
    }

    /**
     * Get active salons count
     */
    async getActiveSalonsCount(): Promise<number> {
        return await this.count({ isActive: true, isVerified: true });
    }

    /**
     * Soft delete salon
     */
    async softDelete(salonId: string): Promise<void> {
        await this.updateById(salonId, { isActive: false });
    }
}

export const salonRepository = new SalonRepository();
