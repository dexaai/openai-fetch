import type {
  CreateCompletionRequest,
  CreateCompletionResponse,
  CreateEmbeddingRequest,
  CreateEmbeddingResponse,
} from 'openai';

export type CompletionParams = Omit<
  CreateCompletionRequest,
  'n' | 'stream' | 'prompt'
> & {
  prompt: string | string[];
};
export type CompletionParamsSingle = Omit<CompletionParams, 'prompt'> & {
  prompt: string;
};
export type CompletionParamsMulti = Omit<CompletionParams, 'prompt'> & {
  prompt: string[];
};
export type CompletionResponse = CreateCompletionResponse;
export type CompletionResponseSingle = {
  data: CompletionResponse;
  completion: string;
};
export type CompletionResponseMulti = {
  data: CompletionResponse;
  completions: string[];
};

export type EmbeddingRequest = CreateEmbeddingRequest;
export type EmbeddingParams = Omit<EmbeddingRequest, 'input'> & {
  dontRemoveNewlines?: boolean;
  input: string | string[];
};
export type EmbeddingParamsSingle = Omit<EmbeddingParams, 'input'> & {
  input: string;
};
export type EmbeddingParamsMulti = Omit<EmbeddingParams, 'input'> & {
  input: string[];
};
export type EmbeddingResponse = CreateEmbeddingResponse;
export type EmbeddingResponseSingle = {
  data: CreateEmbeddingResponse;
  embedding: number[];
};
export type EmbeddingResponseMulti = {
  data: CreateEmbeddingResponse;
  embeddings: number[][];
};
