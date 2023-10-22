import type { OpenAI } from 'openai';

export type ChatMessage = OpenAI.ChatCompletionMessageParam;
export type ChatParams = Omit<OpenAI.ChatCompletionCreateParams, 'stream'>;
export type ChatResponse = OpenAI.ChatCompletion;

export type ChatStreamParams = Omit<
  OpenAI.ChatCompletionCreateParams,
  'stream'
>;
export type ChatStreamResponse = ReadableStream<OpenAI.ChatCompletionChunk>;

export type CompletionParams = Omit<OpenAI.CompletionCreateParams, 'stream'>;
export type CompletionResponse = OpenAI.Completion;

export type CompletionStreamParams = Omit<
  OpenAI.CompletionCreateParams,
  'prompt'
> & { prompt: string };
export type CompletionStreamResponse = ReadableStream<OpenAI.Completion>;

export type EmbeddingParams = OpenAI.EmbeddingCreateParams;
export type EmbeddingResponse = OpenAI.CreateEmbeddingResponse;
