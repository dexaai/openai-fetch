// The OpenAI client class
export { OpenAIClient } from './openai-client';

// Zod schemas
export { ChatCompletionParamsSchema } from './schemas/chat-completion';
export { CompletionParamsSchema } from './schemas/completion';
export { EmbeddingParamsSchema } from './schemas/embedding';
export { EditParamsSchema } from './schemas/edit';

// Custom OpenAI error
export { OpenAIApiError } from './errors';

// Types
export type {
  ChatCompletionParams,
  ChatCompletionResponse,
  ChatMessageRole,
  ChatResponseMessage,
} from './schemas/chat-completion';
export type {
  CompletionParams,
  CompletionResponse,
} from './schemas/completion';
export type { EmbeddingParams, EmbeddingResponse } from './schemas/embedding';
export type { EditParams, EditResponse } from './schemas/edit';
export type { ConfigOpts } from './openai-client';
