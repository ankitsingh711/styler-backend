import { reviewRepository } from '../repositories/review.repository';
import { appointmentRepository } from '@modules/appointments/repositories/appointment.repository';
import { salonRepository } from '@modules/salons/repositories/salon.repository';
import { logger } from '@infrastructure/logger/logger.service';
import {
    BadRequestException,
    NotFoundException,
    ForbiddenException,
} from '@common/exceptions';
import { IReview } from '../entities/review.entity';
import { ReviewStatus, AppointmentStatus } from '@common/constants';
import { PaginationMeta, RatingAggregate } from '@common/interfaces';

/**
 * Create Review DTO
 */
export interface CreateReviewDTO {
    appointmentId: string;
    rating: number;
    comment: string;
    serviceQuality: number;
    punctuality: number;
    cleanliness: number;
    valueForMoney: number;
    images?: string[];
}

/**
 * Review Service
 * Handles review and rating operations
 */
export class ReviewService {
    /**
     * Submit review after appointment
     */
    async submitReview(userId: string, dto: CreateReviewDTO): Promise<IReview> {
        // Get appointment
        const appointment = await appointmentRepository.findById(dto.appointmentId);
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        // Verify user owns the appointment
        if (appointment.userId.toString() !== userId) {
            throw new ForbiddenException('You can only review your own appointments');
        }

        // Check if appointment is completed
        if (appointment.status !== AppointmentStatus.COMPLETED) {
            throw new BadRequestException('Can only review completed appointments');
        }

        // Check if review already exists
        const existingReview = await reviewRepository.findByAppointmentId(dto.appointmentId);
        if (existingReview) {
            throw new BadRequestException('Review already submitted for this appointment');
        }

        // Validate ratings
        const ratings = [
            dto.rating,
            dto.serviceQuality,
            dto.punctuality,
            dto.cleanliness,
            dto.valueForMoney,
        ];

        if (ratings.some((r) => r < 1 || r > 5)) {
            throw new BadRequestException('All ratings must be between 1 and 5');
        }

        // Create review
        const review = await reviewRepository.create({
            appointmentId: appointment._id,
            userId: appointment.userId,
            salonId: appointment.salonId,
            barberId: appointment.barberId,
            rating: dto.rating,
            comment: dto.comment,
            serviceQuality: dto.serviceQuality,
            punctuality: dto.punctuality,
            cleanliness: dto.cleanliness,
            valueForMoney: dto.valueForMoney,
            images: dto.images,
            status: ReviewStatus.APPROVED, // Auto-approve for now, can add moderation later
            isVerified: true, // Verified because it's from a real appointment
        });

        // Update salon rating
        await this.updateSalonRating(appointment.salonId.toString());

        logger.info(`Review submitted for appointment ${dto.appointmentId}`);

        return review;
    }

    /**
     * Get salon reviews
     */
    async getSalonReviews(
        salonId: string,
        page: number,
        limit: number
    ): Promise<{ data: IReview[]; meta: PaginationMeta }> {
        return await reviewRepository.findBySalonId(salonId, ReviewStatus.APPROVED, page, limit);
    }

    /**
     * Get salon rating aggregate
     */
    async getSalonRating(salonId: string): Promise<RatingAggregate> {
        return await reviewRepository.getSalonRatingAggregate(salonId);
    }

    /**
     * Update salon rating in salon entity
     */
    private async updateSalonRating(salonId: string): Promise<void> {
        const aggregate = await reviewRepository.getSalonRatingAggregate(salonId);

        await salonRepository.updateRating(
            salonId,
            aggregate.averageRating,
            aggregate.totalReviews
        );

        logger.info(`Updated salon ${salonId} rating: ${aggregate.averageRating}`);
    }

    /**
     * Add response to review (salon owner)
     */
    async addResponse(
        reviewId: string,
        ownerId: string,
        message: string
    ): Promise<IReview> {
        const review = await reviewRepository.findById(reviewId);
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        // Verify salon ownership
        const salon = await salonRepository.findById(review.salonId.toString());
        if (!salon) {
            throw new NotFoundException('Salon not found');
        }

        if (salon.ownerId.toString() !== ownerId) {
            throw new ForbiddenException('Only salon owner can respond to reviews');
        }

        // Check if response already exists
        if (review.response) {
            throw new BadRequestException('Review already has a response');
        }

        const updated = await reviewRepository.addResponse(reviewId, message, ownerId);
        if (!updated) {
            throw new NotFoundException('Review not found');
        }

        logger.info(`Response added to review ${reviewId}`);

        return updated;
    }

    /**
     * Update review status (moderation)
     */
    async updateReviewStatus(
        reviewId: string,
        status: ReviewStatus,
        adminId: string
    ): Promise<IReview> {
        const review = await reviewRepository.findById(reviewId);
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        const updated = await reviewRepository.updateStatus(reviewId, status);
        if (!updated) {
            throw new NotFoundException('Review not found');
        }

        // If approving or rejecting, update salon rating
        if (status === ReviewStatus.APPROVED || status === ReviewStatus.REJECTED) {
            await this.updateSalonRating(review.salonId.toString());
        }

        logger.info(`Review ${reviewId} status updated to ${status} by ${adminId}`);

        return updated;
    }

    /**
     * Get user reviews
     */
    async getUserReviews(userId: string): Promise<IReview[]> {
        const result = await reviewRepository.findByUserId(userId, 1, 100);
        return result.data;
    }
}

export const reviewService = new ReviewService();
