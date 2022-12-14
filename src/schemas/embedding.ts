import { z } from 'zod';

export const EmbeddingParams = z.object({
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them.
   */
  model: z.string(),
  /**
   * The string to embed.
   */
  input: z.string(),
  /**
   * A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse. [Learn more](/docs/usage-policies/end-user-ids).
   */
  user: z.string().optional(),
  /**
   * Opt out of automatic newline removal of the input string.
   */
  dontRemoveNewlines: z.boolean().optional(),
});

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
