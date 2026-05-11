/**
 * Accessibility utilities for improving screen reader support
 */

/**
 * Generate a unique ID for aria-labelledby and aria-describedby
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if an element is visible to screen readers
 */
export const isScreenReaderVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
};

/**
 * Announce a message to screen readers
 */
export const announceToScreenReader = (message: string, role: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', role);
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => announcement.remove(), 1000);
};

/**
 * Focus management helper
 */
export const focusElement = (selector: string): boolean => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
    return true;
  }
  return false;
};
