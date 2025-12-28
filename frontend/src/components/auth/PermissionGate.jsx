import React from 'react';
import { useRBAC } from '../../context/RBACContext';

/**
 * PermissionGate component - Conditionally renders children based on permissions
 * Usage:
 *   <PermissionGate permission="salon:edit">
 *     <EditButton />
 *   </PermissionGate>
 * 
 *   <PermissionGate role="superadmin">
 *     <AdminPanel />
 *   </PermissionGate>
 * 
 *   <PermissionGate anyPermission={["salon:edit", "salon:view"]}>
 *     <SalonDetails />
 *   </PermissionGate>
 */
const PermissionGate = ({
    children,
    permission = null,
    anyPermission = null,
    allPermissions = null,
    role = null,
    fallback = null
}) => {
    const {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole
    } = useRBAC();

    // Check role if specified
    if (role && !hasRole(role)) {
        return fallback;
    }

    // Check single permission if specified
    if (permission && !hasPermission(permission)) {
        return fallback;
    }

    // Check any permission if specified
    if (anyPermission && !hasAnyPermission(anyPermission)) {
        return fallback;
    }

    // Check all permissions if specified
    if (allPermissions && !hasAllPermissions(allPermissions)) {
        return fallback;
    }

    // User has required permissions/role
    return children;
};

export default PermissionGate;
