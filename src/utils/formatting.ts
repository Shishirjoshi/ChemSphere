/**
 * Formatting utilities for common data types
 */

/**
 * Format a number to 2 decimal places
 */
export const formatDecimal = (value: number, places: number = 2): string => {
  return value.toFixed(places);
};

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Format a percentage
 */
export const formatPercentage = (value: number, places: number = 1): string => {
  return `${(value * 100).toFixed(places)}%`;
};

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format molecule name for display
 */
export const formatMoleculeName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};
