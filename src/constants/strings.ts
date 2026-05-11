/**
 * String constants for UI messages and labels
 */

export const APP_STRINGS = {
  appName: 'ChemSphere',
  appDescription: 'Interactive Chemistry Learning Platform',
  loading: 'Loading...',
  error: 'An error occurred',
  retry: 'Retry',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  back: 'Back',
  next: 'Next',
  submit: 'Submit',
} as const;

export const SIMULATOR_STRINGS = {
  bondSimulator: 'Bond Simulator',
  moleculeShapeVisualizer: 'Molecule Shape Visualizer',
  lewisStructure: 'Lewis Structure Generator',
  periodicTable: 'Periodic Table',
} as const;

export const ERROR_MESSAGES = {
  networkError: 'Network error. Please check your connection.',
  authFailed: 'Authentication failed. Please try again.',
  loadFailed: 'Failed to load content. Please try again.',
  invalidInput: 'Invalid input. Please check your entries.',
} as const;
