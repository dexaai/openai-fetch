import ky, { type KyInstance, type Options } from 'ky';

import { APIError, castToError } from './errors.js';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

export interface KyOptions extends Omit<Options, 'credentials'> {
  credentials?: 'include' | 'omit' | 'same-origin';
}

/**
 * Create an instance of Ky with options shared by all requests.
 */
export function createApiInstance(args: {
  apiKeyHeader: { [key: string]: string};
  baseUrl?: string;
  organizationId?: string;
  kyOptions?: KyOptions;
}): KyInstance {
  const { apiKeyHeader, baseUrl, organizationId, kyOptions = {} } = args;
  const { headers, hooks = {}, prefixUrl, retry, timeout, ...rest } = kyOptions;

  // Add a hook to handle OpenAI API errors
  if (!hooks.beforeError) {
    hooks.beforeError = [];
  }
  // @ts-ignore
  hooks.beforeError.push(async (error) => {
    const { response } = error;
    if (response) {
      const status = response.status;
      const headers = parseHeaders(response.headers);
      let errorResponse: object | undefined;
      let message: string | undefined;
      if (response.body) {
        const errText = await response
          .clone()
          .text()
          .catch((e) => castToError(e).message);
        errorResponse = safeJson(errText)?.error;
        message = errorResponse ? undefined : errText;
      }
      return new APIError(status, errorResponse, message, headers);
    } else {
      return APIError.generate(undefined, error, undefined, undefined);
    }
  });



  return ky.extend({
    prefixUrl: baseUrl || prefixUrl || DEFAULT_BASE_URL,
    headers: {
      'User-Agent': 'openai-fetch',
      ...apiKeyHeader,
      ...(organizationId && {
        'OpenAI-Organization': organizationId,
      }),
      'anthropic-version':'2023-06-01',
      ...headers,
    },
    retry: retry ?? {
      delay: (attemptCount) => {
        const INITIAL_DELAY = 0.3;
        const jitter = numberBetween(-0.3, 0.3);
        const sleep = INITIAL_DELAY * Math.pow(attemptCount - 1, 2);
        return (sleep + jitter) * 1000;
      },
    },
    timeout: timeout ?? 1000 * 60 * 10,
    hooks,
    ...rest,
  });
}

function parseHeaders(
  headers: HeadersInit | null | undefined
): Record<string, string> {
  try {
    return !headers
      ? {}
      : Symbol.iterator in headers
        ? Object.fromEntries(
            Array.from(headers as Iterable<string[]>).map((header) => [
              ...header,
            ])
          )
        : { ...headers };
  } catch (e) {
    return {};
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return undefined;
  }
}

/** Get a random number between the specified range [min, max]. */
function numberBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
