import { z } from 'zod';

const EmbeddingModel = z.union([
  z.literal('text-embedding-ada-002'),
  z.literal('text-similarity-ada-001'),
  z.literal('text-similarity-babbage-001'),
  z.literal('text-similarity-curie-001'),
  z.literal('text-similarity-davinci-001'),
  z.literal('text-search-ada-doc-001'),
  z.literal('text-search-ada-query-001'),
  z.literal('text-search-babbage-doc-001'),
  z.literal('text-search-babbage-query-001'),
  z.literal('text-search-curie-doc-001'),
  z.literal('text-search-curie-query-001'),
  z.literal('text-search-davinci-doc-001'),
  z.literal('text-search-davinci-query-001'),
  z.literal('code-search-ada-code-001'),
  z.literal('code-search-ada-text-001'),
  z.literal('code-search-babbage-code-001'),
  z.literal('code-search-babbage-text-001'),
  z.string(),
]);

export const EmbeddingParamsSchema = z.object({
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them.
   */
  model: EmbeddingModel,
  /**
   * The string to embed.
   */
  input: z.string(),
  /**
   * A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse. [Learn more](/docs/usage-policies/end-user-ids).
   */
  user: z.string().optional(),
});

export type EmbeddingParams = z.input<typeof EmbeddingParamsSchema>;

export const BulkEmbeddingParamsSchema = z.object({
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them.
   */
  model: EmbeddingModel,
  /**
   * The strings to embed.
   */
  input: z.array(z.string()),
  /**
   * A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse. [Learn more](/docs/usage-policies/end-user-ids).
   */
  user: z.string().optional(),
});

export type BulkEmbeddingParams = z.input<typeof BulkEmbeddingParamsSchema>;

export type EmbeddingResponse = {
  data: {
    embedding: number[];
    index: number;
    object: string;
  }[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
  object: string;
  model: string;
};
