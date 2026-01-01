import { UserRepository } from '../../users/repositories/user.repository';
import { SalonRepository } from '../../salons/repositories/salon.repository';
import { BarberRepository } from '../../barbers/repositories/barber.repository';
import { AppointmentRepository } from '../../appointments/repositories/appointment.repository';
import { PaymentRepository } from '../../payments/repositories/payment.repository';
import { ReviewRepository } from '../../reviews/repositories/review.repository';
import { NotFoundException, BadRequestException } from '../../../common/exceptions';
import { UserRole, BarberStatus, AppointmentStatus } from '../../../common/constants';

interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Admin Service
 * Business logic for super admin operations
 */
class AdminService {
    private userRepository: UserRepository;
    private salonRepository: SalonRepository;
    private barberRepository: BarberRepository;
    private appointmentRepository: AppointmentRepository;
    private paymentRepository: PaymentRepository;
    private reviewRepository: ReviewRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.salonRepository = new SalonRepository();
        this.barberRepository = new BarberRepository();
        this.appointmentRepository = new AppointmentRepository();
        this.paymentRepository = new PaymentRepository();
        this.reviewRepository = new ReviewRepository();
    }

    /**
     * Get dashboard statistics
     */
    async getDashboardStats() {
        const [
            totalUsers,
            totalSalons,
            totalBarbers,
            totalAppointments,
            activeAppointments,
            totalRevenue,
        ] = await Promise.all([
            this.userRepository.count({}),
            this.salonRepository.count({}),
            this.barberRepository.count({}),
            this.appointmentRepository.count({}),
            this.appointmentRepository.count({ status: AppointmentStatus.CONFIRMED }),
            this.getTotalRevenue(),
        ]);

        // Get user breakdown by role
        const usersByRole = await this.getUsersByRole();

        // Get appointments by status
        const appointmentsByStatus = await this.getAppointmentsByStatus();

        return {
            overview: {
                totalUsers,
                totalSalons,
                totalBarbers,
                totalAppointments,
                activeAppointments,
                totalRevenue,
            },
            usersByRole,
            appointmentsByStatus,
        };
    }

    /**
     * Get recent activity
     */
    async getRecentActivity(limit: number = 10) {
        const recentAppointments = await this.appointmentRepository.findAll(
            {},
            { page: 1, limit: limit / 2 },
            { createdAt: -1 }
        );

        const recentUsers = await this.userRepository.findAll(
            {},
            { page: 1, limit: limit / 2 },
            { createdAt: -1 }
        );

        const activity = [
            ...recentAppointments.data.map(apt => ({
                type: 'appointment',
                action: 'created',
                data: apt,
                timestamp: apt.createdAt,
            })),
            ...recentUsers.data.map(user => ({
                type: 'user',
                action: 'registered',
                data: user,
                timestamp: user.createdAt,
            })),
        ];

        // Sort by timestamp descending
        activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return activity.slice(0, limit);
    }

    /**
     * Get all users with filters
     */
    async getAllUsers(filters: {
        role?: string;
        isActive?: boolean;
        search?: string;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<any>> {
        const query: any = {};

        if (filters.role) {
            query.role = filters.role;
        }

        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }

        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { phone: { $regex: filters.search, $options: 'i' } },
            ];
        }

        return await this.userRepository.findAll(
            query,
            { page: filters.page, limit: filters.limit },
            { createdAt: -1 }
        );
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    /**
     * Update user role
     */
    async updateUserRole(id: string, role: UserRole) {
        const user = await this.getUserById(id);

        // Validate role
        if (!Object.values(UserRole).includes(role)) {
            throw new BadRequestException('Invalid role');
        }

        const updatedUser = await this.userRepository.update(id, { role });
        return updatedUser;
    }

    /**
     * Toggle user status
     */
    async toggleUserStatus(id: string, isActive: boolean) {
        const user = await this.getUserById(id);
        const updatedUser = await this.userRepository.update(id, { isActive });
        return updatedUser;
    }

    /**
     * Delete user
     */
    async deleteUser(id: string) {
        const user = await this.getUserById(id);

        // Prevent deleting super admin
        if (user.role === UserRole.SUPER_ADMIN) {
            throw new BadRequestException('Cannot delete super admin user');
        }

        await this.userRepository.delete(id);
    }

    /**
     * Get all salons with filters
     */
    async getAllSalons(filters: {
        isActive?: boolean;
        city?: string;
        search?: string;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<any>> {
        const query: any = {};

        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }

        if (filters.city) {
            query['address.city'] = { $regex: filters.city, $options: 'i' };
        }

        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } },
            ];
        }

        return await this.salonRepository.findAll(
            query,
            { page: filters.page, limit: filters.limit },
            { createdAt: -1 }
        );
    }

    /**
     * Get salon by ID
     */
    async getSalonById(id: string) {
        const salon = await this.salonRepository.findById(id);
        if (!salon) {
            throw new NotFoundException('Salon not found');
        }
        return salon;
    }

    /**
     * Suspend salon
     */
    async suspendSalon(id: string, reason?: string) {
        const salon = await this.getSalonById(id);
        const updatedSalon = await this.salonRepository.update(id, { isActive: false });

        // TODO: Send notification to salon owner about suspension

        return updatedSalon;
    }

    /**
     * Delete salon
     */
    async deleteSalon(id: string) {
        await this.getSalonById(id);
        await this.salonRepository.delete(id);
    }

    /**
     * Get all barbers with filters
     */
    async getAllBarbers(filters: {
        status?: string;
        salonId?: string;
        search?: string;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<any>> {
        const query: any = {};

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.salonId) {
            query.salonId = filters.salonId;
        }

        return await this.barberRepository.findAll(
            query,
            { page: filters.page, limit: filters.limit },
            { createdAt: -1 }
        );
    }

    /**
     * Approve barber
     */
    async approveBarber(id: string) {
        const barber = await this.barberRepository.findById(id);
        if (!barber) {
            throw new NotFoundException('Barber not found');
        }

        const updatedBarber = await this.barberRepository.update(id, {
            status: BarberStatus.APPROVED,
        });

        // TODO: Send approval notification to barber

        return updatedBarber;
    }

    /**
     * Reject barber
     */
    async rejectBarber(id: string, reason?: string) {
        const barber = await this.barberRepository.findById(id);
        if (!barber) {
            throw new NotFoundException('Barber not found');
        }

        const updatedBarber = await this.barberRepository.update(id, {
            status: BarberStatus.REJECTED,
        });

        // TODO: Send rejection notification to barber with reason

        return updatedBarber;
    }

    /**
     * Get all appointments with filters
     */
    async getAllAppointments(filters: {
        status?: string;
        salonId?: string;
        startDate?: string;
        endDate?: string;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<any>> {
        const query: any = {};

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.salonId) {
            query.salonId = filters.salonId;
        }

        if (filters.startDate || filters.endDate) {
            query.scheduledDate = {};
            if (filters.startDate) {
                query.scheduledDate.$gte = filters.startDate;
            }
            if (filters.endDate) {
                query.scheduledDate.$lte = filters.endDate;
            }
        }

        return await this.appointmentRepository.findAll(
            query,
            { page: filters.page, limit: filters.limit },
            { scheduledDate: -1 }
        );
    }

    /**
     * Cancel appointment (admin)
     */
    async cancelAppointment(id: string, reason?: string) {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        const updatedAppointment = await this.appointmentRepository.update(id, {
            status: AppointmentStatus.CANCELLED,
        });

        // TODO: Send cancellation notification to customer and salon

        return updatedAppointment;
    }

    /**
     * Get all payments with filters
     */
    async getAllPayments(filters: {
        status?: string;
        startDate?: string;
        endDate?: string;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<any>> {
        const query: any = {};

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate) {
                query.createdAt.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                query.createdAt.$lte = new Date(filters.endDate);
            }
        }

        return await this.paymentRepository.findAll(
            query,
            { page: filters.page, limit: filters.limit },
            { createdAt: -1 }
        );
    }

    /**
     * Get all reviews with filters
     */
    async getAllReviews(filters: {
        targetType?: 'salon' | 'barber';
        rating?: number;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<any>> {
        const query: any = {};

        if (filters.targetType) {
            query.targetType = filters.targetType;
        }

        if (filters.rating) {
            query.rating = filters.rating;
        }

        return await this.reviewRepository.findAll(
            query,
            { page: filters.page, limit: filters.limit },
            { createdAt: -1 }
        );
    }

    /**
     * Delete review
     */
    async deleteReview(id: string) {
        const review = await this.reviewRepository.findById(id);
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        await this.reviewRepository.delete(id);
    }

    // Helper methods

    private async getTotalRevenue(): Promise<number> {
        // Aggregate all successful payments
        const result = await this.paymentRepository.aggregate([
            { $match: { status: 'successful' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        return result[0]?.total || 0;
    }

    private async getUsersByRole() {
        const result = await this.userRepository.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);

        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {} as Record<string, number>);
    }

    private async getAppointmentsByStatus() {
        const result = await this.appointmentRepository.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {} as Record<string, number>);
    }
}

export const adminService = new AdminService();
