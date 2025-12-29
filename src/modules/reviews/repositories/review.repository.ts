import { BaseRepository } from '@infrastructure/database/base.repository';
import { ReviewModel, IReview } from '../entities/review.entity';
import { ReviewStatus } from '@common/constants';
import { PaginationMeta, RatingAggregate } from '@common/interfaces';
import mongoose from 'mongoose';

/**
 * Review Repository
 * Handles all database operations for reviews
 */
export class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(ReviewModel);
  }

  /**
   * Find review by appointment ID
   */
  async findByAppointmentId(appointmentId: string): Promise<IReview | null> {
    return await this.findOne({
      appointmentId: new mongoose.Types.ObjectId(appointmentId),
    });
  }

  /**
   * Find reviews by salon ID
   */
  async findBySalonId(
    salonId: string,
    status: ReviewStatus,
    page: number,
    limit: number
  ): Promise<{ data: IReview[]; meta: PaginationMeta }> {
    return await this.findWithPagination(
      {
        salonId: new mongoose.Types.ObjectId(salonId),
        status,
      },
      page,
      limit,
      { createdAt: -1 }
    );
  }

  /**
   * Get salon rating aggregate
   */
  async getSalonRatingAggregate(salonId: string): Promise<RatingAggregate> {
    const stats = await this.aggregate([
      {
        $match: {
          salonId: new mongoose.Types.ObjectId(salonId),
          status: ReviewStatus.APPROVED,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          serviceQuality: { $avg: '$serviceQuality' },
          punctuality: { $avg: '$punctuality' },
          cleanliness: { $avg: '$cleanliness' },
          valueForMoney: { $avg: '$valueForMoney' },
          fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    if (!stats[0]) {
      return {
        averageRating: 0,
        totalReviews: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      breakdown: {
        5: stats[0].fiveStars,
        4: stats[0].fourStars,
        3: stats[0].threeStars,
        2: stats[0].twoStars,
        1: stats[0].oneStar,
      },
      details: {
        serviceQuality: Math.round(stats[0].serviceQuality * 10) / 10,
        punctuality: Math.round(stats[0].punctuality * 10) / 10,
        cleanliness: Math.round(stats[0].cleanliness * 10) / 10,
        valueForMoney: Math.round(stats[0].valueForMoney * 10) / 10,
      },
    };
  }

  /**
   * Update review status
   */
  async updateStatus(reviewId: string, status: ReviewStatus): Promise<IReview | null> {
    return await this.updateById(reviewId, { status });
  }

  /**
   * Find reviews by user ID
   */
  async findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: IReview[]; meta: PaginationMeta }> {
    return await this.findWithPagination(
      { userId: new mongoose.Types.ObjectId(userId) },
      page,
      limit,
      { createdAt: -1 }
    );
  }

  /**
   * Add response to review
   */
  async addResponse(
    reviewId: string,
    message: string,
    respondedBy: string
  ): Promise<IReview | null> {
    return await this.updateById(reviewId, {
      response: {
        message,
        respondedBy: new mongoose.Types.ObjectId(respondedBy),
        respondedAt: new Date(),
      },
    });
  }
}

export const reviewRepository = new ReviewRepository();
