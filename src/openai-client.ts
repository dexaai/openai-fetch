import type { z } from 'zod';
import { createApiInstance } from './fetch-api';
import { CompletionParams, EmbeddingParams } from './schema';
import type { EmbeddingResponse, CompletionResponse } from './schema';

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

  /**
   * Create an embedding for a single input string.
   * @param params.input The string to embed.
   * @param params.model The model to use for the embedding.
   * @param params.user A unique identifier representing the end-user.
   */
  async createEmbedding(params: z.input<typeof EmbeddingParams>): Promise<{
    /** The embedding for the input string. */
    embedding: number[];
    /** The raw response from the API. */
    response: EmbeddingResponse;
  }> {
    const parsedParams = EmbeddingParams.parse(params);
    const reqBody: z.output<typeof EmbeddingParams> = {
      input: preprocessInput(parsedParams),
      model: parsedParams.model,
      user: parsedParams.user,
    };
    const response: EmbeddingResponse = await this.api
      .post('embeddings', { json: reqBody })
      .json();
    const embedding = response.data[0].embedding;
    return { embedding, response };
  }

  /**
   * Create a completion for a single prompt string.
   */
  async createCompletion(params: z.input<typeof CompletionParams>): Promise<{
    /** The completion string. */
    completion: string;
    /** The raw response from the API. */
    response: CompletionResponse;
  }> {
    const reqBody = CompletionParams.parse(params);
    const response: CompletionResponse = await this.api
      .post('completions', { json: reqBody })
      .json();
    const completion = response.choices[0].text || '';
    return { completion, response };
  }
}

function preprocessInput(params: z.input<typeof EmbeddingParams>): string {
  const newlineRegex = /\r?\n|\r/g;
  let processedInput = params.input;
  // Remove newlines from the input unless the user explicitly asks us not to, or code is being embedded.
  // @see https://beta.openai.com/docs/api-reference/embeddings/create#embeddings/create-input
  if (params.dontRemoveNewlines !== true && !params.model.startsWith('code-')) {
    processedInput = params.input.replace(newlineRegex, ' ');
  }
  return processedInput;
}
