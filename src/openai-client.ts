import type { OpenAI } from 'openai';
import type { KyOptions } from './fetch-api.js';
import { createApiInstance } from './fetch-api.js';
import { StreamCompletionChunker } from './streaming.js';

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

type EmbeddingParams = Omit<OpenAI.EmbeddingCreateParams, 'input'> & {
  input: string | number[];
};
type BulkEmbeddingParams = Omit<OpenAI.EmbeddingCreateParams, 'input'> & {
  input: string[] | number[][];
};

type CompletionParams = Omit<OpenAI.CompletionCreateParams, 'prompt'> & {
  prompt: string;
};
type BulkCompletionParams = Omit<OpenAI.CompletionCreateParams, 'prompt'> & {
  prompt: string[];
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

  /** Creates an embedding vector representing the input text. */
  async createEmbedding(params: EmbeddingParams): Promise<{
    embedding: number[];
    /** The raw response from the API. */
    response: OpenAI.CreateEmbeddingResponse;
  }> {
    const response: OpenAI.CreateEmbeddingResponse = await this.api
      .post('embeddings', { json: params })
      .json();
    const embedding = response.data[0]?.embedding || [];
    return { embedding, response };
  }

  /** Creates embedding vectors representing the input texts. */
  async createEmbeddings(params: BulkEmbeddingParams): Promise<{
    /** The embeddings for the input strings. */
    embeddings: number[][];
    /** The raw response from the API. */
    response: OpenAI.CreateEmbeddingResponse;
  }> {
    const response: OpenAI.CreateEmbeddingResponse = await this.api
      .post('embeddings', { json: params })
      .json();
    // Sort ascending by index to be safe.
    const items = response.data.sort((a, b) => a.index - b.index);
    const embeddings = items.map((item) => item.embedding);
    return { embeddings, response };
  }

  /** Create a completion for a single prompt string. */
  async createCompletion(params: CompletionParams): Promise<{
    /** The completion string. */
    completion: string;
    /** The raw response from the API. */
    response: OpenAI.Completion;
  }> {
    const response: OpenAI.Completion = await this.api
      .post('completions', { json: params })
      .json();
    const completion = response.choices[0]?.text || '';
    return { completion, response };
  }

  /** Create completions for an array of prompt strings. */
  async createCompletions(params: BulkCompletionParams): Promise<{
    /** The completion strings. */
    completions: string[];
    /** The raw response from the API. */
    response: OpenAI.Completion;
  }> {
    const response: OpenAI.Completion = await this.api
      .post('completions', { json: params })
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
      response: OpenAI.Completion;
    }>
  > {
    const response = await this.api.post('completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker((response: OpenAI.Completion) => {
        const completion = response.choices[0]?.text || '';
        return { completion, response };
      }),
    );
  }

  /**
   * Create a completion for a chat message.
   */
  async createChatCompletion(
    params: Omit<OpenAI.ChatCompletionCreateParams, 'stream'>,
  ): Promise<{
    /** The completion message. */
    message: OpenAI.ChatCompletionMessage;
    /** The raw response from the API. */
    response: OpenAI.ChatCompletion;
  }> {
    const response: OpenAI.ChatCompletion = await this.api
      .post('chat/completions', { json: params })
      .json();
    const message = response.choices[0]?.message || {
      role: 'assistant',
      content: '',
    };
    return { message, response };
  }

  async streamChatCompletion(
    params: Omit<OpenAI.ChatCompletionCreateParams, 'stream'>,
  ): Promise<
    ReadableStream<{
      /** The completion message. */
      message: OpenAI.ChatCompletionMessage;
      /** The raw response from the API. */
      response: OpenAI.ChatCompletion;
    }>
  > {
    const response = await this.api.post('chat/completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker((response: OpenAI.ChatCompletion) => {
        // @ts-ignore
        const message = response.choices[0]?.delta || {
          role: 'assistant',
          content: '',
        };
        return { message, response };
      }),
    );
  }
}
