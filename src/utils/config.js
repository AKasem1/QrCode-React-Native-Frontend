
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.10:4000/api',
  TIMEOUT: 10000, // 10 seconds
};

export const APP_CONFIG = {
  QR_REFRESH_INTERVAL: 60000, 
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
};

export const ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_RESET_CODE: '/auth/verify-reset-code',  
  RESET_PASSWORD: '/auth/reset-password',
  GET_ME: '/auth/me',
  
  GET_QR_CURRENT: '/qr/current',
  REFRESH_QR: '/qr/refresh',
};
