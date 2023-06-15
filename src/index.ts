// The OpenAI client class
export { OpenAIClient } from './openai-client';

// Zod schemas
export {
  AssistantChatMessageSchema,
  AssistantContentChatMessageSchema,
  AssistantFunctionChatMessageSchema,
  ChatCompletionParamsSchema,
  ChatMessageFunctionCallSchema,
  ChatMessageFunctionSchema,
  ChatMessageRoleSchema,
  ChatMessageSchema,
  FunctionChatMessageSchema,
  SystemChatMessageSchema,
  UserChatMessageSchema,
} from './schemas/chat-completion';
export {
  BulkCompletionParamsSchema,
  CompletionParamsSchema,
} from './schemas/completion';
export {
  BulkEmbeddingParamsSchema,
  EmbeddingParamsSchema,
} from './schemas/embedding';
export { EditParamsSchema } from './schemas/edit';

// Custom OpenAI error
export { OpenAIApiError } from './errors';

// Types
export type {
  AssistantChatMessage,
  AssistantContentChatMessage,
  AssistantFunctionChatMessage,
  ChatCompletionParams,
  ChatCompletionResponse,
  ChatMessage,
  ChatMessageFunction,
  ChatMessageFunctionCall,
  ChatMessageRole,
  ChatResponseMessage,
  FunctionChatMessage,
  SystemChatMessage,
  UserChatMessage,
} from './schemas/chat-completion';
export type {
  BulkCompletionParams,
  CompletionParams,
  CompletionResponse,
} from './schemas/completion';
export type {
  BulkEmbeddingParams,
  EmbeddingParams,
  EmbeddingResponse,
} from './schemas/embedding';
export type { EditParams, EditResponse } from './schemas/edit';
export type { ConfigOpts } from './openai-client';
