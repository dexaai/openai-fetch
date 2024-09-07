import { type Anthropic } from '../anthropic-types/index.js';
import { type OpenAI } from '../openai-types/index.js';
import { createApiInstance, type KyOptions } from './fetch-api.js';
import { StreamCompletionChunker } from './streaming.js';
import {
  type ChatParams,
  type ChatResponse,
  type ChatStreamParams,
  type ChatStreamResponse,
  type CompletionParams,
  type CompletionResponse,
  type CompletionStreamParams,
  type CompletionStreamResponse,
  type EmbeddingParams,
  type EmbeddingResponse,
  type ModerationParams,
  type ModerationResponse,
} from './types.js';


// Define a type that extracts the provider based on the baseUrl
type InferProvider<T> = T extends { baseUrl: `https://api.anthropic.com/v1` } ? 'anthropic' : 'openai';

type OpenAIConfigOpts = {
  /**
   * The HTTP endpoint for the OpenAI API. You probably don't want to change this.
   * @default https://api.openai.com/v1
   */
  baseUrl?: string
}

type AnthropicConfigOpts = {
  baseUrl: `https://api.anthropic.com/v1`
}


export type ConfigOpts = (OpenAIConfigOpts | AnthropicConfigOpts) &
 
 {
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
   * Options to pass to the underlying fetch library (Ky).
   * @see https://github.com/sindresorhus/ky/tree/main#options
   */
  kyOptions?: KyOptions;
};

/** Override the default Ky options for a single request. */
type RequestOpts = {
  headers?: KyOptions['headers'] & (AnthropicConfigOpts | OpenAIConfigOpts);
  signal?: AbortSignal;
};

export class OpenAIClient<T extends ConfigOpts = ConfigOpts> {
  private api: ReturnType<typeof createApiInstance>;
  private opts: T;

  constructor(opts: T) {
    this.opts = opts;
    const process = globalThis.process || { env: {} };
    const apiKey = opts.apiKey || process.env.OPENAI_API_KEY;
    const organizationId = opts.organizationId || process.env.OPENAI_ORG_ID;
    if (!apiKey)
      throw new Error(
        'Missing OpenAI API key. Please provide one in the config or set the OPENAI_API_KEY environment variable.'
      );

    this.api = createApiInstance({
      apiKey,
      anthropicApiKey: this.getProvider(opts.baseUrl) === 'anthropic' ? apiKey : undefined,
      baseUrl: opts.baseUrl,
      organizationId,
      kyOptions: opts.kyOptions,
    });
  }

  getProvider(overrideBaseUrl?: string) {
    const defaultBaseUrl = this.opts.baseUrl;
    const baseUrl = overrideBaseUrl || defaultBaseUrl;
    return baseUrl?.includes('anthropic') ? 'anthropic' : 'openai';
  }

  private getApi(opts?: RequestOpts) {
    return opts ? this.api.extend(opts) : this.api;
  }

  private convertToolDefinitionToAnthropicFormat(tool: OpenAI.ChatCompletionTool): Anthropic.Tool {
    return {
      name: tool.function.name,
      description: tool.function.description,
      input_schema: {
        type: 'object',
        ...tool.function.parameters 
      }
    };
  }
  private convertChatParamsToAnthropicFormat(params: ChatParams<'anthropic'>) {
    // Anthropic doesn't allow a system prompt in messages.
    const messages = params.messages.filter(msg => msg.role !== 'system');

    // Convert the tool definitions to the Anthropic format.
    const tools = params.tools?.map(this.convertToolDefinitionToAnthropicFormat);

    return {
      ...params,
      messages,
      tools
    };
  }

  private convertToolCallToOpenAIFormat(toolCall: Anthropic.ToolUseBlock): OpenAI.ChatCompletionMessageToolCall {
    return {
      id: toolCall.id,
      type: 'function',
      function: {
        name: toolCall.name,
        arguments: JSON.stringify(toolCall.input),
      },
    };
  }


