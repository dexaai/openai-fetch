// The OpenAI client class
export { OpenAIClient } from './openai-client.js';

// Zod schemas
export {
  ChatCompletionParamsSchema,
  ChatMessageFunctionCallSchema,
  ChatMessageFunctionSchema,
  ChatMessageRoleSchema,
  ChatMessageSchema,
} from './schemas/chat-completion.js';
export {
  BulkCompletionParamsSchema,
  CompletionParamsSchema,
} from './schemas/completion.js';
export {
  BulkEmbeddingParamsSchema,
  EmbeddingParamsSchema,
} from './schemas/embedding.js';
export { EditParamsSchema } from './schemas/edit.js';

// Custom OpenAI error
export { OpenAIApiError } from './errors.js';

// Types
export type {
  ChatCompletionParams,
  ChatCompletionResponse,
  ChatMessage,
  ChatMessageFunction,
  ChatMessageFunctionCall,
  ChatMessageRole,
  ChatResponseMessage,
} from './schemas/chat-completion.js';
export type {
  BulkCompletionParams,
  CompletionParams,
  CompletionResponse,
} from './schemas/completion.js';
export type {
  BulkEmbeddingParams,
  EmbeddingParams,
  EmbeddingResponse,
} from './schemas/embedding.js';
export type { EditParams, EditResponse } from './schemas/edit.js';
export type { ConfigOpts } from './openai-client.js';
