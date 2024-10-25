import {
  type AIChatClient,
  type AICompletionClient,
  type AIEmbeddingClient,
  type AIFetchClient,
  type AIFetchRequestOpts,
  type ChatParams,
  type ChatResponse,
  type ChatStreamParams,
  type ChatStreamResponse,
  type CompletionParams,
  type CompletionResponse,
  type CompletionStreamParams,
  type CompletionStreamResponse,
  createApiInstance,
  type EmbeddingParams,
  type EmbeddingResponse,
} from 'ai-fetch';
import { type Options as KyOptions } from 'ky';
import { type OpenAI } from 'openai';

import { StreamCompletionChunker } from './streaming.js';
import {
  type SpeechParams,
  type SpeechResponse,
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

export class OpenAIClient implements AIFetchClient, AIChatClient, AIEmbeddingClient, AICompletionClient {
  name = 'openai';
  api: ReturnType<typeof createApiInstance>;

  constructor(opts: ConfigOpts = {}) {
    const process = globalThis.process || { env: {} };
    const apiKey = opts.apiKey || process.env.OPENAI_API_KEY;
    const organizationId = opts.organizationId || process.env.OPENAI_ORG_ID;
    const prefixUrl =
    opts.baseUrl ||
      process.env.OPENAI_BASE_URL ||
      'https://api.openai.com';
    if (!apiKey)
      throw new Error(
        'Missing OpenAI API key. Please provide one in the config or set the OPENAI_API_KEY environment variable.'
      );
    this.api = createApiInstance({
      ...opts.kyOptions,
      prefixUrl,
      headers: {
        ...opts.kyOptions?.headers,
        'User-Agent': 'openai-fetch',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Organization': organizationId,
      },
    });
  }

  private getApi(opts?: AIFetchRequestOpts) {
    return opts ? this.api.extend(opts) : this.api;
  }

  /** Create a completion for a chat message. */
  async createChatCompletion(
    params: ChatParams<OpenAI.ChatCompletionCreateParams['model']>,
    opts?: AIFetchRequestOpts
  ): Promise<ChatResponse> {
    const response: OpenAI.ChatCompletion = await this.getApi(opts)
      .post('chat/completions', { json: params })
      .json();
    return response;
  }

  /** Create a chat completion and stream back partial progress. */
  async streamChatCompletion(
    params: ChatStreamParams<OpenAI.ChatCompletionCreateParamsStreaming['model']>,
    opts?: AIFetchRequestOpts
  ): Promise<ChatStreamResponse> {
    const response = await this.getApi(opts).post('chat/completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker(
        (response: OpenAI.ChatCompletionChunk) => response
      )
    );
  }

  /** Create completions for an array of prompt strings. */
  async createCompletions(
    params: CompletionParams<OpenAI.CompletionCreateParams['model']>,
    opts?: AIFetchRequestOpts
  ): Promise<CompletionResponse> {
    const response: OpenAI.Completion = await this.getApi(opts)
      .post('completions', { json: params })
      .json();
    return response;
  }

  /** Create a completion for a single prompt string and stream back partial progress. */
  async streamCompletion(
    params: CompletionStreamParams<OpenAI.CompletionCreateParamsStreaming['model']>,
    opts?: AIFetchRequestOpts
  ): Promise<CompletionStreamResponse> {
    const response = await this.getApi(opts).post('completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker((response: OpenAI.Completion) => response)
    );
  }

  /** Create an embedding vector representing the input text. */
  async createEmbeddings(
    params: EmbeddingParams<OpenAI.EmbeddingCreateParams['model']>,
    opts?: AIFetchRequestOpts
  ): Promise<EmbeddingResponse> {
    const response: OpenAI.CreateEmbeddingResponse = await this.getApi(opts)
      .post('embeddings', { json: params })
      .json();
    return response;
  }

  /** Given some input text, outputs if the model classifies it as potentially harmful across several categories. */
  async createModeration(
    params: OpenAI.ModerationCreateParams,
    opts?: AIFetchRequestOpts
  ): Promise<OpenAI.ModerationCreateResponse> {
    const response: OpenAI.ModerationCreateResponse = await this.getApi(opts)
      .post('moderations', { json: params })
      .json();
    return response;
  }

  /** Generates audio from the input text. Also known as TTS. */
  async createSpeech(
    params: SpeechParams,
    opts?: AIFetchRequestOpts
  ): Promise<SpeechResponse> {
    const response = await this.getApi(opts)
      .post('audio/speech', { json: params })
      .arrayBuffer();
    return response;
  }
}
