import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authGuard } from '@shared/guards/auth.guard';
import { superAdminGuard } from '@shared/guards/roles.guard';

const router = Router();

// All admin routes require super admin authentication
router.use(authGuard, superAdminGuard);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats.bind(adminController));
router.get('/dashboard/activity', adminController.getRecentActivity.bind(adminController));

// User Management
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.put('/users/:id/role', adminController.updateUserRole.bind(adminController));
router.put('/users/:id/status', adminController.toggleUserStatus.bind(adminController));
router.delete('/users/:id', adminController.deleteUser.bind(adminController));

// Salon Management
router.get('/salons', adminController.getAllSalons.bind(adminController));
router.get('/salons/:id', adminController.getSalonById.bind(adminController));
router.put('/salons/:id/suspend', adminController.suspendSalon.bind(adminController));
router.delete('/salons/:id', adminController.deleteSalon.bind(adminController));

// Barber Management
router.get('/barbers', adminController.getAllBarbers.bind(adminController));
router.put('/barbers/:id/approve', adminController.approveBarber.bind(adminController));
router.put('/barbers/:id/reject', adminController.rejectBarber.bind(adminController));

// Appointment Management
router.get('/appointments', adminController.getAllAppointments.bind(adminController));
router.put('/appointments/:id/cancel', adminController.cancelAppointment.bind(adminController));

// Payment Management
router.get('/payments', adminController.getAllPayments.bind(adminController));

// Review Management
router.get('/reviews', adminController.getAllReviews.bind(adminController));
router.delete('/reviews/:id', adminController.deleteReview.bind(adminController));

export default router;
