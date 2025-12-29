import { barberRepository } from '../repositories/barber.repository';
import { salonRepository } from '@modules/salons/repositories/salon.repository';
import { userRepository } from '@modules/users/repositories/user.repository';
import { s3Service } from '@infrastructure/storage/s3.service';
import { logger } from '@infrastructure/logger/logger.service';
import {
    BadRequestException,
    NotFoundException,
    ForbiddenException,
} from '@common/exceptions';
import { IBarber, IBarberDocument, IAvailabilitySlot } from '../entities/barber.entity';
import { BarberStatus, UserRole } from '@common/constants';
import { PaginationMeta } from '@common/interfaces';

/**
 * Register Barber DTO
 */
export interface RegisterBarberDTO {
    salonId: string;
    displayName: string;
    bio?: string;
    specializations: string[];
    experience: number;
    certifications?: string[];
}

/**
 * Update Barber DTO
 */
export interface UpdateBarberDTO {
    displayName?: string;
    bio?: string;
    specializations?: string[];
    experience?: number;
    certifications?: string[];
}

/**
 * Barber Service
 * Handles barber registration, approval, and management
 */
export class BarberService {
    /**
     * Register as barber
     */
    async registerBarber(userId: string, dto: RegisterBarberDTO): Promise<IBarber> {
        // Check if user already registered as barber
        const existingBarber = await barberRepository.findByUserId(userId);
        if (existingBarber) {
            throw new BadRequestException('User already registered as barber');
        }

        // Verify salon exists
        const salon = await salonRepository.findById(dto.salonId);
        if (!salon || !salon.isActive) {
            throw new NotFoundException('Salon not found');
        }

        // Create barber profile
        const barber = await barberRepository.create({
            userId,
            salonId: dto.salonId,
            displayName: dto.displayName,
            bio: dto.bio,
            specializations: dto.specializations,
            experience: dto.experience,
            certifications: dto.certifications || [],
            documents: [],
            availability: this.getDefaultAvailability(),
            status: BarberStatus.PENDING,
            earnings: {
                total: 0,
                pending: 0,
                withdrawn: 0,
            },
            rating: {
                average: 0,
                count: 0,
            },
            isActive: true,
        });

        // Update user role to include BARBER
        await userRepository.updateById(userId, {
            role: UserRole.BARBER,
        });

        logger.info(`Barber registered: ${barber._id} for user ${userId}`);

        return barber;
    }

    /**
     * Get default availability (9 AM - 6 PM, all days)
     */
    private getDefaultAvailability(): IAvailabilitySlot[] {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return days.map((day) => ({
            day,
            isAvailable: day !== 'sunday', // Sunday off by default
            timeSlots: [
                {
                    start: '09:00',
                    end: '18:00',
                },
            ],
        }));
    }

    /**
     * Get barber by ID
     */
    async getBarberById(barberId: string): Promise<IBarber> {
        const barber = await barberRepository.findById(barberId);
        if (!barber) {
            throw new NotFoundException('Barber not found');
        }
        return barber;
    }

    /**
     * Update barber profile
     */
    async updateBarber(barberId: string, userId: string, dto: UpdateBarberDTO): Promise<IBarber> {
        const barber = await this.getBarberById(barberId);

        // Verify ownership
        if (barber.userId.toString() !== userId) {
            throw new ForbiddenException('You can only update your own profile');
        }

        const updated = await barberRepository.updateById(barberId, dto);
        if (!updated) {
            throw new NotFoundException('Barber not found');
        }

        logger.info(`Barber profile updated: ${barberId}`);

        return updated;
    }

    /**
     * Upload barber document
     */
    async uploadDocument(
        barberId: string,
        userId: string,
        file: Express.Multer.File,
        type: IBarberDocument['type']
    ): Promise<IBarber> {
        const barber = await this.getBarberById(barberId);

        // Verify ownership
        if (barber.userId.toString() !== userId) {
            throw new ForbiddenException('You can only upload documents for your own profile');
        }

        // Upload file to S3
        const uploadedFile = await s3Service.uploadFile(file, 'barber-documents');

        // Add document to barber
        const document: IBarberDocument = {
            type,
            url: uploadedFile.url,
            uploadedAt: new Date(),
        };

        const updated = await barberRepository.addDocument(barberId, document);
        if (!updated) {
            throw new NotFoundException('Barber not found');
        }

        logger.info(`Document uploaded for barber ${barberId}`);

        return updated;
    }

    /**
     * Update availability
     */
    async updateAvailability(
        barberId: string,
        userId: string,
        availability: IAvailabilitySlot[]
    ): Promise<IBarber> {
        const barber = await this.getBarberById(barberId);

        // Verify ownership
        if (barber.userId.toString() !== userId) {
            throw new ForbiddenException('You can only update your own availability');
        }

        const updated = await barberRepository.updateAvailability(barberId, availability);
        if (!updated) {
            throw new NotFoundException('Barber not found');
        }

        logger.info(`Availability updated for barber ${barberId}`);

        return updated;
    }

    /**
     * Get salon barbers
     */
    async getSalonBarbers(
        salonId: string,
        status?: BarberStatus,
        page?: number,
        limit?: number
    ): Promise<{ data: IBarber[]; meta?: PaginationMeta }> {
        return await barberRepository.findBySalonId(salonId, status, page, limit);
    }

    /**
     * Approve barber (salon owner)
     */
    async approveBarber(barberId: string, salonOwnerId: string): Promise<IBarber> {
        const barber = await this.getBarberById(barberId);

        // Verify salon ownership
        const salon = await salonRepository.findById(barber.salonId.toString());
        if (!salon) {
            throw new NotFoundException('Salon not found');
        }

        if (salon.ownerId.toString() !== salonOwnerId) {
            throw new ForbiddenException('Only salon owner can approve barbers');
        }

        // Update barber status
        const updated = await barberRepository.updateStatus(
            barberId,
            BarberStatus.APPROVED,
            salonOwnerId
        );

        if (!updated) {
            throw new NotFoundException('Barber not found');
        }

        // Add barber to salon
        await salonRepository.addBarber(barber.salonId.toString(), barberId);

        logger.info(`Barber ${barberId} approved by ${salonOwnerId}`);

        return updated;
    }

    /**
     * Reject barber (salon owner)
     */
    async rejectBarber(
        barberId: string,
        salonOwnerId: string,
        reason: string
    ): Promise<IBarber> {
        const barber = await this.getBarberById(barberId);

        // Verify salon ownership
        const salon = await salonRepository.findById(barber.salonId.toString());
        if (!salon) {
            throw new NotFoundException('Salon not found');
        }

        if (salon.ownerId.toString() !== salonOwnerId) {
            throw new ForbiddenException('Only salon owner can reject barbers');
        }

        // Update barber status
        const updated = await barberRepository.updateStatus(
            barberId,
            BarberStatus.REJECTED,
            undefined,
            reason
        );

        if (!updated) {
            throw new NotFoundException('Barber not found');
        }

        logger.info(`Barber ${barberId} rejected by ${salonOwnerId}`);

        return updated;
    }

    /**
     * Get pending barbers for approval
     */
    async getPendingBarbers(
        salonId: string,
        ownerId: string,
        page: number,
        limit: number
    ): Promise<{ data: IBarber[]; meta: PaginationMeta }> {
        // Verify salon ownership
        const salon = await salonRepository.findById(salonId);
        if (!salon) {
            throw new NotFoundException('Salon not found');
        }

        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to view pending barbers');
        }

        return await barberRepository.findPendingBarbers(salonId, page, limit);
    }
}

export const barberService = new BarberService();
