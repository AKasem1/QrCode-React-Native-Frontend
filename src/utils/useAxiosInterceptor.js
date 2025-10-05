import { useEffect } from 'react';
import api from './api';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to setup axios interceptor with AuthContext
 * This allows automatic logout on 401 errors
 */
export const useAxiosInterceptor = () => {
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // Response interceptor - Handle 401 errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        // If 401 Unauthorized and user is authenticated, logout
        if (error.response?.status === 401 && isAuthenticated) {
          console.log('Token expired or invalid. Logging out...');
          await logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: Remove interceptor on unmount or when auth state changes
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated, logout]);
};
