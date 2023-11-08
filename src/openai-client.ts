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
  Beta,
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

/** Override the default Ky options for a single request. */
type RequestOpts = { headers?: KyOptions['headers'] };

export class OpenAIClient {
  private api: ReturnType<typeof createApiInstance>;

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

  private getApi(opts?: RequestOpts) {
    return opts ? this.api.extend(opts) : this.api;
  }

  /** Create a completion for a chat message. */
  async createChatCompletion(
    params: ChatParams,
    opts?: RequestOpts,
  ): Promise<ChatResponse> {
    const response: OpenAI.ChatCompletion = await this.getApi(opts)
      .post('chat/completions', { json: params })
      .json();
    return response;
  }

  /** Create a chat completion and stream back partial progress. */
  async streamChatCompletion(
    params: ChatStreamParams,
    opts?: RequestOpts,
  ): Promise<ChatStreamResponse> {
    const response = await this.getApi(opts).post('chat/completions', {
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
    opts?: RequestOpts,
  ): Promise<CompletionResponse> {
    const response: OpenAI.Completion = await this.getApi(opts)
      .post('completions', { json: params })
      .json();
    return response;
  }

  /** Create a completion for a single prompt string and stream back partial progress. */
  async streamCompletion(
    params: CompletionStreamParams,
    opts?: RequestOpts,
  ): Promise<CompletionStreamResponse> {
    const response = await this.getApi(opts).post('completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker((response: OpenAI.Completion) => response),
    );
  }

  /** Create an embedding vector representing the input text. */
  async createEmbeddings(
    params: EmbeddingParams,
    opts?: RequestOpts,
  ): Promise<EmbeddingResponse> {
    const response: OpenAI.CreateEmbeddingResponse = await this.getApi(opts)
      .post('embeddings', { json: params })
      .json();
    return response;
  }

  /* ------------------------------- Files API ------------------------------- */

  /**
   * Upload a file that can be used across various endpoints/features. The size of
   * all the files uploaded by one organization can be up to 100 GB.
   *
   * The size of individual files for can be a maximum of 512MB. See the
   * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) to
   * learn more about the types of files supported. The Fine-tuning API only supports
   * `.jsonl` files.
   *
   * Please [contact us](https://help.openai.com/) if you need to increase these
   * storage limits.
   */
  async createFile(params: OpenAI.FileCreateParams, opts?: RequestOpts) {
    return this.getApi(opts)
      .post('files', { json: params })
      .json<OpenAI.FileObject>();
  }

  /**
   * Returns information about a specific file.
   */
  async getFile(fileId: string, opts?: RequestOpts) {
    return this.getApi(opts).get(`files/${fileId}`).json<OpenAI.FileObject>();
  }

  /**
   * Returns the contents of the specified file.
   */
  async getFileContent(fileId: string, opts?: RequestOpts) {
    return this.getApi(opts).get(`files/${fileId}/content`).text();
  }

  /**
   * Delete a file.
   */
  async deleteFile(fileId: string, opts?: RequestOpts) {
    return this.getApi(opts)
      .delete(`files/${fileId}`)
      .json<OpenAI.FileDeleted>();
  }

  /**
   * Returns a list of files that belong to the user's organization.
   */
  async listFiles(params?: OpenAI.FileListParams, opts?: RequestOpts) {
    return this.getApi(opts)
      .get('files', {
        searchParams: params ?? ({} as any),
      })
      .json<OpenAI.PageResponse<OpenAI.FileObject>>();
  }

  /* ------------------------------- Beta API ------------------------------- */

  /** Create an assistant with a model and instructions. */
  async createBetaAssistant(
    params: Beta.AssistantCreateParams,
    opts?: RequestOpts,
  ) {
    return this.getApi(opts)
      .post('assistants', { json: params })
      .json<Beta.Assistant>();
  }

  /** Retrieves an assistant. */
  async getBetaAssistant(assistantId: string, opts?: RequestOpts) {
    if (!assistantId) {
      throw new Error('Missing required "assistantId"');
    }

    return this.getApi(opts)
      .get(`assistants/${assistantId}`)
      .json<Beta.Assistant>();
  }

  /** Modifies an assistant. */
  async updateBetaAssistant(
    assistantId: string,
    params: Beta.AssistantUpdateParams,
    opts?: RequestOpts,
  ) {
    if (!assistantId) {
      throw new Error('Missing required "assistantId"');
    }

    return this.getApi(opts)
      .post(`assistants/${assistantId}`, { json: params })
      .json<Beta.Assistant>();
  }

  /** Delete an assistant. */
  async deleteBetaAssistant(assistantId: string, opts?: RequestOpts) {
    if (!assistantId) {
      throw new Error('Missing required "assistantId"');
    }

    return this.getApi(opts)
      .delete(`assistants/${assistantId}`)
      .json<Beta.AssistantDeleted>();
  }

  /** Returns a list of assistants. */
  async listBetaAssistants(
    params?: Beta.AssistantListParams,
    opts?: RequestOpts,
  ) {
    return this.getApi(opts)
      .get('assistants', {
        searchParams: params ?? ({} as any),
      })
      .json<OpenAI.PageResponse<Beta.Assistant>>();
  }

  /** Create an assistant file by attaching a File to an assistant. */
  async createBetaAssistantFile(
    assistantId: string,
    params: OpenAI.Beta.Assistants.FileCreateParams,
    opts?: RequestOpts,
  ) {
    if (!assistantId) {
      throw new Error('Missing required "assistantId"');
    }

    if (!params.file_id) {
      throw new Error('Missing required "params.file_id"');
    }

    return this.getApi(opts)
      .post(`assistants/${assistantId}/files`, { json: params })
      .json<OpenAI.Beta.Assistants.AssistantFile>();
  }

  /** Retrieves an AssistantFile. */
  async getBetaAssistantFile(
    assistantId: string,
    fileId: string,
    opts?: RequestOpts,
  ) {
    if (!assistantId) {
      throw new Error('Missing required "assistantId"');
    }

    if (!fileId) {
      throw new Error('Missing required "fileId"');
    }

    return this.getApi(opts)
      .get(`assistants/${assistantId}/files/${fileId}`)
      .json<OpenAI.Beta.Assistants.AssistantFile>();
  }

  /** Delete an assistant file. */
  async deleteBetaAssistantFile(
    assistantId: string,
    fileId: string,
    opts?: RequestOpts,
  ) {
    if (!assistantId) {
      throw new Error('Missing required "assistantId"');
    }

    if (!fileId) {
      throw new Error('Missing required "fileId"');
    }

    return this.getApi(opts)
      .delete(`assistants/${assistantId}/files/${fileId}`)
      .json<OpenAI.Beta.Assistants.FileDeleteResponse>();
  }

  /** Returns a list of assistant files. */
  async listBetaAssistantFiles(
    assistantId: string,
    params?: OpenAI.Beta.Assistants.FileListParams,
    opts?: RequestOpts,
  ) {
    if (!assistantId) {
      throw new Error('Missing required "assistantId"');
    }

    return this.getApi(opts)
      .get(`assistants/${assistantId}`, {
        searchParams: params ?? ({} as any),
      })
      .json<OpenAI.PageResponse<OpenAI.Beta.Assistants.AssistantFile>>();
  }
}
