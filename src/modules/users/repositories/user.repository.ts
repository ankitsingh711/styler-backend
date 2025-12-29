import { BaseRepository } from '@infrastructure/database/base.repository';
import { UserModel, IUser } from '../entities/user.entity';
import { UserRole } from '@common/constants';

/**
 * User Repository
 * Handles all database operations for users
 */
export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }

    /**
     * Find user by email (including password field)
     */
    async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email, isActive: true }).select('+password').exec();
    }

    /**
     * Find user by phone (including password field)
     */
    async findByPhoneWithPassword(phone: string): Promise<IUser | null> {
        return await UserModel.findOne({ phone, isActive: true }).select('+password').exec();
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<IUser | null> {
        return await this.findOne({ email, isActive: true });
    }

    /**
     * Find user by phone
     */
    async findByPhone(phone: string): Promise<IUser | null> {
        return await this.findOne({ phone, isActive: true });
    }

    /**
     * Find user by email or phone
     */
    async findByEmailOrPhone(email: string, phone: string): Promise<IUser | null> {
        return await this.findOne({
            $or: [{ email }, { phone }],
            isActive: true,
        });
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
        const query: Record<string, unknown> = { email, isActive: true };
        if (excludeUserId) {
            query._id = { $ne: excludeUserId };
        }
        return await this.exists(query);
    }

    /**
     * Check if phone exists
     */
    async phoneExists(phone: string, excludeUserId?: string): Promise<boolean> {
        const query: Record<string, unknown> = { phone, isActive: true };
        if (excludeUserId) {
            query._id = { $ne: excludeUserId };
        }
        return await this.exists(query);
    }

    /**
     * Update last login time
     */
    async updateLastLogin(userId: string): Promise<void> {
        await this.updateById(userId, {
            lastLogin: new Date(),
            loginAttempts: 0,
            lockUntil: undefined,
        });
    }

    /**
     * Increment login attempts
     */
    async incrementLoginAttempts(userId: string, maxAttempts: number): Promise<void> {
        const user = await this.findById(userId);
        if (!user) return;

        const updates: Record<string, unknown> = {
            $inc: { loginAttempts: 1 },
        };

        // Lock account if max attempts reached
        if (user.loginAttempts + 1 >= maxAttempts) {
            updates.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        }

        await UserModel.updateOne({ _id: userId }, updates);
    }

    /**
     * Reset login attempts
     */
    async resetLoginAttempts(userId: string): Promise<void> {
        await this.updateById(userId, {
            loginAttempts: 0,
            lockUntil: undefined,
        });
    }

    /**
     * Verify email
     */
    async verifyEmail(userId: string): Promise<void> {
        await this.updateById(userId, {
            emailVerified: true,
            isVerified: true,
        });
    }

    /**
     * Verify phone
     */
    async verifyPhone(userId: string): Promise<void> {
        await this.updateById(userId, {
            phoneVerified: true,
            isVerified: true,
        });
    }

    /**
     * Update user password
     */
    async updatePassword(userId: string, hashedPassword: string): Promise<void> {
        await UserModel.updateOne(
            { _id: userId },
            { password: hashedPassword }
        ).exec();
    }

    /**
     * Find users by role
     */
    async findByRole(role: UserRole): Promise<IUser[]> {
        return await this.find({ role, isActive: true });
    }

    /**
     * Soft delete user
     */
    async softDelete(userId: string): Promise<void> {
        await this.updateById(userId, { isActive: false });
    }

    /**
     * Restore soft deleted user
     */
    async restore(userId: string): Promise<void> {
        await this.updateById(userId, { isActive: true });
    }
}

export const userRepository = new UserRepository();
