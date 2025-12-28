import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            // Handle token expiration
            if (error.response.status === 401 && !originalRequest._retry) {
                // Check if this is a login/register endpoint - don't redirect for these
                const isAuthEndpoint = originalRequest.url?.includes('/login') ||
                    originalRequest.url?.includes('/register');

                if (isAuthEndpoint) {
                    // For login/register endpoints, just reject the error
                    // Let the component handle it
                    return Promise.reject(error);
                }

                if (error.response.data?.code === 'TOKEN_EXPIRED' ||
                    error.response.data?.message?.includes('expired')) {

                    if (isRefreshing) {
                        // Wait for the refresh to complete
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then(token => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return api(originalRequest);
                            })
                            .catch(err => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

                    if (!refreshToken) {
                        // No refresh token, redirect to login
                        clearAuthData();
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    try {
                        // Request new access token
                        const response = await axios.post(`${API_BASE_URL}/user/refresh-token`, {
                            refreshToken
                        });

                        const { token, refreshToken: newRefreshToken } = response.data;

                        // Update stored tokens
                        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
                        if (newRefreshToken) {
                            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
                        }

                        // Update Authorization header
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        originalRequest.headers.Authorization = `Bearer ${token}`;

                        processQueue(null, token);

                        return api(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        clearAuthData();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                // Other 401 errors on protected routes - clear auth and redirect
                clearAuthData();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Helper function to clear authentication data
const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.EMAIL);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
};

export default api;
