import * as SecureStore from 'expo-secure-store';
import { APP_CONFIG } from './config';

/**
 * Save authentication token securely
 */
export const saveToken = async (token) => {
  try {
    // Validate token is a string
    if (!token || typeof token !== 'string') {
      console.error('Invalid token:', token);
      throw new Error('Token must be a non-empty string');
    }
    
    await SecureStore.setItemAsync(APP_CONFIG.TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

/**
 * Get authentication token
 */
export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(APP_CONFIG.TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Remove authentication token
 */
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(APP_CONFIG.TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

/**
 * Save user data (non-sensitive)
 */
export const saveUserData = async (userData) => {
  try {
    // Validate userData exists
    if (!userData) {
      console.error('Invalid user data:', userData);
      throw new Error('User data cannot be null or undefined');
    }
    
    // Convert to string if not already
    const dataString = typeof userData === 'string' 
      ? userData 
      : JSON.stringify(userData);
    
    await SecureStore.setItemAsync(APP_CONFIG.USER_KEY, dataString);
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Get user data
 */
export const getUserData = async () => {
  try {
    const data = await SecureStore.getItemAsync(APP_CONFIG.USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Remove user data
 */
export const removeUserData = async () => {
  try {
    await SecureStore.deleteItemAsync(APP_CONFIG.USER_KEY);
    return true;
  } catch (error) {
    console.error('Error removing user data:', error);
    return false;
  }
};

/**
 * Clear all stored data (logout)
 */
export const clearStorage = async () => {
  try {
    await removeToken();
    await removeUserData();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};
