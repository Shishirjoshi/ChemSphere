/**
 * Local storage utilities with type safety
 */

export const StorageKeys = {
  USER_PREFERENCES: 'chemsphere_user_preferences',
  QUIZ_PROGRESS: 'chemsphere_quiz_progress',
  THEME: 'chemsphere_theme',
  LANGUAGE: 'chemsphere_language',
  LAST_VISITED: 'chemsphere_last_visited',
} as const;

/**
 * Safely get a value from localStorage
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Safely set a value in localStorage
 */
export const setInStorage = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove an item from localStorage
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
