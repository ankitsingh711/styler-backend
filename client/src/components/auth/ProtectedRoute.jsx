import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRBAC } from '../../context/RBACContext';
import { Center, Loader } from '@mantine/core';

/**
 * ProtectedRoute component - Protects routes based on permissions or roles
 */
const ProtectedRoute = ({
    children,
    permission = null,
    anyPermission = null,
    allPermissions = null,
    role = null,
    redirectTo = '/login',
    fallback = null
}) => {
    const { user, loading: authLoading } = useAuth();
    const {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        loading: rbacLoading
    } = useRBAC();

    // Show loading state while checking auth and permissions
    if (authLoading || rbacLoading) {
        return (
            <Center style={{ minHeight: '100vh' }}>
                <Loader size="lg" />
            </Center>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check role if specified
    if (role && !hasRole(role)) {
        return fallback || <Navigate to="/unauthorized" replace />;
    }

    // Check single permission if specified
    if (permission && !hasPermission(permission)) {
        return fallback || <Navigate to="/unauthorized" replace />;
    }

    // Check any permission if specified
    if (anyPermission && !hasAnyPermission(anyPermission)) {
        return fallback || <Navigate to="/unauthorized" replace />;
    }

    // Check all permissions if specified
    if (allPermissions && !hasAllPermissions(allPermissions)) {
        return fallback || <Navigate to="/unauthorized" replace />;
    }

    // User has required permissions/role
    return children;
};

export default ProtectedRoute;
