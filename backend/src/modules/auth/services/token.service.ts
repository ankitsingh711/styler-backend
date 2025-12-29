import jwt from 'jsonwebtoken';
import { config } from '@config/environment';
import { redisService } from '@infrastructure/cache/redis.service';
import { JwtPayload, TokenPair } from '@common/interfaces';
import { InvalidTokenException, TokenExpiredException } from '@common/exceptions';
import { logger } from '@infrastructure/logger/logger.service';

/**
 * Token Service
 * Handles JWT token generation, verification, and management
 */
export class TokenService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExpiry: string;
    private readonly refreshTokenExpiry: string;

    constructor() {
        this.accessTokenSecret = config.jwt.accessSecret;
        this.refreshTokenSecret = config.jwt.refreshSecret;
        this.accessTokenExpiry = config.jwt.accessExpiry;
        this.refreshTokenExpiry = config.jwt.refreshExpiry;
    }

    /**
     * Generate access token
     */
    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry,
        });
    }

    /**
     * Generate refresh token
     */
    generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpiry,
        });
    }

    /**
     * Generate both access and refresh tokens
     */
    generateTokenPair(payload: JwtPayload): TokenPair {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Verify access token
     */
    verifyAccessToken(token: string): JwtPayload {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret) as JwtPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredException('Access token has expired');
            }
            throw new InvalidTokenException('Invalid access token');
        }
    }

    /**
     * Verify refresh token
     */
    verifyRefreshToken(token: string): JwtPayload {
        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret) as JwtPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredException('Refresh token has expired');
            }
            throw new InvalidTokenException('Invalid refresh token');
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    decodeToken(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch {
            return null;
        }
    }

    /**
     * Blacklist token (using Redis)
     */
    async blacklistToken(token: string, expiresIn?: number): Promise<void> {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) return;

            const ttl = expiresIn || (decoded.exp - Math.floor(Date.now() / 1000));

            if (ttl > 0) {
                await redisService.set(`blacklist:${token}`, 'true', ttl);
            }
        } catch (error) {
            logger.error('Error blacklisting token:', error);
        }
    }

    /**
     * Check if token is blacklisted
     */
    async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const result = await redisService.get(`blacklist:${token}`);
            return result !== null;
        } catch (error) {
            logger.error('Error checking token blacklist:', error);
            return false;
        }
    }

    /**
     * Store refresh token in Redis
     */
    async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
        try {
            const decoded = this.decodeToken(refreshToken);
            if (!decoded || !decoded.exp) return;

            const ttl = decoded.exp - Math.floor(Date.now() / 1000);

            if (ttl > 0) {
                await redisService.set(`refresh:${userId}`, refreshToken, ttl);
            }
        } catch (error) {
            logger.error('Error storing refresh token:', error);
        }
    }

    /**
     * Verify stored refresh token
     */
    async verifyStoredRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        try {
            const storedToken = await redisService.get<string>(`refresh:${userId}`);
            return storedToken === refreshToken;
        } catch (error) {
            logger.error('Error verifying stored refresh token:', error);
            return false;
        }
    }

    /**
     * Revoke all user tokens (logout from all devices)
     */
    async revokeAllUserTokens(userId: string): Promise<void> {
        try {
            await redisService.deleteByPattern(`refresh:${userId}*`);
        } catch (error) {
            logger.error('Error revoking user tokens:', error);
        }
    }

    /**
     * Get token expiry in seconds
     */
    getTokenExpiry(token: string): number | null {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) return null;

            return decoded.exp - Math.floor(Date.now() / 1000);
        } catch {
            return null;
        }
    }
}

export const tokenService = new TokenService();
