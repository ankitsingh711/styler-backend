import mongoose from 'mongoose';
import { appointmentRepository } from '../repositories/appointment.repository';
import { salonRepository } from '@modules/salons/repositories/salon.repository';
import { userRepository } from '@modules/users/repositories/user.repository';
import { logger } from '@infrastructure/logger/logger.service';
import {
    BadRequestException,
    NotFoundException,
    ForbiddenException,
} from '@common/exceptions';
import { IAppointment } from '../entities/appointment.entity';
import { AppointmentStatus, LocationType } from '@common/constants';
import { config } from '@config/environment';
import { PaginationMeta } from '@common/interfaces';

/**
 * Create Appointment DTO
 */
export interface CreateAppointmentDTO {
    salonId: string;
    barberId?: string;
    serviceIds: string[];
    scheduledAt: Date;
    locationType: LocationType;
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        latitude?: number;
        longitude?: number;
    };
    notes?: string;
}

/**
 * Appointment Service
 * Handles appointment booking and management
 */
export class AppointmentService {
    private readonly platformCommission = config.platform.commissionPercentage;
    private readonly homeServiceFee = config.platform.homeServiceFeePercentage;

    /**
     * Calculate pricing for appointment
     */
    private calculatePricing(
        servicesTotal: number,
        locationType: LocationType
    ): { services: number; homeServiceFee: number; platformFee: number; total: number } {
        const homeServiceFee =
            locationType === LocationType.HOME ? (servicesTotal * this.homeServiceFee) / 100 : 0;

        const subtotal = servicesTotal + homeServiceFee;
        const platformFee = (subtotal * this.platformCommission) / 100;
        const total = subtotal + platformFee;

        return {
            services: servicesTotal,
            homeServiceFee,
            platformFee,
            total: Math.round(total * 100) / 100, // Round to 2 decimal places
        };
    }

    /**
     * Create new appointment
     */
    async createAppointment(userId: string, dto: CreateAppointmentDTO): Promise<IAppointment> {
        // Verify user exists
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify salon exists
        const salon = await salonRepository.findById(dto.salonId);
        if (!salon || !salon.isActive) {
            throw new NotFoundException('Salon not found');
        }

        // Validate service IDs and calculate total
        if (!dto.serviceIds || dto.serviceIds.length === 0) {
            throw new BadRequestException('At least one service must be selected');
        }

        const selectedServices = salon.services.filter(
            (service) => dto.serviceIds.includes(service._id?.toString() || '') && service.isActive
        );

        if (selectedServices.length !== dto.serviceIds.length) {
            throw new BadRequestException('One or more selected services are invalid or inactive');
        }

        const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
        const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

        // Check if scheduled time is in the future
        const scheduledAt = new Date(dto.scheduledAt);
        if (scheduledAt <= new Date()) {
            throw new BadRequestException('Appointment must be scheduled for a future time');
        }

        // Check slot availability
        const isAvailable = await appointmentRepository.isSlotAvailable(
            dto.salonId,
            dto.barberId,
            scheduledAt,
            totalDuration
        );

        if (!isAvailable) {
            throw new BadRequestException('Selected time slot is not available');
        }

        // Validate home service address
        if (dto.locationType === LocationType.HOME) {
            if (!dto.address) {
                throw new BadRequestException('Address is required for home service');
            }
        }

        // Calculate pricing
        const pricing = this.calculatePricing(servicesTotal, dto.locationType);

        // Create appointment
        const appointment = await appointmentRepository.create({
            userId: new mongoose.Types.ObjectId(userId),
            salonId: new mongoose.Types.ObjectId(dto.salonId),
            barberId: dto.barberId ? new mongoose.Types.ObjectId(dto.barberId) : undefined,
            serviceIds: dto.serviceIds,
            scheduledAt,
            duration: totalDuration,
            location: {
                type: dto.locationType,
                ...(dto.address && {
                    address: {
                        ...dto.address,
                        ...(dto.address.latitude &&
                            dto.address.longitude && {
                            location: {
                                type: 'Point',
                                coordinates: [dto.address.longitude, dto.address.latitude],
                            },
                        }),
                    },
                }),
            },
            pricing,
            status: AppointmentStatus.PENDING,
            notes: dto.notes,
        });

        logger.info(`Appointment created: ${appointment._id} for user ${userId}`);

        return appointment;
    }

