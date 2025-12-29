import { salonRepository, SalonSearchFilters, NearbySalonFilters } from '../repositories/salon.repository';
import { userRepository } from '@modules/users/repositories/user.repository';
import { s3Service } from '@infrastructure/storage/s3.service';
import { logger } from '@infrastructure/logger/logger.service';
import {
    BadRequestException,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@common/exceptions';
import { ISalon, ISalonService, IOperatingHours } from '../entities/salon.entity';
import { FileUpload, PaginationMeta, UploadedFile } from '@common/interfaces';
import { UserRole } from '@common/constants';

/**
 * Create Salon DTO
 */
export interface CreateSalonDTO {
    businessName: string;
    displayName: string;
    description: string;
    phone: string;
    email: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        landmark?: string;
        latitude: number;
        longitude: number;
    };
    amenities?: string[];
    businessLicense?: string;
    taxId?: string;
}

/**
 * Update Salon DTO
 */
export interface UpdateSalonDTO {
    displayName?: string;
    description?: string;
    phone?: string;
    email?: string;
    amenities?: string[];
}

/**
 * Salon Service
 * Handles salon business logic
 */
export class SalonService {
    /**
     * Register new salon
     */
    async registerSalon(ownerId: string, dto: CreateSalonDTO): Promise<ISalon> {
        // Verify owner exists and has salon_owner role
        const owner = await userRepository.findById(ownerId);
        if (!owner) {
            throw new NotFoundException('Owner not found');
        }

        // Update user role to salon_owner if not already
        if (owner.role !== UserRole.SALON_OWNER && owner.role !== UserRole.SUPER_ADMIN) {
            await userRepository.updateById(ownerId, { role: UserRole.SALON_OWNER });
        }

        // Create salon
        const salon = await salonRepository.create({
            ownerId,
            businessName: dto.businessName,
            displayName: dto.displayName,
            description: dto.description,
            phone: dto.phone,
            email: dto.email.toLowerCase(),
            address: {
                street: dto.address.street,
                city: dto.address.city,
                state: dto.address.state,
                pincode: dto.address.pincode,
                country: 'India',
                location: {
                    type: 'Point',
                    coordinates: [dto.address.longitude, dto.address.latitude],
                },
                landmark: dto.address.landmark,
            },
            amenities: dto.amenities || [],
            businessLicense: dto.businessLicense,
            taxId: dto.taxId,
            operatingHours: [],
            services: [],
            barbers: [],
            isActive: true,
            isVerified: false,
        });

        logger.info(`New salon registered: ${salon.businessName} by ${ownerId}`);

        return salon;
    }

    /**
     * Get salon by ID
     */
    async getSalonById(salonId: string): Promise<ISalon> {
        const salon = await salonRepository.findById(salonId);
        if (!salon || !salon.isActive) {
            throw new NotFoundException('Salon not found');
        }
        return salon;
    }

    /**
     * Update salon profile
     */
    async updateSalon(salonId: string, ownerId: string, dto: UpdateSalonDTO): Promise<ISalon> {
        const salon = await this.getSalonById(salonId);

        // Verify ownership
        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to update this salon');
        }

        const updated = await salonRepository.updateById(salonId, dto);
        if (!updated) {
            throw new NotFoundException('Salon not found');
        }

        logger.info(`Salon updated: ${salonId}`);

        return updated;
    }

    /**
     * Upload salon images
     */
    async uploadSalonImages(
        salonId: string,
        ownerId: string,
        files: FileUpload[]
    ): Promise<string[]> {
        const salon = await this.getSalonById(salonId);

        // Verify ownership
        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to update this salon');
        }

        // Upload images to S3
        const uploadedFiles = await s3Service.uploadMultipleFiles(files, 'salons');
        const imageUrls = uploadedFiles.map((file) => file.url);

        // Update salon with new images
        await salonRepository.updateById(salonId, {
            $push: { images: { $each: imageUrls } },
        });

        logger.info(`Uploaded ${imageUrls.length} images for salon: ${salonId}`);

        return imageUrls;
    }

    /**
     * Add service to salon
     */
    async addService(salonId: string, ownerId: string, service: ISalonService): Promise<ISalon> {
        const salon = await this.getSalonById(salonId);

        // Verify ownership
        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to update this salon');
        }

        const updated = await salonRepository.addService(salonId, service);
        if (!updated) {
            throw new NotFoundException('Salon not found');
        }

        logger.info(`Service added to salon ${salonId}: ${service.name}`);

        return updated;
    }

    /**
     * Update service
     */
    async updateService(
        salonId: string,
        serviceId: string,
        ownerId: string,
        updates: Partial<ISalonService>
    ): Promise<ISalon> {
        const salon = await this.getSalonById(salonId);

        // Verify ownership
        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to update this salon');
        }

        const updated = await salonRepository.updateService(salonId, serviceId, updates);
        if (!updated) {
            throw new NotFoundException('Service not found');
        }

        logger.info(`Service updated in salon ${salonId}: ${serviceId}`);

        return updated;
    }

    /**
     * Remove service
     */
    async removeService(salonId: string, serviceId: string, ownerId: string): Promise<ISalon> {
        const salon = await this.getSalonById(salonId);

        // Verify ownership
        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to update this salon');
        }

        const updated = await salonRepository.removeService(salonId, serviceId);
        if (!updated) {
            throw new NotFoundException('Salon not found');
        }

        logger.info(`Service removed from salon ${salonId}: ${serviceId}`);

        return updated;
    }

    /**
     * Update operating hours
     */
    async updateOperatingHours(
        salonId: string,
        ownerId: string,
        operatingHours: IOperatingHours[]
    ): Promise<ISalon> {
        const salon = await this.getSalonById(salonId);

        // Verify ownership
        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to update this salon');
        }

        const updated = await salonRepository.updateById(salonId, { operatingHours });
        if (!updated) {
            throw new NotFoundException('Salon not found');
        }

        logger.info(`Operating hours updated for salon: ${salonId}`);

        return updated;
    }

    /**
     * Search nearby salons
     */
    async searchNearbySalons(
        filters: NearbySalonFilters,
        page: number,
        limit: number
    ): Promise<{ data: ISalon[]; meta: PaginationMeta }> {
        return await salonRepository.findNearby(filters, page, limit);
    }

    /**
     * Search salons
     */
    async searchSalons(
        filters: SalonSearchFilters,
        page: number,
        limit: number
    ): Promise<{ data: ISalon[]; meta: PaginationMeta }> {
        return await salonRepository.search(filters, page, limit);
    }

    /**
     * Get salons by owner
     */
    async getSalonsByOwner(ownerId: string): Promise<ISalon[]> {
        return await salonRepository.findByOwnerId(ownerId);
    }

    /**
     * Get salon services
     */
    async getSalonServices(salonId: string): Promise<ISalonService[]> {
        return await salonRepository.getSalonServices(salonId);
    }

    /**
     * Delete salon (soft delete)
     */
    async deleteSalon(salonId: string, ownerId: string): Promise<void> {
        const salon = await this.getSalonById(salonId);

        // Verify ownership
        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to delete this salon');
        }

        await salonRepository.softDelete(salonId);

        logger.info(`Salon deleted: ${salonId}`);
    }
}

export const salonService = new SalonService();
