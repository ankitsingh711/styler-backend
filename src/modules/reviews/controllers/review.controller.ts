import { Request, Response, NextFunction } from 'express';
import { reviewService, CreateReviewDTO } from '../services/review.service';
import { AuthenticatedRequest } from '@common/interfaces';
import { HttpStatus } from '@common/constants';
import { BadRequestException } from '@common/exceptions';
import { parsePaginationQuery } from '@common/utils';

/**
 * Review Controller
 * Handles HTTP requests for reviews
 */
export class ReviewController {
    /**
     * Submit review
     * POST /api/v1/reviews
     */
    async submitReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const dto: CreateReviewDTO = req.body;

            if (!dto.appointmentId || !dto.rating || !dto.comment) {
                throw new BadRequestException('Required fields missing');
            }

            const review = await reviewService.submitReview(userId, dto);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Review submitted successfully',
                data: review,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get salon reviews
     * GET /api/v1/reviews/salon/:salonId
     */
    async getSalonReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { salonId } = req.params;
            const { page, limit } = parsePaginationQuery(req.query);

            const result = await reviewService.getSalonReviews(salonId, page, limit);

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
     * Get salon rating
     * GET /api/v1/reviews/salon/:salonId/rating
     */
    async getSalonRating(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { salonId } = req.params;
            const rating = await reviewService.getSalonRating(salonId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: rating,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Add response to review
     * POST /api/v1/reviews/:id/response
     */
    async addResponse(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { message } = req.body;
            const userId = req.userId;

            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!message) {
                throw new BadRequestException('Response message is required');
            }

            const review = await reviewService.addResponse(id, userId, message);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Response added successfully',
                data: review,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get my reviews
     * GET /api/v1/reviews/my
     */
    async getMyReviews(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const reviews = await reviewService.getUserReviews(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: reviews,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const reviewController = new ReviewController();
