import { fetch } from 'native-fetch';

import { OpenAIApiError } from './errors';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1/';

export interface FetchOptions
  extends Omit<RequestInfo, 'credentials' | 'headers'> {
  credentials?: string;
}

/**
 * Create an instance of Ky with options shared by all requests.
 */
export function createApiInstance(opts: {
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;
  fetchOptions?: FetchOptions;
  headers?: Record<string, string> | Headers;
}) {
  return {
    async post(path: string, options: RequestInit & { json?: any }) {
      const response = await fetch(
        new URL(path, opts.baseUrl || DEFAULT_BASE_URL),
        {
          method: 'POST',
          headers: {
            'User-Agent': 'openai-fetch',
            Authorization: `Bearer ${opts.apiKey}`,
            ...(opts.organizationId && {
              'OpenAI-Organization': opts.organizationId,
            }),
            ...opts.headers,
            ...(options.json && { 'content-type': 'application/json' }),
            // @ts-expect-error: here for backwards compatibility
            ...opts?.fetchOptions?.headers,
          },
          ...(options.json && { body: JSON.stringify(options.json) }),
        }
      );
      if (!response.ok && response.body) {
        const body = await response.clone().json();
        if (body?.error) {
          throw new OpenAIApiError(body.error?.message, {
            status: response.status,
            context: {
              type: body.error?.type,
              code: body.error?.code,
              param: body.error?.param,
            },
          });
        }
      }
      return response;
    },
  };
}
