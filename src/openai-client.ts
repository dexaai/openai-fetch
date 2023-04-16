import { createApiInstance } from './fetch-api';
import { CompletionParamsSchema } from './schemas/completion';
import { EditParamsSchema } from './schemas/edit';
import { EmbeddingParamsSchema } from './schemas/embedding';
import type {
  CompletionParams,
  CompletionResponse,
} from './schemas/completion';
import type { EditParams, EditResponse } from './schemas/edit';
import type { EmbeddingParams, EmbeddingResponse } from './schemas/embedding';
import type { FetchOptions } from './fetch-api';
import type {
  ChatCompletionParams,
  ChatCompletionResponse,
  ChatResponseMessage,
} from './schemas/chat-completion';
import { ChatCompletionParamsSchema } from './schemas/chat-completion';

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

  fetchOptions?: FetchOptions;
};

export type ProgressHandler = (chunk: string) => void;

// Returns true if the chunk is the last chunk.
const parseChunk = (
  chunk: Uint8Array,
  handlers: ProgressHandler[]
): boolean => {
  const decoder = new TextDecoder();
  const s = decoder.decode(chunk);
  let lastChunk = false;
  s.split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .forEach((line) => {
      const pos = line.indexOf(':');
      const name = line.substring(0, pos);
      if (name !== 'data') return;
      const content = line.substring(pos + 1).trim();
      if (content.length == 0) return;
      if (content === '[DONE]') {
        lastChunk = true;
        return;
      }
      try {
        const parsed = JSON.parse(content);
        handlers.forEach((h) => h(parsed.choices[0].text));
      } catch (e) {
        console.log('error parsing json', content);
        console.log('error', e);
      }
    });
  return lastChunk;
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
      baseUrl: opts.baseUrl,
      organizationId: opts.organizationId,
      fetchOptions: opts.fetchOptions,
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
    const reqBody = EmbeddingParamsSchema.parse(params);
    const response: EmbeddingResponse = await this.api
      .post('embeddings', { json: reqBody })
      .json();
    const embedding = response.data[0].embedding;
    return { embedding, response };
  }

  /**
   * Create a completion for a single prompt string.
   */
  async createCompletion(
    params: CompletionParams,
    onprogress?: ProgressHandler
  ): Promise<{
    /** The completion string. */
    completion: string;
    /** The raw response from the API. */
    response: CompletionResponse;
  }> {
    const reqBody = CompletionParamsSchema.parse(params);
    if (reqBody.stream) {
      const fullResponse: string[] = [];
      const completionResponseParts = {
        id: '',
        object: '',
        created: 0,
        model: '',
      };
      const handlers: ProgressHandler[] = [
        (c) => {
          fullResponse.push(c);
        },
      ];
      if (onprogress) handlers.push(onprogress);
      return new Promise((resolve) => {
        this.api.post('completions', {
          json: reqBody,
          onDownloadProgress: (_, chunk) => {
            if (parseChunk(chunk, handlers)) {
              const completion = fullResponse.join('');
              resolve({
                completion,
                response: {
                  ...completionResponseParts,
                  choices: [{ text: fullResponse.join('') }],
                },
              });
            }
          },
        });
      });
    }
    const response: CompletionResponse = await this.api
      .post('completions', { json: reqBody })
      .json();
    const completion = response.choices[0].text || '';
    return { completion, response };
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
    const reqBody = ChatCompletionParamsSchema.parse(params);
    const response: ChatCompletionResponse = await this.api
      .post('chat/completions', { json: reqBody })
      .json();
    const message = response.choices[0].message || {
      role: 'assistant',
      content: '',
    };
    return { message, response };
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
    const reqBody = EditParamsSchema.parse(params);
    const response: EditResponse = await this.api
      .post('edits', { json: reqBody })
      .json();
    const completion = response.choices[0].text || '';
    return { completion, response };
  }
}
