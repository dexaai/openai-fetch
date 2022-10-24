import { createApiInstance } from './fetch-api';
import type {
  CompletionParams,
  CompletionParamsMulti,
  CompletionParamsSingle,
  CompletionResponse,
  CompletionResponseMulti,
  CompletionResponseSingle,
  EmbeddingParams,
  EmbeddingParamsSingle,
  EmbeddingParamsMulti,
  EmbeddingResponse,
  EmbeddingResponseSingle,
  EmbeddingResponseMulti,
  EmbeddingRequest,
} from './types';

type ConfigOpts = {
  /**
   * The API key used to authenticate with the OpenAI API.
   * @see https://beta.openai.com/account/api-keys
   */
  apiKey?: string;
  /**
   * The HTTP endpoint for the OpenAI API. You probably don't want to change this.
   */
  baseUrl?: string;
  /**
   * The organization ID that should be billed for API requests.
   * This is only necessary if your API key is scoped to multiple organizations.
   * @see https://beta.openai.com/docs/api-reference/requesting-organization
   */
  organizationId?: string;
};

export class OpenAIClient {
  api: ReturnType<typeof createApiInstance>;

  constructor(opts: ConfigOpts = {}) {
    const apiKey = opts.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey)
      throw new Error(
        'Missing OpenAI API key. Please provide one in the config or set the OPENAI_API_KEY environment variable.'
      );
    this.api = createApiInstance({
      apiKey,
      organizationId: opts.organizationId,
    });
  }

  async createCompletion(
    params: CompletionParamsSingle
  ): Promise<CompletionResponseSingle>;
  async createCompletion(
    params: CompletionParamsMulti
  ): Promise<CompletionResponseMulti>;
  async createCompletion(
    params: CompletionParams
  ): Promise<CompletionResponseSingle | CompletionResponseMulti> {
    const data: CompletionResponse = await this.api
      .post('completions', { json: params })
      .json();
    if (typeof params.prompt === 'string') {
      const completion = data.choices[0].text || '';
      return { completion, data };
    } else {
      const completions = data.choices.map((choice) => choice.text || '');
      return { completions, data };
    }
  }

  async createEmbedding(
    params: EmbeddingParamsSingle
  ): Promise<EmbeddingResponseSingle>;
  async createEmbedding(
    params: EmbeddingParamsMulti
  ): Promise<EmbeddingResponseMulti>;
  async createEmbedding(
    params: EmbeddingParams
  ): Promise<EmbeddingResponseSingle | EmbeddingResponseMulti> {
    const { dontRemoveNewlines, input, ...rest } = params;
    let processedInput = input;
    // Remove newlines from the input unless the user explicitly asks us not to, or code is being embedded.
    // @see https://beta.openai.com/docs/api-reference/embeddings/create#embeddings/create-input
    if (dontRemoveNewlines !== true && !params.model.startsWith('code-')) {
      processedInput = removeNewlines(input);
    }
    const reqBody: EmbeddingRequest = { input: processedInput, ...rest };
    const data: EmbeddingResponse = await this.api
      .post('embeddings', { json: reqBody })
      .json();
    if (typeof input === 'string') {
      const embedding = data.data[0].embedding;
      return { embedding, data };
    } else {
      const embeddings = data.data.map((item) => item.embedding);
      return { embeddings, data };
    }
  }
}

const newlineRegex = /\r?\n|\r/g;

/**
 * Replace all newline characters in a string with a single space.
 */
function removeNewlines(input: string | string[]): string | string[] {
  if (typeof input === 'string') {
    return input.replace(newlineRegex, ' ');
  } else {
    return input.map((str) => str.replace(newlineRegex, ' '));
  }
}
