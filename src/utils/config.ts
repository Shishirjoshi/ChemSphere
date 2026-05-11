/**
 * Environment configuration utilities
 * Safely access environment variables with type checking
 */

/**
 * Get environment variable with fallback
 * @param key - The environment variable key
 * @param defaultValue - Fallback value if not found
 * @returns The environment variable value or default
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  const value = import.meta.env[`VITE_${key}`];
  return value || defaultValue;
};

/**
 * Firebase configuration from environment variables
 */
export const FIREBASE_CONFIG = {
  apiKey: getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('FIREBASE_APP_ID'),
} as const;

/**
 * Gemini API configuration from environment variables
 */
export const GEMINI_CONFIG = {
  apiKey: getEnv('GEMINI_API_KEY'),
  model: 'gemini-2.0-flash',
} as const;

/**
 * Application configuration
 */
export const APP_CONFIG = {
  mode: getEnv('APP_MODE', 'production'),
  name: getEnv('APP_NAME', 'ChemSphere'),
  version: '1.0.0',
  isDevelopment: getEnv('APP_MODE', 'production') === 'development',
} as const;

/**
 * Verify that all required environment variables are set
 * @returns boolean - True if all required variables are configured
 */
export const isConfigValid = (): boolean => {
  const required = ['FIREBASE_API_KEY', 'GEMINI_API_KEY'];
  return required.every(key => !!getEnv(key));
};
