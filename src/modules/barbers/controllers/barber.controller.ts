import { Request, Response, NextFunction } from 'express';
import { barberService, RegisterBarberDTO, UpdateBarberDTO } from '../services/barber.service';
import { AuthenticatedRequest } from '@common/interfaces';
import { HttpStatus, BarberStatus } from '@common/constants';
import { BadRequestException } from '@common/exceptions';
import { parsePaginationQuery } from '@common/utils';

/**
 * Barber Controller
 * Handles HTTP requests for barber management
 */
export class BarberController {
    /**
     * Register as barber
     * POST /api/v1/barbers
     */
    async registerBarber(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: RegisterBarberDTO = req.body;

            if (!dto.salonId || !dto.displayName || !dto.specializations || dto.experience === undefined) {
                throw new BadRequestException('Required fields missing');
            }

            const barber = await barberService.registerBarber(userId, dto);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Barber registration submitted successfully',
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get barber by ID
     * GET /api/v1/barbers/:id
     */
    async getBarberById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const barber = await barberService.getBarberById(id);

            res.status(HttpStatus.OK).json({
                success: true,
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update barber profile
     * PUT /api/v1/barbers/:id
     */
    async updateBarber(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: UpdateBarberDTO = req.body;
            const barber = await barberService.updateBarber(id, userId, dto);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Barber profile updated successfully',
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload document
     * POST /api/v1/barbers/:id/documents
     */
    async uploadDocument(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { type } = req.body;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!req.file) {
                throw new BadRequestException('File is required');
            }

            if (!type) {
                throw new BadRequestException('Document type is required');
            }

            const barber = await barberService.uploadDocument(id, userId, req.file, type);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Document uploaded successfully',
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update availability
     * PUT /api/v1/barbers/:id/availability
     */
    async updateAvailability(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { availability } = req.body;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!availability || !Array.isArray(availability)) {
                throw new BadRequestException('Availability is required and must be an array');
            }

            const barber = await barberService.updateAvailability(id, userId, availability);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Availability updated successfully',
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get salon barbers
     * GET /api/v1/barbers/salon/:salonId
     */
    async getSalonBarbers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { salonId } = req.params;
            const { status } = req.query;
            const { page, limit } = parsePaginationQuery(req.query);

            const result = await barberService.getSalonBarbers(
                salonId,
                status as BarberStatus,
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
     * Get pending barbers (salon owner)
     * GET /api/v1/barbers/salon/:salonId/pending
     */
    async getPendingBarbers(
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

            const { page, limit } = parsePaginationQuery(req.query);
            const result = await barberService.getPendingBarbers(salonId, userId, page, limit);

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
     * Approve barber (salon owner)
     * POST /api/v1/barbers/:id/approve
     */
    async approveBarber(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const barber = await barberService.approveBarber(id, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Barber approved successfully',
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Reject barber (salon owner)
     * POST /api/v1/barbers/:id/reject
     */
    async rejectBarber(
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

            if (!reason) {
                throw new BadRequestException('Rejection reason is required');
            }

            const barber = await barberService.rejectBarber(id, userId, reason);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Barber rejected',
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const barberController = new BarberController();
