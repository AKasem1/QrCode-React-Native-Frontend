import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../utils/api';
import { saveToken, getToken, saveUserData, getUserData, clearStorage } from '../utils/storage';

// Create the context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    /**
     * Check authentication status on app load
     */
    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);

            const token = await getToken();

            if (token) {
                const storedUser = await getUserData();

                if (storedUser) {
                    setUser(storedUser);
                    setIsAuthenticated(true);
                } else {
                    const result = await getCurrentUser();

                    if (result.success) {
                        setUser(result.data.user);
                        setIsAuthenticated(true);
                        await saveUserData(result.data.user);
                    } else {
                        await logout();
                    }
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Login function
     */
    const login = async (email, password) => {
        try {
            const result = await apiLogin(email, password);

            if (result.success) {
                const { token, user } = result.data;

                await saveToken(token);
                await saveUserData(user);

                setUser(user);
                setIsAuthenticated(true);

                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    /**
     * Register function
     */
const register = async (name, email, password) => {
  try {
    const result = await apiRegister(name, email, password);
    
    console.log('Register result:', result); 
    
    if (result.success) {
      console.log('Token:', result.data?.token);
      console.log('User:', result.data?.user);   
      
      if (!result.data || !result.data.token || !result.data.user) {
        return { success: false, error: 'Invalid authentication data received' };
      }
      
      const { token, user } = result.data;
      
      await saveToken(token);
      await saveUserData(user);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
};


    /**
     * Logout function
     */
    const logout = async () => {
        try {
            await clearStorage();

            setUser(null);
            setIsAuthenticated(false);

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: 'Logout failed' };
        }
    };

    /**
     * Update user data in context
     */
    const updateUser = async (userData) => {
        try {
            setUser(userData);
            await saveUserData(userData);
            return { success: true };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: 'Failed to update user data' };
        }
    };

    /**
     * Refresh user data from API
     */
    const refreshUser = async () => {
        try {
            const result = await getCurrentUser();

            if (result.success) {
                setUser(result.data.user);
                await saveUserData(result.data.user);
                return { success: true, data: result.data.user };
            } else {
                if (result.error.includes('401') || result.error.includes('unauthorized')) {
                    await logout();
                }
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Refresh user error:', error);
            return { success: false, error: 'Failed to refresh user data' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
