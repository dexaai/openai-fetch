import ky from 'ky';
import { OpenAIApiError } from './errors';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

/**
 * Create an instance of Ky with options shared by all requests.
 */
export function createApiInstance(opts: {
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;
}) {
  return ky.extend({
    prefixUrl: opts.baseUrl || DEFAULT_BASE_URL,
    timeout: 1000 * 60,
    headers: {
      'User-Agent': 'openai-fetch',
      Authorization: `Bearer ${opts.apiKey}`,
      ...(opts.organizationId && {
        'OpenAI-Organization': opts.organizationId,
      }),
    },
    hooks: {
      beforeError: [
        // @ts-ignore
        async (error) => {
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
        },
      ],
    },
  });
}
