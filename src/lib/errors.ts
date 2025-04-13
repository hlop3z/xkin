/**
 * Custom error class for Xkin-specific errors.
 */
export class XkinError extends Error {
  /**
   * Additional context or data about the error
   */
  public context?: Record<string, any>;

  /**
   * Creates a new XkinError instance
   * @param message - Error message
   * @param context - Additional error context data
   */
  constructor(message: string, context?: Record<string, any>) {
    super(message);
    this.name = 'XkinError';
    this.context = context;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, XkinError.prototype);
  }
}

/**
 * Error severity levels for logging and handling
 */
export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Configuration for error handling
 */
export interface ErrorHandlerConfig {
  /**
   * Whether to log errors to the console
   */
  enableLogging: boolean;
  
  /**
   * Minimum level of errors to handle
   */
  minimumLevel: ErrorLevel;
  
  /**
   * Custom error handler function
   */
  customHandler?: (error: Error, level: ErrorLevel, context?: Record<string, any>) => void;
}

// Default configuration
const defaultConfig: ErrorHandlerConfig = {
  enableLogging: true,
  minimumLevel: ErrorLevel.WARNING
};

// Current configuration
let currentConfig: ErrorHandlerConfig = { ...defaultConfig };

/**
 * Configures the error handler
 * @param config - Error handler configuration
 */
export function configureErrorHandler(config: Partial<ErrorHandlerConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Handles an error according to the current configuration
 * @param error - Error to handle
 * @param level - Error severity level
 * @param context - Additional context
 */
export function handleError(
  error: Error | string,
  level: ErrorLevel = ErrorLevel.ERROR,
  context?: Record<string, any>
): void {
  // Skip if below minimum level
  if (!shouldHandleErrorLevel(level)) {
    return;
  }
  
  // Create error object if string provided
  const errorObj = typeof error === 'string' 
    ? new XkinError(error, context)
    : error;
  
  // Log to console if enabled
  if (currentConfig.enableLogging) {
    logError(errorObj, level, context);
  }
  
  // Call custom handler if provided
  if (currentConfig.customHandler) {
    try {
      currentConfig.customHandler(errorObj, level, context);
    } catch (handlerError) {
      // Fallback to console if custom handler fails
      console.error('Error in custom error handler:', handlerError);
    }
  }
}

/**
 * Determines if an error level should be handled based on configuration
 * @param level - Error level to check
 * @returns Whether the error should be handled
 */
function shouldHandleErrorLevel(level: ErrorLevel): boolean {
  const levels = [
    ErrorLevel.DEBUG,
    ErrorLevel.INFO,
    ErrorLevel.WARNING,
    ErrorLevel.ERROR,
    ErrorLevel.CRITICAL
  ];
  
  const configLevelIndex = levels.indexOf(currentConfig.minimumLevel);
  const errorLevelIndex = levels.indexOf(level);
  
  return errorLevelIndex >= configLevelIndex;
}

/**
 * Logs an error to the console
 * @param error - Error to log
 * @param level - Error severity level
 * @param context - Additional context
 */
function logError(error: Error, level: ErrorLevel, context?: Record<string, any>): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';
  
  switch (level) {
    case ErrorLevel.DEBUG:
      console.debug(`[${timestamp}] [DEBUG] ${error.message}${contextStr}`);
      break;
    case ErrorLevel.INFO:
      console.info(`[${timestamp}] [INFO] ${error.message}${contextStr}`);
      break;
    case ErrorLevel.WARNING:
      console.warn(`[${timestamp}] [WARNING] ${error.message}${contextStr}`);
      break;
    case ErrorLevel.CRITICAL:
      console.error(`[${timestamp}] [CRITICAL] ${error.message}${contextStr}`);
      console.error(error.stack);
      break;
    case ErrorLevel.ERROR:
    default:
      console.error(`[${timestamp}] [ERROR] ${error.message}${contextStr}`);
      console.error(error.stack);
      break;
  }
}

// Convenience methods for different error levels
export const debug = (message: string, context?: Record<string, any>): void => 
  handleError(message, ErrorLevel.DEBUG, context);

export const info = (message: string, context?: Record<string, any>): void => 
  handleError(message, ErrorLevel.INFO, context);

export const warn = (message: string, context?: Record<string, any>): void => 
  handleError(message, ErrorLevel.WARNING, context);

export const error = (message: string, context?: Record<string, any>): void => 
  handleError(message, ErrorLevel.ERROR, context);

export const critical = (message: string, context?: Record<string, any>): void => 
  handleError(message, ErrorLevel.CRITICAL, context); 