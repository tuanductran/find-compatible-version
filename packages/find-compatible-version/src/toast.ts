export interface ToastFunction {
  success: (message: string, additionalInfo?: unknown) => void;
  warn: (message: string, additionalInfo?: unknown) => void;
  info: (message: string, additionalInfo?: unknown) => void;
  error: (message: string, additionalInfo?: unknown) => void;
}

let toastFn: ToastFunction | null = null;

/**
 * Sets the toast notification function to the provided implementation.
 * @param fn - The toast function to be set.
 */
export function setToastFunction(fn: ToastFunction): void {
  toastFn = fn;
}

/**
 * Notifies a successful action with the given message and optional additional information.
 * @param message - The message to be displayed for a successful action.
 * @param additionalInfo - Optional additional information related to the success.
 */
export function notifySuccess(message: string, additionalInfo?: unknown): void {
  toastFn?.success(message, additionalInfo);
}

/**
 * Notifies a warning with the given message and optional additional information.
 * @param message - The message to be displayed for a warning.
 * @param additionalInfo - Optional additional information related to the warning.
 */
export function notifyWarn(message: string, additionalInfo?: unknown): void {
  toastFn?.warn(message, additionalInfo);
}

/**
 * Notifies an informational message with the given message and optional additional information.
 * @param message - The message to be displayed for information.
 * @param additionalInfo - Optional additional information related to the info.
 */
export function notifyInfo(message: string, additionalInfo?: unknown): void {
  toastFn?.info(message, additionalInfo);
}

/**
 * Notifies an error with the given message and optional additional information.
 * @param message - The message to be displayed for an error.
 * @param additionalInfo - Optional additional information related to the error.
 */
export function notifyError(message: string, additionalInfo?: unknown): void {
  toastFn?.error(message, additionalInfo);
}