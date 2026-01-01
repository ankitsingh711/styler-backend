import { Router } from 'express';
import { salonController } from '../controllers/salon.controller';
import { authGuard } from '@shared/guards/auth.guard';
import { rolesGuard } from '@shared/guards/roles.guard';
import { UserRole } from '@common/constants';
import { upload } from '@shared/middleware/upload.middleware';

const router = Router();

/**
 * @route   GET /api/v1/salons/nearby
 * @desc    Search nearby salons (geospatial)
 * @access  Public
 */
router.get('/nearby', (req, res, next) => salonController.searchNearbySalons(req, res, next));

/**
 * @route   GET /api/v1/salons/search
 * @desc    Search salons with filters
 * @access  Public
 */
router.get('/search', (req, res, next) => salonController.searchSalons(req, res, next));

/**
 * @route   GET /api/v1/salons/my
 * @desc    Get my salons (for salon owners)
 * @access  Private (Salon Owner)
 */
router.get('/my', authGuard, rolesGuard(UserRole.SALON_OWNER, UserRole.SUPER_ADMIN), (req, res, next) =>
    salonController.getMySalons(req, res, next)
);

/**
 * @route   POST /api/v1/salons/upload-images
 * @desc    Upload salon images (before creation)
 * @access  Private (Salon Owner)
 */
router.post(
    '/upload-images',
    authGuard,
    rolesGuard(UserRole.SALON_OWNER, UserRole.SUPER_ADMIN),
    upload.array('images', 3),
    (req, res, next) => salonController.uploadImages(req, res, next)
);

/**
 * @route   POST /api/v1/salons
 * @desc    Register a new salon
 * @access  Private
 */
router.post('/', authGuard, (req, res, next) => salonController.registerSalon(req, res, next));

/**
 * @route   GET /api/v1/salons/:id
 * @desc    Get salon by ID
 * @access  Public
 */
router.get('/:id', (req, res, next) => salonController.getSalonById(req, res, next));

/**
 * @route   PUT /api/v1/salons/:id
 * @desc    Update salon
 * @access  Private (Salon Owner)
 */
router.put('/:id', authGuard, (req, res, next) => salonController.updateSalon(req, res, next));

/**
 * @route   DELETE /api/v1/salons/:id
 * @desc    Delete salon
 * @access  Private (Salon Owner)
 */
router.delete('/:id', authGuard, (req, res, next) => salonController.deleteSalon(req, res, next));

/**
 * @route   GET /api/v1/salons/:id/services
 * @desc    Get salon services
 * @access  Public
 */
router.get('/:id/services', (req, res, next) => salonController.getSalonServices(req, res, next));

/**
 * @route   POST /api/v1/salons/:id/services
 * @desc    Add service to salon
 * @access  Private (Salon Owner)
 */
router.post('/:id/services', authGuard, (req, res, next) =>
    salonController.addService(req, res, next)
);

/**
 * @route   PUT /api/v1/salons/:id/services/:serviceId
 * @desc    Update service
 * @access  Private (Salon Owner)
 */
router.put('/:id/services/:serviceId', authGuard, (req, res, next) =>
    salonController.updateService(req, res, next)
);

/**
 * @route   DELETE /api/v1/salons/:id/services/:serviceId
 * @desc    Remove service
 * @access  Private (Salon Owner)
 */
router.delete('/:id/services/:serviceId', authGuard, (req, res, next) =>
    salonController.removeService(req, res, next)
);

/**
 * @route   PUT /api/v1/salons/:id/operating-hours
 * @desc    Update operating hours
 * @access  Private (Salon Owner)
 */
router.put('/:id/operating-hours', authGuard, (req, res, next) =>
    salonController.updateOperatingHours(req, res, next)
);

/**
 * @route   GET /api/v1/salons/:id/barbers
 * @desc    Get salon barbers
 * @access  Public
 */
router.get('/:id/barbers', (req, res, next) => salonController.getSalonBarbers(req, res, next));

export const salonRoutes: Router = router;
