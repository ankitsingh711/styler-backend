import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, USER_TYPES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const email = localStorage.getItem(STORAGE_KEYS.EMAIL);
        const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
        const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME);

        if (token && email) {
            setUser({
                email,
                userType: userType || USER_TYPES.USER,
                userName: userName || email,
            });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        const { token, email, userType = USER_TYPES.USER, name } = userData;

        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.EMAIL, email);
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
        if (name) {
            localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
        }

        setUser({
            email,
            userType,
            userName: name || email,
        });
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.EMAIL);
        localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
        localStorage.removeItem(STORAGE_KEYS.USER_NAME);
        setUser(null);
    };

    const isAdmin = () => {
        return user?.userType === USER_TYPES.ADMIN;
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAdmin,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
