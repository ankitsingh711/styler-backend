import { Router } from 'express';
import { barberController } from '../controllers/barber.controller';
import { authGuard } from '@shared/guards/auth.guard';

const router: Router = Router();

/**
 * @route   POST /api/v1/barbers
 * @desc    Register as barber
 * @access  Private
 */
router.post('/', authGuard, (req, res, next) => barberController.registerBarber(req, res, next));

/**
 * @route   GET /api/v1/barbers/salon/:salonId
 * @desc    Get salon barbers
 * @access  Public
 */
router.get('/salon/:salonId', (req, res, next) => barberController.getSalonBarbers(req, res, next));

/**
 * @route   GET /api/v1/barbers/salon/:salonId/pending
 * @desc    Get pending barbers for approval (salon owner)
 * @access  Private (Salon Owner)
 */
router.get('/salon/:salonId/pending', authGuard, (req, res, next) =>
    barberController.getPendingBarbers(req, res, next)
);

/**
 * @route   GET /api/v1/barbers/:id
 * @desc    Get barber by ID
 * @access  Public
 */
router.get('/:id', (req, res, next) => barberController.getBarberById(req, res, next));

/**
 * @route   PUT /api/v1/barbers/:id
 * @desc    Update barber profile
 * @access  Private (Barber)
 */
router.put('/:id', authGuard, (req, res, next) => barberController.updateBarber(req, res, next));

/**
 * @route   POST /api/v1/barbers/:id/documents
 * @desc    Upload document
 * @access  Private (Barber)
 */
router.post('/:id/documents', authGuard, (req, res, next) =>
    barberController.uploadDocument(req, res, next)
);

/**
 * @route   PUT /api/v1/barbers/:id/availability
 * @desc    Update availability
 * @access  Private (Barber)
 */
router.put('/:id/availability', authGuard, (req, res, next) =>
    barberController.updateAvailability(req, res, next)
);

/**
 * @route   POST /api/v1/barbers/:id/approve
 * @desc    Approve barber (salon owner)
 * @access  Private (Salon Owner)
 */
router.post('/:id/approve', authGuard, (req, res, next) =>
    barberController.approveBarber(req, res, next)
);

/**
 * @route   POST /api/v1/barbers/:id/reject
 * @desc    Reject barber (salon owner)
 * @access  Private (Salon Owner)
 */
router.post('/:id/reject', authGuard, (req, res, next) =>
    barberController.rejectBarber(req, res, next)
);

export const barberRoutes: Router = router;
