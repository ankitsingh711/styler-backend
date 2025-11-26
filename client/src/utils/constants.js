// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9168';

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USER_REGISTER: '/user/register',
  USER_LOGIN: '/user/login',
  USER_PROFILE: '/user/profile',
  USER_UPDATE: '/user/update',
  USER_APPOINTMENTS: '/user/appointments',
  
  // Admin endpoints
  ADMIN_LOGIN: '/admin/login',
  ADMIN_USERS: '/admin/users',
  ADMIN_BLOCK_USER: '/admin/block',
  ADMIN_STYLERS: '/admin/stylers',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_APPOINTMENTS: '/admin/appointments',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'styler_token',
  REFRESH_TOKEN: 'styler_refresh_token',
  EMAIL: 'styler_email',
  USER_TYPE: 'styler_user_type',
  USER_NAME: 'styler_user_name',
};

// User Types
export const USER_TYPES = {
  ADMIN: 'admin',
  USER: 'user',
};
