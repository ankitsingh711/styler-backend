import rateLimit from 'express-rate-limit';
import { config } from '@config/environment';
import { TooManyRequestsException } from '@common/exceptions';

/**
 * General rate limiter for all routes
 */
export const generalRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new TooManyRequestsException('Too many requests, please try again later');
    },
});

/**
 * Strict rate limiter for authentication routes
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        throw new TooManyRequestsException('Too many login attempts, please try again in 15 minutes');
    },
});

/**
 * API rate limiter
 */
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'API rate limit exceeded',
    standardHeaders: true,
    legacyHeaders: false,
});
