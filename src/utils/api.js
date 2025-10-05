import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from './config';
import { getToken } from './storage';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== AUTH/USER API FUNCTIONS ====================

export const register = async (name, email, password) => {
  try {
    const response = await api.post(ENDPOINTS.REGISTER, {
      name,
      email,
      password,
    });

    if (!response.data) {
      return { success: false, error: 'Registration failed' };
    }

    const { data } = response.data;
    
    if (!data || !data.token || !data.user) {
      return { success: false, error: 'Missing authentication data' };
    }

    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Registration failed',
    };
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post(ENDPOINTS.LOGIN, {
      email,
      password,
    });

    if (!response.data) {
      return { success: false, error: 'Login failed' };
    }

    const { data } = response.data;
    
    if (!data || !data.token || !data.user) {
      return { success: false, error: 'Missing authentication data' };
    }

    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Login failed',
    };
  }
};

/**
 * Send password reset code to email
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Failed to send reset code',
    };
  }
};

/**
 * Verify the 6-digit reset code
 */
export const verifyResetCode = async (email, code) => {
  try {
    const response = await api.post(ENDPOINTS.VERIFY_RESET_CODE, {
      email,
      code,
    });
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Invalid or expired code',
    };
  }
};

/**
 * Reset password with verified code
 */
export const resetPassword = async (email, code, password) => {
  try {
    const response = await api.put(ENDPOINTS.RESET_PASSWORD, {
      email,
      code,
      password,
    });
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Failed to reset password',
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get(ENDPOINTS.GET_ME);
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Failed to get user',
    };
  }
};

// ==================== QR CODE API FUNCTIONS ====================

export const getCurrentQR = async () => {
  try {
    const response = await api.get(ENDPOINTS.GET_QR_CURRENT);
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Failed to get QR code',
    };
  }
};

export const refreshQR = async () => {
  try {
    const response = await api.post(ENDPOINTS.REFRESH_QR);
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Failed to refresh QR code',
    };
  }
};

export default api;
