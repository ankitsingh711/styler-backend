import { Request, Response, NextFunction } from 'express';
import { tokenService } from '@modules/auth/services/token.service';
import { userRepository } from '@modules/users/repositories/user.repository';
import { UnauthorizedException, ForbiddenException } from '@common/exceptions';
import { AuthenticatedRequest, JwtPayload } from '@common/interfaces';
import { logger } from '@infrastructure/logger/logger.service';

/**
 * Authentication Guard Middleware
 * Verifies JWT token and attaches user to request
 */
export async function authGuard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Check if token is blacklisted
        const isBlacklisted = await tokenService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new UnauthorizedException('Token has been revoked');
        }

        // Verify token
        const payload: JwtPayload = tokenService.verifyAccessToken(token);

        // Verify user still exists and is active
        const user = await userRepository.findById(payload.userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }

        // Attach user info to request
        req.user = payload;
        req.userId = payload.userId;

        next();
    } catch (error) {
        if (error instanceof UnauthorizedException) {
            next(error);
        } else {
            logger.error('Authentication error:', error);
            next(new UnauthorizedException('Authentication failed'));
        }
    }
}

/**
 * Optional Authentication Guard
 * Attaches user if token is present, but doesn't fail if not
 */
export async function optionalAuthGuard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            const isBlacklisted = await tokenService.isTokenBlacklisted(token);
            if (!isBlacklisted) {
                const payload = tokenService.verifyAccessToken(token);
                req.user = payload;
                req.userId = payload.userId;
            }
        }

        next();
    } catch (error) {
        // Silently fail for optional auth
        next();
    }
}
