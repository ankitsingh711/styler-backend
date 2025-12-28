const { RoleModel } = require("../models/RoleModel");
const { UserModel } = require("../models/UserModel");

/**
 * RBAC Middleware - Check if user has required permission(s)
 */

/**
 * Middleware to check if user has a specific permission
 * @param {string} permission - Permission to check (e.g., "salon:edit")
 */
const requirePermission = (permission) => {
    return async (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const userId = req.user._id;
            const user = await UserModel.findById(userId);

            if (!user || !user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "User account is inactive"
                });
            }

            // Super admin has all permissions
            if (user.role === "superadmin") {
                return next();
            }

            // Get role permissions
            const role = await RoleModel.findOne({ name: user.role });
            if (!role || !role.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or inactive role"
                });
            }

            // Check if permission exists in role or custom permissions
            const hasPermission =
                role.permissions.includes(permission) ||
                (user.customPermissions && user.customPermissions.includes(permission));

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required permission: ${permission}`,
                    requiredPermission: permission
                });
            }

            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({
                success: false,
                message: "Error checking permissions"
            });
        }
    };
};

/**
 * Middleware to check if user has ANY of the specified permissions
 * @param {string[]} permissions - Array of permissions
 */
const requireAnyPermission = (permissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const userId = req.user._id;
            const user = await UserModel.findById(userId);

            if (!user || !user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "User account is inactive"
                });
            }

            // Super admin has all permissions
            if (user.role === "superadmin") {
                return next();
            }

            // Get role permissions
            const role = await RoleModel.findOne({ name: user.role });
            if (!role || !role.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or inactive role"
                });
            }

            // Combine role and custom permissions
            const allPermissions = [
                ...role.permissions,
                ...(user.customPermissions || [])
            ];

            // Check if user has any of the required permissions
            const hasAnyPermission = permissions.some(perm =>
                allPermissions.includes(perm)
            );

            if (!hasAnyPermission) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required one of: ${permissions.join(", ")}`,
                    requiredPermissions: permissions
                });
            }

            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({
                success: false,
                message: "Error checking permissions"
            });
        }
    };
};

/**
 * Middleware to check if user has ALL of the specified permissions
 * @param {string[]} permissions - Array of permissions
 */
const requireAllPermissions = (permissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const userId = req.user._id;
            const user = await UserModel.findById(userId);

            if (!user || !user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "User account is inactive"
                });
            }

            // Super admin has all permissions
            if (user.role === "superadmin") {
                return next();
            }

            // Get role permissions
            const role = await RoleModel.findOne({ name: user.role });
            if (!role || !role.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or inactive role"
                });
            }

            // Combine role and custom permissions
            const allPermissions = [
                ...role.permissions,
                ...(user.customPermissions || [])
            ];

            // Check if user has all required permissions
            const hasAllPermissions = permissions.every(perm =>
                allPermissions.includes(perm)
            );

            if (!hasAllPermissions) {
                const missingPermissions = permissions.filter(perm =>
                    !allPermissions.includes(perm)
                );
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Missing permissions: ${missingPermissions.join(", ")}`,
                    requiredPermissions: permissions,
                    missingPermissions
                });
            }

            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({
                success: false,
                message: "Error checking permissions"
            });
        }
    };
};

/**
 * Middleware to check if user has a specific role
 * @param {string|string[]} roles - Role(s) to check
 */
const requireRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return async (req, res, next) => {
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const userId = req.user._id;
            const user = await UserModel.findById(userId);

            if (!user || !user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "User account is inactive"
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
                    requiredRoles: allowedRoles
                });
            }

            next();
        } catch (error) {
            console.error("Role check error:", error);
            return res.status(500).json({
                success: false,
                message: "Error checking role"
            });
        }
    };
};

module.exports = {
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    requireRole
};
