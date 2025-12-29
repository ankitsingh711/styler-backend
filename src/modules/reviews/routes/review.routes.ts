import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authGuard } from '@shared/guards/auth.guard';

const router = Router();

/**
 * @route   POST /api/v1/reviews
 * @desc    Submit review
 * @access  Private
 */
router.post('/', authGuard, (req, res, next) => reviewController.submitReview(req, res, next));

/**
 * @route   GET /api/v1/reviews/my
 * @desc    Get my reviews
 * @access  Private
 */
router.get('/my', authGuard, (req, res, next) => reviewController.getMyReviews(req, res, next));

/**
 * @route   GET /api/v1/reviews/salon/:salonId
 * @desc    Get salon reviews
 * @access  Public
 */
router.get('/salon/:salonId', (req, res, next) => reviewController.getSalonReviews(req, res, next));

/**
 * @route   GET /api/v1/reviews/salon/:salonId/rating
 * @desc    Get salon rating summary
 * @access  Public
 */
router.get('/salon/:salonId/rating', (req, res, next) => reviewController.getSalonRating(req, res, next));

/**
 * @route   POST /api/v1/reviews/:id/response
 * @desc    Add response to review (salon owner)
 * @access  Private
 */
router.post('/:id/response', authGuard, (req, res, next) =>
    reviewController.addResponse(req, res, next)
);

export const reviewRoutes: Router = router;
