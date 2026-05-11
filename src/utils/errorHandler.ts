/**
 * Error handling and reporting utilities
 */

import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Handle errors with logging and reporting
 */
export const handleError = (error: unknown, context: string): AppError => {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError('UNKNOWN_ERROR', error.message, error);
  } else {
    appError = new AppError('UNKNOWN_ERROR', String(error));
  }

  logger.error(`Error in ${context}:`, appError);
  return appError;
};

/**
 * Safe async error wrapper
 */
export const tryCatch = async <T>(
  fn: () => Promise<T>,
  context: string
): Promise<[T | null, AppError | null]> => {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const appError = handleError(error, context);
    return [null, appError];
  }
};
