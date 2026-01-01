import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { HttpStatus } from '../../../common/constants';
import { BadRequestException } from '../../../common/exceptions';
import { AuthenticatedRequest } from '../../../common/interfaces';

/**
 * Admin Controller
 * Handles all super admin operations for platform management
 */
class AdminController {
    /**
     * Get dashboard statistics
     */
    async getDashboardStats(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stats = await adminService.getDashboardStats();

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Dashboard statistics retrieved successfully',
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get recent activity
     */
    async getRecentActivity(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const activity = await adminService.getRecentActivity(limit);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Recent activity retrieved successfully',
                data: activity,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all users with filters and pagination
     */
    async getAllUsers(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const filters = {
                role: req.query.role as string,
                isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
                search: req.query.search as string,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
            };

            const result = await adminService.getAllUsers(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Users retrieved successfully',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const user = await adminService.getUserById(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'User retrieved successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user role
     */
    async updateUserRole(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!role) {
                throw new BadRequestException('Role is required');
            }

            const user = await adminService.updateUserRole(id, role);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'User role updated successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Toggle user status (active/inactive)
     */
    async toggleUserStatus(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            if (typeof isActive !== 'boolean') {
                throw new BadRequestException('isActive must be a boolean');
            }

            const user = await adminService.toggleUserStatus(id, isActive);

            res.status(HttpStatus.OK).json({
                success: true,
                message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete user
     */
    async deleteUser(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            await adminService.deleteUser(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'User deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all salons with filters
     */
    async getAllSalons(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const filters = {
                isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
                city: req.query.city as string,
                search: req.query.search as string,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
            };

            const result = await adminService.getAllSalons(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Salons retrieved successfully',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get salon by ID
     */
    async getSalonById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const salon = await adminService.getSalonById(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Salon retrieved successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Suspend salon
     */
    async suspendSalon(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const salon = await adminService.suspendSalon(id, reason);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Salon suspended successfully',
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete salon
     */
    async deleteSalon(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            await adminService.deleteSalon(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Salon deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all barbers with filters
     */
    async getAllBarbers(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const filters = {
                status: req.query.status as string,
                salonId: req.query.salonId as string,
                search: req.query.search as string,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
            };

            const result = await adminService.getAllBarbers(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Barbers retrieved successfully',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Approve barber
     */
    async approveBarber(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const barber = await adminService.approveBarber(id);

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
     * Reject barber
     */
    async rejectBarber(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const barber = await adminService.rejectBarber(id, reason);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Barber rejected successfully',
                data: barber,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all appointments
     */
    async getAllAppointments(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const filters = {
                status: req.query.status as string,
                salonId: req.query.salonId as string,
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
            };

            const result = await adminService.getAllAppointments(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Appointments retrieved successfully',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cancel appointment (admin)
     */
    async cancelAppointment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const appointment = await adminService.cancelAppointment(id, reason);

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
     * Get all payments
     */
    async getAllPayments(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const filters = {
                status: req.query.status as string,
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
            };

            const result = await adminService.getAllPayments(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Payments retrieved successfully',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all reviews
     */
    async getAllReviews(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const filters = {
                targetType: req.query.targetType as 'salon' | 'barber',
                rating: req.query.rating ? parseInt(req.query.rating as string) : undefined,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
            };

            const result = await adminService.getAllReviews(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Reviews retrieved successfully',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete review
     */
    async deleteReview(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            await adminService.deleteReview(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Review deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export const adminController = new AdminController();
