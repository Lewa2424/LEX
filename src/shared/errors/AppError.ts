export interface AppErrorOptions {
  cause?: unknown;
  retryable?: boolean;
  fieldErrors?: Record<string, string[]>;
  correlationId?: string;
}

export class AppError extends Error {
  readonly code: string;
  readonly retryable: boolean;
  readonly fieldErrors?: Record<string, string[]>;
  readonly correlationId?: string;

  constructor(code: string, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.code = code;
    this.retryable = options.retryable ?? false;
    this.fieldErrors = options.fieldErrors;
    this.correlationId = options.correlationId;
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;

export const toAppError = (
  error: unknown,
  code = 'UNKNOWN_ERROR',
  message = 'An unexpected error occurred',
): AppError => {
  if (isAppError(error)) return error;
  return new AppError(code, message, { cause: error });
};
