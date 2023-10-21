import ky from 'ky';
import type { Options } from 'ky';
import { OpenAIApiError } from './errors.js';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

type KyInstance = ReturnType<typeof ky.extend>;
export interface KyOptions extends Omit<Options, 'credentials'> {
  credentials?: 'include' | 'omit' | 'same-origin';
}

/**
 * Create an instance of Ky with options shared by all requests.
 */
export function createApiInstance(args: {
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;
  kyOptions?: KyOptions;
}): KyInstance {
  const { apiKey, baseUrl, organizationId, kyOptions = {} } = args;
  const { headers, hooks = {}, prefixUrl, retry, timeout, ...rest } = kyOptions;

  // Add a hook to handle OpenAI API errors
  if (!hooks.beforeError) {
    hooks.beforeError = [];
  }
  // @ts-ignore
  hooks.beforeError.push(async (error) => {
    const { response } = error;
    if (response && response.body) {
      try {
        const body = await response.clone().json();
        if (body.error) {
          return new OpenAIApiError(body.error.message, {
            status: response.status,
            cause: error,
            context: {
              type: body.error.type,
              code: body.error.code,
              param: body.error.param,
            },
          });
        }
      } catch (e) {
        console.error('Failed reading HTTPError response body', e);
      }
    }
    return error;
  });

  return ky.extend({
    prefixUrl: baseUrl || prefixUrl || DEFAULT_BASE_URL,
    headers: {
      'User-Agent': 'openai-fetch',
      ...(apiKey && {
        Authorization: `Bearer ${apiKey}`,
      }),
      ...(organizationId && {
        'OpenAI-Organization': organizationId,
      }),
      ...headers,
    },
    ...(retry && { retry }),
    timeout: timeout ?? 1000 * 60 * 10,
    hooks,
    ...rest,
  });
}
