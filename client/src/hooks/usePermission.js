import { useRBAC } from '../context/RBACContext';

/**
 * Hook to check if user has a specific permission
 * @param {string} permission - Permission to check (e.g., "salon:edit")
 * @returns {boolean}
 */
export const usePermission = (permission) => {
    const { hasPermission } = useRBAC();
    return hasPermission(permission);
};

/**
 * Hook to check if user has any of the specified permissions
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const useAnyPermission = (permissions) => {
    const { hasAnyPermission } = useRBAC();
    return hasAnyPermission(permissions);
};

/**
 * Hook to check if user has all of the specified permissions
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const useAllPermissions = (permissions) => {
    const { hasAllPermissions } = useRBAC();
    return hasAllPermissions(permissions);
};

/**
 * Hook to check if user has a specific role
 * @param {string|string[]} roles - Role(s) to check
 * @returns {boolean}
 */
export const useRole = (roles) => {
    const { hasRole } = useRBAC();
    return hasRole(roles);
};

/**
 * Hook to get current user's role and permissions
 * @returns {object} - { role, permissions, isSuperAdmin }
 */
export const useUserRole = () => {
    const { userRole, userPermissions, isSuperAdmin } = useRBAC();
    return {
        role: userRole,
        permissions: userPermissions,
        isSuperAdmin: isSuperAdmin(),
    };
};
