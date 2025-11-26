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
  TOKEN: 'token',
  EMAIL: 'email',
  USER_TYPE: 'userType',
  USER_NAME: 'userName',
};

// User Types
export const USER_TYPES = {
  ADMIN: 'admin',
  USER: 'user',
};
