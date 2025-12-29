import otpGenerator from 'otp-generator';
import { redisService } from '@infrastructure/cache/redis.service';
import { config } from '@config/environment';
import { logger } from '@infrastructure/logger/logger.service';
import { BadRequestException } from '@common/exceptions';
import { generateOTP } from '@common/utils';

/**
 * OTP Service
 * Handles OTP generation, storage, and verification
 */
export class OTPService {
    private readonly otpLength = 6;
    private readonly otpExpiryMinutes: number;

    constructor() {
        this.otpExpiryMinutes = config.platform.otpExpiryMinutes;
    }

    /**
     * Generate OTP key for Redis
     */
    private getOTPKey(identifier: string, purpose: string): string {
        return `otp:${purpose}:${identifier}`;
    }

    /**
     * Generate and store OTP
     */
    async generateOTP(
        identifier: string,
        purpose: 'email' | 'phone' | 'reset_password'
    ): Promise<string> {
        try {
            // Generate OTP
            const otp = generateOTP(this.otpLength);

            // Store  in Redis with expiry
            const key = this.getOTPKey(identifier, purpose);
            const expirySeconds = this.otpExpiryMinutes * 60;

            await redisService.set(key, otp, expirySeconds);

            logger.info(`OTP generated for ${identifier} (${purpose})`);

            return otp;
        } catch (error) {
            logger.error('Error generating OTP:', error);
            throw new BadRequestException('Failed to generate OTP');
        }
    }

    /**
     * Verify OTP
     */
    async verifyOTP(
        identifier: string,
        purpose: 'email' | 'phone' | 'reset_password',
        otp: string
    ): Promise<boolean> {
        try {
            const key = this.getOTPKey(identifier, purpose);
            const storedOTP = await redisService.get<string>(key);

            if (!storedOTP) {
                logger.warn(`OTP not found or expired for ${identifier}`);
                return false;
            }

            const isValid = storedOTP === otp;

            if (isValid) {
                // Delete OTP after successful verification
                await redisService.delete(key);
                logger.info(`OTP verified successfully for ${identifier}`);
            } else {
                logger.warn(`Invalid OTP attempt for ${identifier}`);
            }

            return isValid;
        } catch (error) {
            logger.error('Error verifying OTP:', error);
            return false;
        }
    }

    /**
     * Get remaining TTL for OTP
     */
    async getOTPTTL(identifier: string, purpose: 'email' | 'phone' | 'reset_password'): Promise<number> {
        try {
            const key = this.getOTPKey(identifier, purpose);
            const ttl = await redisService.ttl(key);
            return Math.max(0, ttl);
        } catch (error) {
            logger.error('Error getting OTP TTL:', error);
            return 0;
        }
    }

    /**
     * Invalidate OTP (delete before expiry)
     */
    async invalidateOTP(identifier: string, purpose: 'email' | 'phone' | 'reset_password'): Promise<void> {
        try {
            const key = this.getOTPKey(identifier, purpose);
            await redisService.delete(key);
            logger.info(`OTP invalidated for ${identifier}`);
        } catch (error) {
            logger.error('Error invalidating OTP:', error);
        }
    }

    /**
     * Check if user can request new OTP (rate limiting)
     */
    async canRequestOTP(identifier: string, purpose: string): Promise<boolean> {
        try {
            const key = this.getOTPKey(identifier, purpose);
            const exists = await redisService.exists(key);

            // Can only request new OTP if previous one expired
            return !exists;
        } catch (error) {
            logger.error('Error checking OTP request eligibility:', error);
            return true; // Allow request on error
        }
    }
}

export const otpService = new OTPService();