    /**
     * Get appointment by ID
     */
    async getAppointmentById(appointmentId: string, userId?: string): Promise<IAppointment> {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        // If userId is provided, verify ownership
        if (userId && appointment.userId.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to view this appointment');
        }

        return appointment;
    }

    /**
     * Get user appointments
     */
    async getUserAppointments(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ data: IAppointment[]; meta: PaginationMeta }> {
        return await appointmentRepository.findByUserId(userId, page, limit);
    }

    /**
     * Get salon appointments
     */
    async getSalonAppointments(
        salonId: string,
        ownerId: string,
        filters: { status?: AppointmentStatus; startDate?: Date; endDate?: Date },
        page: number,
        limit: number
    ): Promise<{ data: IAppointment[]; meta: PaginationMeta }> {
        // Verify salon ownership
        const salon = await salonRepository.findById(salonId);
        if (!salon) {
            throw new NotFoundException('Salon not found');
        }

        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to view these appointments');
        }

        return await appointmentRepository.findBySalonId(salonId, filters, page, limit);
    }

    /**
     * Update appointment status
     */
    async updateAppointmentStatus(
        appointmentId: string,
        status: AppointmentStatus,
        userId: string
    ): Promise<IAppointment> {
        const appointment = await this.getAppointmentById(appointmentId);

        // Verify permission (salon owner or customer for cancellation)
        const salon = await salonRepository.findById(appointment.salonId.toString());
        const isOwner = salon?.ownerId.toString() === userId;
        const isCustomer = appointment.userId.toString() === userId;

        if (!isOwner && !isCustomer) {
            throw new ForbiddenException('You do not have permission to update this appointment');
        }

        // Validate status transition
        if (status === AppointmentStatus.CANCELLED && !isOwner && !isCustomer) {
            throw new ForbiddenException('Only salon owner or customer can cancel appointment');
        }

        const updated = await appointmentRepository.updateStatus(appointmentId, status);
        if (!updated) {
            throw new NotFoundException('Appointment not found');
        }

        logger.info(`Appointment ${appointmentId} status updated to ${status}`);

        return updated;
    }

    /**
     * Cancel appointment
     */
    async cancelAppointment(
        appointmentId: string,
        userId: string,
        reason?: string
    ): Promise<IAppointment> {
        const appointment = await this.getAppointmentById(appointmentId);

        // Verify permission
        const salon = await salonRepository.findById(appointment.salonId.toString());
        const isOwner = salon?.ownerId.toString() === userId;
        const isCustomer = appointment.userId.toString() === userId;

        if (!isOwner && !isCustomer) {
            throw new ForbiddenException('You do not have permission to cancel this appointment');
        }

        // Check if appointment can be cancelled
        if (
            appointment.status === AppointmentStatus.COMPLETED ||
            appointment.status === AppointmentStatus.CANCELLED
        ) {
            throw new BadRequestException('Cannot cancel a completed or already cancelled appointment');
        }

        const cancelled = await appointmentRepository.cancelAppointment(appointmentId, userId, reason);
        if (!cancelled) {
            throw new NotFoundException('Appointment not found');
        }

        logger.info(`Appointment ${appointmentId} cancelled by user ${userId}`);

        return cancelled;
    }

    /**
     * Get upcoming appointments for user
     */
    async getUpcomingAppointments(userId: string): Promise<IAppointment[]> {
        return await appointmentRepository.getUpcomingAppointments(userId);
    }

    /**
     * Check slot availability
     */
    async checkSlotAvailability(
        salonId: string,
        barberId: string | undefined,
        scheduledAt: Date,
        duration: number
    ): Promise<boolean> {
        return await appointmentRepository.isSlotAvailable(salonId, barberId, scheduledAt, duration);
    }

    /**
     * Get salon statistics
     */
    async getSalonStatistics(
        salonId: string,
        ownerId: string,
        startDate: Date,
        endDate: Date
    ): Promise<{ total: number; completed: number; cancelled: number; revenue: number }> {
        // Verify salon ownership
        const salon = await salonRepository.findById(salonId);
        if (!salon) {
            throw new NotFoundException('Salon not found');
        }

        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('You do not have permission to view these statistics');
        }

        return await appointmentRepository.getSalonStatistics(salonId, startDate, endDate);
    }
}

export const appointmentService = new AppointmentService();
