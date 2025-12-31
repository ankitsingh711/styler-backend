import { Request, Response, NextFunction } from 'express';
import { authService, RegisterDTO, LoginDTO } from '../services/auth.service';
import { AuthenticatedRequest } from '@common/interfaces';
import { HttpStatus } from '@common/constants';
import { BadRequestException } from '@common/exceptions';
import { isValidEmail, isValidPhone } from '@common/utils';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 */
export class AuthController {
    /**
     * Register new user
     * POST /api/v1/auth/register
     */
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, phone, password, name, role }: RegisterDTO = req.body;

            // Validation
            if (!email || !phone || !password || !name) {
                throw new BadRequestException('Email, phone, password, and name are required');
            }

            if (!isValidEmail(email)) {
                throw new BadRequestException('Invalid email format');
            }

            if (!isValidPhone(phone)) {
                throw new BadRequestException('Invalid phone number format');
            }

            if (password.length < 8) {
                throw new BadRequestException('Password must be at least 8 characters long');
            }

            // Register user
            const result = await authService.register({
                email,
                phone,
                password,
                name,
                role,
            });

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Registration successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login user
     * POST /api/v1/auth/login
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { emailOrPhone, password }: LoginDTO = req.body;

            // Validation
            if (!emailOrPhone || !password) {
                throw new BadRequestException('Email/phone and password are required');
            }

            // Login user
            const result = await authService.login({
                emailOrPhone,
                password,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logout user
     * POST /api/v1/auth/logout
     */
    async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const token = req.headers.authorization?.substring(7) || '';

            await authService.logout(userId, token);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh-token
     */
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw new BadRequestException('Refresh token is required');
            }

            const tokens = await authService.refreshToken(refreshToken);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Token refreshed successfully',
                data: tokens,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Change password
     * POST /api/v1/auth/change-password
     */
    async changePassword(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                throw new BadRequestException('Current password and new password are required');
            }

            if (newPassword.length < 8) {
                throw new BadRequestException('New password must be at least 8 characters long');
            }

            await authService.changePassword(userId, currentPassword, newPassword);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Password changed successfully. Please login again.',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current user profile
     * GET /api/v1/auth/me
     */
    async getCurrentUser(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const user = await authService.getUserProfile(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user profile
     * PUT /api/v1/auth/profile
     */
    async updateProfile(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            const { name, phone, profilePicture } = req.body;

            if (!name && !phone && !profilePicture) {
                throw new BadRequestException('At least one field must be provided for update');
            }

            const updatedUser = await authService.updateProfile(userId, {
                name,
                phone,
                profilePicture,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload profile picture
     * POST /api/v1/auth/upload-profile-picture
     */
    async uploadProfilePicture(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!req.file) {
                throw new BadRequestException('No file uploaded');
            }

            const profilePictureUrl = await authService.uploadProfilePicture(userId, req.file as any);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Profile picture uploaded successfully',
                data: { profilePicture: profilePictureUrl },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload cover image
     * POST /api/v1/auth/upload-cover-image
     */
    async uploadCoverImage(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new BadRequestException('User ID not found');
            }

            if (!req.file) {
                throw new BadRequestException('No file uploaded');
            }

            const coverImageUrl = await authService.uploadCoverImage(userId, req.file);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Cover image uploaded successfully',
                data: {
                    coverImage: coverImageUrl,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
