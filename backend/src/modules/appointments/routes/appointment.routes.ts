import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { authGuard } from '@shared/guards/auth.guard';
import { rolesGuard } from '@shared/guards/roles.guard';
import { UserRole } from '@common/constants';

const router = Router();

/**
 * @route   POST /api/v1/appointments/check-availability
 * @desc    Check slot availability
 * @access  Public
 */
router.post('/check-availability', (req, res, next) =>
    appointmentController.checkAvailability(req, res, next)
);

/**
 * @route   GET /api/v1/appointments/upcoming
 * @desc    Get upcoming appointments
 * @access  Private
 */
router.get('/upcoming', authGuard, (req, res, next) =>
    appointmentController.getUpcomingAppointments(req, res, next)
);

/**
 * @route   POST /api/v1/appointments
 * @desc    Create new appointment
 * @access  Private
 */
router.post('/', authGuard, (req, res, next) =>
    appointmentController.createAppointment(req, res, next)
);

/**
 * @route   GET /api/v1/appointments
 * @desc    Get my appointments
 * @access  Private
 */
router.get('/', authGuard, (req, res, next) =>
    appointmentController.getMyAppointments(req, res, next)
);

/**
 * @route   GET /api/v1/appointments/salon/:salonId
 * @desc    Get salon appointments
 * @access  Private (Salon Owner)
 */
router.get('/salon/:salonId', authGuard, (req, res, next) =>
    appointmentController.getSalonAppointments(req, res, next)
);

/**
 * @route   GET /api/v1/appointments/salon/:salonId/statistics
 * @desc    Get salon statistics
 * @access  Private (Salon Owner)
 */
router.get('/salon/:salonId/statistics', authGuard, (req, res, next) =>
    appointmentController.getSalonStatistics(req, res, next)
);

/**
 * @route   GET /api/v1/appointments/:id
 * @desc    Get appointment by ID
 * @access  Private
 */
router.get('/:id', authGuard, (req, res, next) =>
    appointmentController.getAppointmentById(req, res, next)
);

/**
 * @route   PATCH /api/v1/appointments/:id/status
 * @desc    Update appointment status
 * @access  Private
 */
router.patch('/:id/status', authGuard, (req, res, next) =>
    appointmentController.updateStatus(req, res, next)
);

/**
 * @route   POST /api/v1/appointments/:id/cancel
 * @desc    Cancel appointment
 * @access  Private
 */
router.post('/:id/cancel', authGuard, (req, res, next) =>
    appointmentController.cancelAppointment(req, res, next)
);

export const appointmentRoutes = router;
