import { Request, Response, NextFunction } from 'express';
import { salonService, CreateSalonDTO, UpdateSalonDTO } from '../services/salon.service';
import { AuthenticatedRequest } from '@common/interfaces';
import { HttpStatus } from '@common/constants';
import { BadRequestException } from '@common/exceptions';
import { parsePaginationQuery } from '@common/utils';

/**
 * Salon Controller
 * Handles HTTP requests for salon management
 */
export class SalonController {
    /**
     * Register new salon
     * POST /api/v1/salons
     */
    async registerSalon(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: CreateSalonDTO = req.body;

            // Validation
            if (!dto.businessName || !dto.displayName || !dto.description || !dto.phone || !dto.email) {
                throw new BadRequestException('Required fields missing');
            }

            if (!dto.address || !dto.address.latitude || !dto.address.longitude) {
                throw new BadRequestException('Address with coordinates is required');
            }

            const salon = await salonService.registerSalon(userId, dto);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Salon registered successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get salon by ID
     * GET /api/v1/salons/:id
     */
    async getSalonById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const salon = await salonService.getSalonById(id);

            res.status(HttpStatus.OK).json({
                success: true,
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update salon
     * PUT /api/v1/salons/:id
     */
    async updateSalon(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: UpdateSalonDTO = req.body;
            const salon = await salonService.updateSalon(id, userId, dto);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Salon updated successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get my salons (for salon owners)
     * GET /api/v1/salons/my
     */
    async getMySalons(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const salons = await salonService.getSalonsByOwner(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: salons,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Search nearby salons
     * GET /api/v1/salons/nearby
     */
    async searchNearbySalons(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { latitude, longitude, radius, city, state, serviceCategory, minRating } = req.query;

            if (!latitude || !longitude) {
                throw new BadRequestException('Latitude and longitude are required');
            }

            const { page, limit } = parsePaginationQuery(req.query);

            const result = await salonService.searchNearbySalons(
                {
                    latitude: parseFloat(latitude as string),
                    longitude: parseFloat(longitude as string),
                    radiusKm: radius ? parseFloat(radius as string) : undefined,
                    city: city as string,
                    state: state as string,
                    serviceCategory: serviceCategory as string,
                    minRating: minRating ? parseFloat(minRating as string) : undefined,
                },
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
     * Search salons
     * GET /api/v1/salons/search
     */
    async searchSalons(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { city, state, serviceCategory, minRating, searchText } = req.query;
            const { page, limit } = parsePaginationQuery(req.query);

            const result = await salonService.searchSalons(
                {
                    city: city as string,
                    state: state as string,
                    serviceCategory: serviceCategory as string,
                    minRating: minRating ? parseFloat(minRating as string) : undefined,
                    searchText: searchText as string,
                },
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
     * Get salon services
     * GET /api/v1/salons/:id/services
     */
    async getSalonServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const services = await salonService.getSalonServices(id);

            res.status(HttpStatus.OK).json({
                success: true,
                data: services,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Add service to salon
     * POST /api/v1/salons/:id/services
     */
    async addService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const service = req.body;

            if (!service.name || !service.price || !service.duration) {
                throw new BadRequestException('Required service fields missing');
            }

            const salon = await salonService.addService(id, userId, service);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Service added successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update service
     * PUT /api/v1/salons/:id/services/:serviceId
     */
    async updateService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, serviceId } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const updates = req.body;
            const salon = await salonService.updateService(id, serviceId, userId, updates);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Service updated successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove service
     * DELETE /api/v1/salons/:id/services/:serviceId
     */
    async removeService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, serviceId } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const salon = await salonService.removeService(id, serviceId, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Service removed successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update operating hours
     * PUT /api/v1/salons/:id/operating-hours
     */
    async updateOperatingHours(
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

            const operatingHours = req.body.operatingHours;

            if (!Array.isArray(operatingHours)) {
                throw new BadRequestException('Operating hours must be an array');
            }

            const salon = await salonService.updateOperatingHours(id, userId, operatingHours);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Operating hours updated successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete salon
     * DELETE /api/v1/salons/:id
     */
    async deleteSalon(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            await salonService.deleteSalon(id, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Salon deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export const salonController = new SalonController();
