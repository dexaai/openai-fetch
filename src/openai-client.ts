import type { OpenAI } from 'openai';
import type { KyOptions } from './fetch-api.js';
import { createApiInstance } from './fetch-api.js';
import { StreamCompletionChunker } from './streaming.js';
import type {
  ChatParams,
  ChatResponse,
  ChatStreamParams,
  ChatStreamResponse,
  CompletionParams,
  CompletionResponse,
  CompletionStreamParams,
  CompletionStreamResponse,
  EmbeddingParams,
  EmbeddingResponse,
} from './types.js';

export type ConfigOpts = {
  /**
   * The API key used to authenticate with the OpenAI API.
   * @see https://platform.openai.com/account/api-keys
   */
  apiKey?: string;
  /**
   * The organization ID that should be billed for API requests.
   * This is only necessary if your API key is scoped to multiple organizations.
   * @see https://platform.openai.com/docs/api-reference/organization-optional
   */
  organizationId?: string;
  /**
   * The HTTP endpoint for the OpenAI API. You probably don't want to change this.
   * @default https://api.openai.com/v1
   */
  baseUrl?: string;
  /**
   * Options to pass to the underlying fetch library (Ky).
   * @see https://github.com/sindresorhus/ky/tree/main#options
   */
  kyOptions?: KyOptions;
};

export class OpenAIClient {
  api: ReturnType<typeof createApiInstance>;

  constructor(opts: ConfigOpts = {}) {
    const process = globalThis.process || { env: {} };
    const apiKey = opts.apiKey || process.env['OPENAI_API_KEY'];
    const organizationId = opts.organizationId || process.env['OPENAI_ORG_ID'];
    if (!apiKey)
      throw new Error(
        'Missing OpenAI API key. Please provide one in the config or set the OPENAI_API_KEY environment variable.',
      );
    this.api = createApiInstance({
      apiKey,
      baseUrl: opts.baseUrl,
      organizationId,
      kyOptions: opts.kyOptions,
    });
  }

  /** Create a completion for a chat message. */
  async createChatCompletion(params: ChatParams): Promise<ChatResponse> {
    const response: OpenAI.ChatCompletion = await this.api
      .post('chat/completions', { json: params })
      .json();
    return response;
  }

  /** Create a chat completion and stream back partial progress. */
  async streamChatCompletion(
    params: ChatStreamParams,
  ): Promise<ChatStreamResponse> {
    const response = await this.api.post('chat/completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker(
        (response: OpenAI.ChatCompletionChunk) => response,
      ),
    );
  }

  /** Create completions for an array of prompt strings. */
  async createCompletions(
    params: CompletionParams,
  ): Promise<CompletionResponse> {
    const response: OpenAI.Completion = await this.api
      .post('completions', { json: params })
      .json();
    return response;
  }

  /** Create a completion for a single prompt string and stream back partial progress. */
  async streamCompletion(
    params: CompletionStreamParams,
  ): Promise<CompletionStreamResponse> {
    const response = await this.api.post('completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker((response: OpenAI.Completion) => response),
    );
  }

  /** Create an embedding vector representing the input text. */
  async createEmbeddings(params: EmbeddingParams): Promise<EmbeddingResponse> {
    const response: OpenAI.CreateEmbeddingResponse = await this.api
      .post('embeddings', { json: params })
      .json();
    return response;
  }
}
