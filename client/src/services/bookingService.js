import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const bookingService = {
    // Get all stylers
    getStylers: async () => {
        const response = await api.get(API_ENDPOINTS.ADMIN_STYLERS);
        return response.data;
    },

    // Get all services
    getServices: async () => {
        const response = await api.get(API_ENDPOINTS.ADMIN_SERVICES);
        return response.data;
    },

    // Create appointment
    createAppointment: async (appointmentData) => {
        const response = await api.post(API_ENDPOINTS.USER_APPOINTMENTS, appointmentData);
        return response.data;
    },

    // Get user appointments
    getUserAppointments: async () => {
        const response = await api.get(API_ENDPOINTS.USER_APPOINTMENTS);
        return response.data;
    },

    // Get all appointments (admin)
    getAllAppointments: async () => {
        const response = await api.get(API_ENDPOINTS.ADMIN_APPOINTMENTS);
        return response.data;
    },
};
