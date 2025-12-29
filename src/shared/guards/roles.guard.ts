import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '@common/exceptions';
import { AuthenticatedRequest } from '@common/interfaces';
import { UserRole } from '@common/constants';

/**
 * Role Guard Middleware Factory
 * Checks if user has required role(s)
 */
export function rolesGuard(...allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new ForbiddenException('Authentication required');
            }

            const userRole = req.user.role as UserRole;

            if (!allowedRoles.includes(userRole)) {
                throw new ForbiddenException(
                    `Access denied. Required role(s): ${allowedRoles.join(', ')}`
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Check if user is admin (superadmin or salon_owner for their salon)
 */
export function adminGuard(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
        if (!req.user) {
            throw new ForbiddenException('Authentication required');
        }

        const userRole = req.user.role as UserRole;
        const adminRoles = [UserRole.SUPER_ADMIN, UserRole.SALON_OWNER];

        if (!adminRoles.includes(userRole)) {
            throw new ForbiddenException('Admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Check if user is super admin
 */
export function superAdminGuard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    try {
        if (!req.user) {
            throw new ForbiddenException('Authentication required');
        }

        if (req.user.role !== UserRole.SUPER_ADMIN) {
            throw new ForbiddenException('Super admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Check if user is verified
 */
export async function verifiedGuard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            throw new ForbiddenException('Authentication required');
        }

        // Import here to avoid circular dependency
        const { userRepository } = await import('@modules/users/repositories/user.repository');
        const user = await userRepository.findById(req.user.userId);

        if (!user || !user.isVerified) {
            throw new ForbiddenException('Account verification required');
        }

        next();
    } catch (error) {
        next(error);
    }
}
