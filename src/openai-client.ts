import { createApiInstance } from './fetch-api';
import {
  BulkCompletionParamsSchema,
  CompletionParamsSchema,
} from './schemas/completion';
import { EditParamsSchema } from './schemas/edit';
import {
  BulkEmbeddingParamsSchema,
  EmbeddingParamsSchema,
} from './schemas/embedding';
import type {
  BulkCompletionParams,
  CompletionParams,
  CompletionResponse,
} from './schemas/completion';
import type { EditParams, EditResponse } from './schemas/edit';
import type {
  EmbeddingParams,
  EmbeddingResponse,
  BulkEmbeddingParams,
} from './schemas/embedding';
import type { FetchOptions } from './fetch-api';
import type {
  ChatCompletionParams,
  ChatCompletionResponse,
  ChatResponseMessage,
} from './schemas/chat-completion';
import { ChatCompletionParamsSchema } from './schemas/chat-completion';
import { StreamCompletionChunker } from './streaming';

export type ConfigOpts = {
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
  /**
   * Fetch options that will be added to all requests (like credentials, etc.).
   */
  fetchOptions?: FetchOptions;
  /**
   * HTTP headers that will be added to all requests.
   */
  headers?: Record<string, string> | Headers;
};

export class OpenAIClient {
  api: ReturnType<typeof createApiInstance>;

  constructor(opts: ConfigOpts = {}) {
    const process = globalThis.process || { env: {} };
    const apiKey = opts.apiKey || process.env.OPENAI_API_KEY;
    const organizationId = opts.organizationId || process.env.OPENAI_ORG_ID;
    if (!apiKey)
      throw new Error(
        'Missing OpenAI API key. Please provide one in the config or set the OPENAI_API_KEY environment variable.',
      );
    this.api = createApiInstance({
      apiKey,
      baseUrl: opts.baseUrl,
      organizationId,
      fetchOptions: opts.fetchOptions,
      headers: opts.headers,
    });
  }

  /**
   * Create an embedding for a single input string.
   * @param params.input The string to embed.
   * @param params.model The model to use for the embedding.
   * @param params.user A unique identifier representing the end-user.
   */
  async createEmbedding(params: EmbeddingParams): Promise<{
    /** The embedding for the input string. */
    embedding: number[];
    /** The raw response from the API. */
    response: EmbeddingResponse;
  }> {
    const reqBody = EmbeddingParamsSchema.passthrough().parse(params);
    const response: EmbeddingResponse = await this.api
      .post('embeddings', { json: reqBody })
      .json();
    const embedding = response.data[0].embedding;
    return { embedding, response };
  }

  /**
   * Create embeddings for an array of input strings.
   * @param params.input The strings to embed.
   * @param params.model The model to use for the embedding.
   * @param params.user A unique identifier representing the end-user.
   */
  async createEmbeddings(params: BulkEmbeddingParams): Promise<{
    /** The embeddings for the input strings. */
    embeddings: number[][];
    /** The raw response from the API. */
    response: EmbeddingResponse;
  }> {
    const reqBody = BulkEmbeddingParamsSchema.passthrough().parse(params);
    const response: EmbeddingResponse = await this.api
      .post('embeddings', { json: reqBody })
      .json();
    // Sort ascending by index to be safe.
    const items = response.data.sort((a, b) => a.index - b.index);
    const embeddings = items.map((item) => item.embedding);
    return { embeddings, response };
  }

  /**
   * Create a completion for a single prompt string.
   */
  async createCompletion(params: CompletionParams): Promise<{
    /** The completion string. */
    completion: string;
    /** The raw response from the API. */
    response: CompletionResponse;
  }> {
    const reqBody = CompletionParamsSchema.passthrough().parse(params);
    const response: CompletionResponse = await this.api
      .post('completions', { json: reqBody })
      .json();
    const completion = response.choices[0].text || '';
    return { completion, response };
  }

  /**
   * Create completions for an array of prompt strings.
   */
  async createCompletions(params: BulkCompletionParams): Promise<{
    /** The completion strings. */
    completions: string[];
    /** The raw response from the API. */
    response: CompletionResponse;
  }> {
    const reqBody = BulkCompletionParamsSchema.passthrough().parse(params);
    const response: CompletionResponse = await this.api
      .post('completions', { json: reqBody })
      .json();
    // Sort ascending by index to be safe.
    const choices = response.choices.sort(
      (a, b) => (a.index ?? 0) - (b.index ?? 0),
    );
    const completions = choices.map((choice) => choice.text || '');
    return { completions, response };
  }

  /**
   * Create a completion for a single prompt string and stream back partial progress.
   * @param params typipcal standard OpenAI completion parameters
   * @returns A stream of completion chunks.
   *
   * @example
   *
   * ```ts
   * const client = new OpenAIClient(process.env.OPENAI_API_KEY);
   * const stream = await client.streamCompletion({
   *   model: "text-davinci-003",
   *   prompt: "Give me some lyrics, make it up.",
   *   max_tokens: 256,
   *   temperature: 0,
   * });
   *
   * for await (const chunk of stream) {
   *   process.stdout.write(chunk.completion);
   * }
   * ```
   */
  async streamCompletion(params: CompletionParams): Promise<
    ReadableStream<{
      /** The completion string. */
      completion: string;
      /** The raw response from the API. */
      response: CompletionResponse;
    }>
  > {
    const reqBody = CompletionParamsSchema.passthrough().parse(params);
    const response = await this.api.post('completions', {
      json: { ...reqBody, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker((response: CompletionResponse) => {
        const completion = response.choices[0].text || '';
        return { completion, response };
      }),
    );
  }

  /**
   * Create a completion for a chat message.
   */
  async createChatCompletion(params: ChatCompletionParams): Promise<{
    /** The completion message. */
    message: ChatResponseMessage;
    /** The raw response from the API. */
    response: ChatCompletionResponse;
  }> {
    const reqBody = ChatCompletionParamsSchema.passthrough().parse(params);
    const response: ChatCompletionResponse = await this.api
      .post('chat/completions', { json: reqBody })
      .json();
    const message = response.choices[0].message || {
      role: 'assistant',
      content: '',
    };
    return { message, response };
  }

  async streamChatCompletion(params: ChatCompletionParams): Promise<
    ReadableStream<{
      /** The completion message. */
      message: ChatResponseMessage;
      /** The raw response from the API. */
      response: ChatCompletionResponse;
    }>
  > {
    const reqBody = ChatCompletionParamsSchema.passthrough().parse(params);
    const response = await this.api.post('chat/completions', {
      json: { ...reqBody, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker((response: ChatCompletionResponse) => {
        const message = response.choices[0].delta || {
          role: 'assistant',
          content: '',
        };
        return { message, response };
      }),
    );
  }

  /**
   * Create an edit for a single input string.
   */
  async createEdit(params: EditParams): Promise<{
    /** The edited input string. */
    completion: string;
    /** The raw response from the API. */
    response: EditResponse;
  }> {
    const reqBody = EditParamsSchema.passthrough().parse(params);
    const response: EditResponse = await this.api
      .post('edits', { json: reqBody })
      .json();
    const completion = response.choices[0].text || '';
    return { completion, response };
  }
}
