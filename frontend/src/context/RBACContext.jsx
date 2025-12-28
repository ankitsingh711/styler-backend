import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RBACContext = createContext();

export const useRBAC = () => {
    const context = useContext(RBACContext);
    if (!context) {
        throw new Error('useRBAC must be used within RBACProvider');
    }
    return context;
};

export const RBACProvider = ({ children }) => {
    const { user } = useAuth();
    const [userPermissions, setUserPermissions] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Set role from user object
            setUserRole(user.role || 'customer');

            // Get permissions from user object (if provided by backend)
            // Otherwise, fetch from API
            if (user.permissions) {
                setUserPermissions(user.permissions);
            } else {
                // Fetch user permissions from backend
                fetchUserPermissions();
            }
        } else {
            setUserRole(null);
            setUserPermissions([]);
        }
        setLoading(false);
    }, [user]);

    const fetchUserPermissions = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/user/permissions');
            // const data = await response.json();
            // setUserPermissions(data.permissions);

            // For now, set empty array
            setUserPermissions([]);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            setUserPermissions([]);
        }
    };

    /**
     * Check if user has a specific permission
     * @param {string} permission - Permission to check (e.g., "salon:edit")
     * @returns {boolean}
     */
    const hasPermission = (permission) => {
        if (!user) return false;

        // Super admin has all permissions
        if (userRole === 'superadmin') return true;

        // Check if permission exists in user's permissions
        return userPermissions.includes(permission);
    };

    /**
     * Check if user has ANY of the specified permissions
     * @param {string[]} permissions - Array of permissions
     * @returns {boolean}
     */
    const hasAnyPermission = (permissions) => {
        if (!user) return false;
        if (userRole === 'superadmin') return true;

        return permissions.some(perm => userPermissions.includes(perm));
    };

    /**
     * Check if user has ALL of the specified permissions
     * @param {string[]} permissions - Array of permissions
     * @returns {boolean}
     */
    const hasAllPermissions = (permissions) => {
        if (!user) return false;
        if (userRole === 'superadmin') return true;

        return permissions.every(perm => userPermissions.includes(perm));
    };

    /**
     * Check if user has a specific role
     * @param {string|string[]} roles - Role(s) to check
     * @returns {boolean}
     */
    const hasRole = (roles) => {
        if (!user) return false;

        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        return allowedRoles.includes(userRole);
    };

    /**
     * Check if user is a super admin
     * @returns {boolean}
     */
    const isSuperAdmin = () => {
        return userRole === 'superadmin';
    };

    const value = {
        userRole,
        userPermissions,
        loading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        isSuperAdmin,
    };

    return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};