  private convertAnthropicResponseToOpenAIFormat(response: any):  OpenAI.ChatCompletion {
    const textContent = response.content.filter((content: any) => content.type === 'text')[0].text;
    const toolCalls = response.content.filter((content: any) => content.type === 'tool_use') as Anthropic.ToolUseBlock[];


    return {
      id: response.id,
      object: 'chat.completion',
      created: Date.now(),
      model: response.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: textContent,
            refusal: null,
            tool_calls: toolCalls.map(this.convertToolCallToOpenAIFormat),
          },
          logprobs: {
            content: [],
            refusal: [],
          },
          finish_reason: response.stop_reason,
        },
      ],
      usage: {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  private convertAnthropicStreamToOpenAIFormat(response: any): OpenAI.ChatCompletionChunk {
    return {
      id: response.id,
      object: 'chat.completion.chunk',
      created: Date.now(),
      model: response.model,
      choices: [
        {
          index: 0,
          delta: {
            role: 'assistant',
            content: response.text,
            refusal: null,
          },
          logprobs: {
            content: [],
            refusal: [],
          },
          finish_reason: response.stop_reason,
        },
      ],
    };
  }
  

  /** Create a completion for a chat message. */
  async createChatCompletion<R extends RequestOpts>(
    params: ChatParams<InferProvider<R['headers'] & T>> ,
    opts?: R
  ): Promise<ChatResponse> {
    if (this.getProvider(opts?.headers?.baseUrl) === 'anthropic') {
      const anthropicParams = this.convertChatParamsToAnthropicFormat(params as ChatParams<'anthropic'>);
      const anthropicResponse = await this.getApi(opts).post('messages', { json: anthropicParams }).json();
      return this.convertAnthropicResponseToOpenAIFormat(anthropicResponse);
    }

    const response: OpenAI.ChatCompletion = await this.getApi(opts)
      .post('chat/completions', { json: params })
      .json();
    return response;
  }

  /** Create a chat completion and stream back partial progress. */
  async streamChatCompletion(
    params: ChatStreamParams<InferProvider<T>>,
    opts?: RequestOpts
  ): Promise<ChatStreamResponse> {
    if (this.getProvider(opts?.headers?.baseUrl) === 'anthropic') {
      const anthropicParams = this.convertChatParamsToAnthropicFormat(params as ChatParams<'anthropic'>);
      const response = await this.getApi(opts).post('messages', {
        json: { ...anthropicParams, stream: true },
        onDownloadProgress: () => {}, // trick ky to return ReadableStream.
      });
      const stream = response.body as ReadableStream;
      return stream.pipeThrough(
        new StreamCompletionChunker(
          (response: Anthropic.TextDelta) => this.convertAnthropicStreamToOpenAIFormat(response),
          'anthropic'
        )
      )
    }

    const response = await this.getApi(opts).post('chat/completions', {
      json: { ...params, stream: true },
      onDownloadProgress: () => {}, // trick ky to return ReadableStream.
    });
    const stream = response.body as ReadableStream;
    return stream.pipeThrough(
      new StreamCompletionChunker(
        (response: OpenAI.ChatCompletionChunk) => response,
        'openai'
      )
    );
  }

  /** Create completions for an array of prompt strings. */
  async createCompletions(
    params: CompletionParams,
    opts?: RequestOpts
  ): Promise<CompletionResponse> {
    const response: OpenAI.Completion = await this.getApi(opts)
      .post('completions', { json: params })
      .json();
    return response;
  }

  /** Create a completion for a single prompt string and stream back partial progress. */
  async streamCompletion(
    params: CompletionStreamParams,
    opts?: RequestOpts
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
    params: EmbeddingParams,
    opts?: RequestOpts
  ): Promise<EmbeddingResponse> {
    const response: OpenAI.CreateEmbeddingResponse = await this.getApi(opts)
      .post('embeddings', { json: params })
      .json();
    return response;
  }

  /** Given some input text, outputs if the model classifies it as potentially harmful across several categories. */
  async createModeration(
    params: ModerationParams,
    opts?: RequestOpts
  ): Promise<ModerationResponse> {
    const response: OpenAI.ModerationCreateResponse = await this.getApi(opts)
      .post('moderations', { json: params })
      .json();
    return response;
  }
}
