import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
    // User registration
    register: async (userData) => {
        const response = await api.post(API_ENDPOINTS.USER_REGISTER, userData);
        return response.data;
    },

    // User login
    login: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.USER_LOGIN, credentials);
        return response.data;
    },

    // Admin login
    adminLogin: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.ADMIN_LOGIN, credentials);
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get(API_ENDPOINTS.USER_PROFILE);
        return response.data;
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put(API_ENDPOINTS.USER_UPDATE, userData);
        return response.data;
    },
};
