/**
 * Simple logging utility for debugging and monitoring
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
  private prefix = '[ChemSphere]';

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!isDevelopment) return;

    const timestamp = new Date().toISOString();
    const logMessage = `${this.prefix} [${timestamp}] [${level}] ${message}`;

    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  debug(message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: unknown) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: unknown) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: unknown) {
    this.log(LogLevel.ERROR, message, error);
  }
}

export const logger = new Logger();
