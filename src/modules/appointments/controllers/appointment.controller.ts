import { Request, Response, NextFunction } from 'express';
import { appointmentService, CreateAppointmentDTO } from '../services/appointment.service';
import { AuthenticatedRequest } from '@common/interfaces';
import { HttpStatus, AppointmentStatus } from '@common/constants';
import { BadRequestException } from '@common/exceptions';
import { parsePaginationQuery } from '@common/utils';

/**
 * Appointment Controller
 * Handles HTTP requests for appointment management
 */
export class AppointmentController {
    /**
     * Create appointment
     * POST /api/v1/appointments
     */
    async createAppointment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: CreateAppointmentDTO = req.body;

            // Validation
            if (!dto.salonId || !dto.serviceIds || !dto.scheduledAt || !dto.locationType) {
                throw new BadRequestException('Required fields missing');
            }

            const appointment = await appointmentService.createAppointment(userId, dto);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Appointment booked successfully',
                data: appointment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get appointment by ID
     * GET /api/v1/appointments/:id
     */
    async getAppointmentById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const appointment = await appointmentService.getAppointmentById(id, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: appointment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get my appointments
     * GET /api/v1/appointments
     */
    async getMyAppointments(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const { page, limit } = parsePaginationQuery(req.query);
            const result = await appointmentService.getUserAppointments(userId, page, limit);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result.data,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get upcoming appointments
     * GET /api/v1/appointments/upcoming
     */
    async getUpcomingAppointments(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const appointments = await appointmentService.getUpcomingAppointments(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: appointments,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get salon appointments
     * GET /api/v1/appointments/salon/:salonId
     */
    async getSalonAppointments(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { salonId } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const { status, startDate, endDate } = req.query;
            const { page, limit } = parsePaginationQuery(req.query);

            const filters = {
                status: status as AppointmentStatus,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
            };

            const result = await appointmentService.getSalonAppointments(
                salonId,
                userId,
                filters,
                page,
                limit
            );

            res.status(HttpStatus.OK).json({
                success: true,
                data: result.data,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update appointment status
     * PATCH /api/v1/appointments/:id/status
     */
    async updateStatus(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!status) {
                throw new BadRequestException('Status is required');
            }

            const appointment = await appointmentService.updateAppointmentStatus(id, status, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Appointment status updated successfully',
                data: appointment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cancel appointment
     * POST /api/v1/appointments/:id/cancel
     */
    async cancelAppointment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const appointment = await appointmentService.cancelAppointment(id, userId, reason);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Appointment cancelled successfully',
                data: appointment,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check slot availability
     * POST /api/v1/appointments/check-availability
     */
    async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { salonId, barberId, scheduledAt, duration } = req.body;

            if (!salonId || !scheduledAt || !duration) {
                throw new BadRequestException('Salon ID, scheduled time, and duration are required');
            }

            const isAvailable = await appointmentService.checkSlotAvailability(
                salonId,
                barberId,
                new Date(scheduledAt),
                duration
            );

            res.status(HttpStatus.OK).json({
                success: true,
                data: {
                    available: isAvailable,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get salon statistics
     * GET /api/v1/appointments/salon/:salonId/statistics
     */
    async getSalonStatistics(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { salonId } = req.params;
            const { startDate, endDate } = req.query;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!startDate || !endDate) {
                throw new BadRequestException('Start date and end date are required');
            }

            const statistics = await appointmentService.getSalonStatistics(
                salonId,
                userId,
                new Date(startDate as string),
                new Date(endDate as string)
            );

            res.status(HttpStatus.OK).json({
                success: true,
                data: statistics,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const appointmentController = new AppointmentController();
