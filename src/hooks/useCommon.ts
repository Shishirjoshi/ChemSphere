/**
 * React hooks collection for common patterns
 */

import { useEffect, useState } from 'react';

/**
 * Hook for debounced values
 * Useful for search inputs and real-time filtering
 */
export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for checking if a component is mounted
 * Prevents state updates on unmounted components
 */
export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

/**
 * Hook for previous value
 * Returns the previous render's value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const [previous, setPrevious] = useState<T | undefined>();

  useEffect(() => {
    setPrevious(value);
  }, [value]);

  return previous;
};

/**
 * Hook for local storage synchronization
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save to localStorage: ${key}`, error);
    }
  };

  return [storedValue, setValue];
};
