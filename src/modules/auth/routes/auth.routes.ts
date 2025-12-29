import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authGuard } from '@shared/guards/auth.guard';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res, next) => authController.register(req, res, next));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authGuard, (req, res, next) => authController.logout(req, res, next));

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next));

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authGuard, (req, res, next) =>
    authController.changePassword(req, res, next)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authGuard, (req, res, next) => authController.getCurrentUser(req, res, next));

export const authRoutes: Router = router;
