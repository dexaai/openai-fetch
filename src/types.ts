import { type OpenAI } from '../openai-types/index.js';

/** The possible roles for a message. */
export type Role = 'system' | 'user' | 'assistant' | 'function' | 'tool';

/** The name and arguments of a function that should be called, as generated by the model. */
export type FunctionCall = {
  /** The arguments to call the function with, as generated by the model in JSON format. */
  arguments: string;
  /** The name of the function to call. */
  name: string;
};

/** The tool calls generated by the model, such as function calls. */
export type ToolCall = {
  /** The ID of the tool call. */
  id: string;
  /** The type of the tool. Currently, only `function` is supported. */
  type: 'function';
  /** The function that the model called. */
  function: FunctionCall;
};

export type ChatMessage = {
  /**
   * The role of the messages author. One of `system`, `user`, `assistant`,
   * `tool`, or `function`.
   */
  role: Role;

  /**
   * The contents of the message. `content` may be null for assistant messages
   * with function calls or for assistant messages if a `refusal` was given by
   * the model.
   */
  content?: string | null;

  /**
   * The refusal message if one was generated by the model.
   */
  refusal?: string | null;

  /**
   * The name and arguments of a function that should be called, as generated by the model.
   */
  function_call?: FunctionCall;

  /**
   * The tool calls generated by the model, such as function calls.
   */
  tool_calls?: ToolCall[];

  /**
   * Tool call that this message is responding to.
   */
  tool_call_id?: string;

  /**
   * An optional name for the participant. Provides the model information to
   * differentiate between participants of the same role.
   */
  name?: string;
};

export type ChatParams = Omit<
  OpenAI.ChatCompletionCreateParams,
  'stream' | 'messages'
> & { messages: ChatMessage[] };
export type ChatResponse = OpenAI.ChatCompletion;

export type ChatStreamParams = ChatParams;
export type ChatStreamChunk = OpenAI.ChatCompletionChunk;
export type ChatStreamResponse = ReadableStream<ChatStreamChunk>;

export type CompletionParams = Omit<OpenAI.CompletionCreateParams, 'stream'>;
export type CompletionResponse = OpenAI.Completion;

export type CompletionStreamParams = Omit<
  OpenAI.CompletionCreateParams,
  'prompt'
> & { prompt: string };
export type CompletionStreamResponse = ReadableStream<OpenAI.Completion>;

export type EmbeddingParams = OpenAI.EmbeddingCreateParams;
export type EmbeddingResponse = OpenAI.CreateEmbeddingResponse;

export type ModerationParams = OpenAI.ModerationCreateParams;
export type ModerationResponse = OpenAI.ModerationCreateResponse;

export type SpeechParams = OpenAI.Audio.SpeechCreateParams;
export type SpeechResponse = ArrayBuffer;
