import bcrypt from 'bcrypt';
import { userRepository } from '@modules/users/repositories/user.repository';
import { tokenService } from './token.service';
import { config } from '@config/environment';
import { logger } from '@infrastructure/logger/logger.service';
import {
    InvalidCredentialsException,
    ConflictException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@common/exceptions';
import { JwtPayload, TokenPair } from '@common/interfaces';
import { IUser } from '@modules/users/entities/user.entity';
import { UserRole } from '@common/constants';

/**
 * Register DTO
 */
export interface RegisterDTO {
    email: string;
    phone: string;
    password: string;
    name: string;
    role?: UserRole;
}

/**
 * Login DTO
 */
export interface LoginDTO {
    emailOrPhone: string;
    password: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
    user: {
        id: string;
        email: string;
        phone: string;
        name: string;
        role: UserRole;
        profilePicture?: string;
        isVerified: boolean;
    };
    tokens: TokenPair;
}

/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */
export class AuthService {
    private readonly saltRounds = 10;
    private readonly maxLoginAttempts = config.platform.maxLoginAttempts;

    /**
     * Hash password
     */
    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    /**
     * Compare password
     */
    private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * Create JWT payload from user
     */
    private createJwtPayload(user: IUser): JwtPayload {
        return {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
    }

    /**
     * Register new user
     */
    async register(dto: RegisterDTO): Promise<LoginResponse> {
        // Check if user already exists
        const existingUser = await userRepository.findByEmailOrPhone(dto.email, dto.phone);
        if (existingUser) {
            if (existingUser.email === dto.email) {
                throw new ConflictException('Email already registered');
            }
            throw new ConflictException('Phone number already registered');
        }

        // Hash password
        const hashedPassword = await this.hashPassword(dto.password);

        // Create user
        const user = await userRepository.create({
            email: dto.email.toLowerCase(),
            phone: dto.phone,
            password: hashedPassword,
            name: dto.name,
            role: dto.role || UserRole.CUSTOMER,
            isActive: true,
            isVerified: false,
            emailVerified: false,
            phoneVerified: false,
            loginAttempts: 0,
        });

        logger.info(`New user registered: ${user.email}`);

        // Generate tokens
        const payload = this.createJwtPayload(user);
        const tokens = tokenService.generateTokenPair(payload);

        // Store refresh token
        await tokenService.storeRefreshToken(user._id.toString(), tokens.refreshToken);

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                phone: user.phone,
                name: user.name,
                role: user.role,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified,
            },
            tokens,
        };
    }

    /**
     * Login user
     */
    async login(dto: LoginDTO): Promise<LoginResponse> {
        // Find user by email or phone
        const isEmail = dto.emailOrPhone.includes('@');
        const user = isEmail
            ? await userRepository.findByEmailWithPassword(dto.emailOrPhone)
            : await userRepository.findByPhoneWithPassword(dto.emailOrPhone);

        if (!user) {
            throw new InvalidCredentialsException('Invalid credentials');
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            throw new UnauthorizedException(
                `Account is locked. Please try again in ${minutesLeft} minutes`
            );
        }

        // Check if account is active
        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await this.comparePassword(dto.password, user.password);

        if (!isPasswordValid) {
            // Increment login attempts
            await userRepository.incrementLoginAttempts(user._id.toString(), this.maxLoginAttempts);
            throw new InvalidCredentialsException('Invalid credentials');
        }

        // Reset login attempts and update last login
        await userRepository.updateLastLogin(user._id.toString());

        logger.info(`User logged in: ${user.email}`);

        // Generate tokens
        const payload = this.createJwtPayload(user);
        const tokens = tokenService.generateTokenPair(payload);

        // Store refresh token
        await tokenService.storeRefreshToken(user._id.toString(), tokens.refreshToken);

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                phone: user.phone,
                name: user.name,
                role: user.role,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified,
            },
            tokens,
        };
    }

    /**
     * Logout user
     */
    async logout(userId: string, accessToken: string): Promise<void> {
        // Blacklist access token
        await tokenService.blacklistToken(accessToken);

        // Remove refresh token
        await tokenService.revokeAllUserTokens(userId);

        logger.info(`User logged out: ${userId}`);
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<TokenPair> {
        // Verify refresh token
        const payload = tokenService.verifyRefreshToken(refreshToken);

        // Verify stored refresh token
        const isValid = await tokenService.verifyStoredRefreshToken(payload.userId, refreshToken);
        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Get user
        const user = await userRepository.findById(payload.userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }

        // Generate new tokens
        const newPayload = this.createJwtPayload(user);
        const tokens = tokenService.generateTokenPair(newPayload);

        // Store new refresh token
        await tokenService.storeRefreshToken(user._id.toString(), tokens.refreshToken);

        // Blacklist old refresh token
        await tokenService.blacklistToken(refreshToken);

        logger.info(`Token refreshed for user: ${user.email}`);

        return tokens;
    }

    /**
     * Change password
     */
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        // Get user with password
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userWithPassword = await userRepository.findByEmailWithPassword(user.email);
        if (!userWithPassword) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isPasswordValid = await this.comparePassword(currentPassword, userWithPassword.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await this.hashPassword(newPassword);

        // Update password
        await userRepository.updatePassword(userId, hashedPassword);

        // Revoke all tokens (force re-login)
        await tokenService.revokeAllUserTokens(userId);

        logger.info(`Password changed for user: ${user.email}`);
    }

    /**
     * Verify user (can be called after OTP verification)
     */
    async verifyUser(userId: string, verificationType: 'email' | 'phone'): Promise<void> {
        if (verificationType === 'email') {
            await userRepository.verifyEmail(userId);
        } else {
            await userRepository.verifyPhone(userId);
        }

        logger.info(`User ${verificationType} verified: ${userId}`);
    }

    /**
     * Get user profile
     */
    async getUserProfile(userId: string): Promise<IUser> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}

export const authService = new AuthService();
