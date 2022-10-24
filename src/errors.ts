import type { JsonObject } from 'type-fest';

export type ErrorOptions = {
  /** HTTP status code for the error. */
  status?: number;
  /** The original error that caused this error. */
  cause?: unknown;
  /** Additional context to be added to the error. */
  context?: JsonObject;
};

class BaseError extends Error {
  status?: number;
  context?: JsonObject;

  constructor(message: string, opts: ErrorOptions = {}) {
    if (opts.cause) {
      // @ts-ignore not sure why TS can't handle this
      super(message, { cause: opts.cause });
    } else {
      super(message);
    }

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    // Set stack trace to caller
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Status is used for Express error handling
    if (opts.status) {
      this.status = opts.status;
    }

    // Add additional context to the error
    if (opts.context) {
      this.context = opts.context;
    }
  }
}

/**
 * An error caused by an OpenAI API call.
 */
export class OpenAIApiError extends BaseError {
  constructor(message: string, opts: ErrorOptions = {}) {
    opts.status = opts.status || 500;
    super(message, opts);
    Error.captureStackTrace(this, this.constructor);
  }
}
