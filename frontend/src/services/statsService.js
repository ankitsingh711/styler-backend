import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9168';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Fetch statistics overview
 * @returns {Promise} Statistics data
 */
export const fetchStats = async () => {
    try {
        const response = await api.get('/stats/overview');
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

/**
 * Clear stats cache (admin only)
 * @returns {Promise} Response
 */
export const clearStatsCache = async () => {
    try {
        const response = await api.post('/stats/clear-cache');
        return response.data;
    } catch (error) {
        console.error('Error clearing cache:', error);
        throw error;
    }
};
