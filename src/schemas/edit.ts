import { z } from 'zod';
import type {
  CompletionResponseChoices,
  CompletionResponseUsage,
} from './completion';

export const EditParamsSchema = z.object({
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them.
   */
  model: z.string(),
  /**
   * The input text to use as a starting point for the edit.
   */
  input: z.string(),
  /**
   * The instruction that tells the model how to edit the prompt.
   */
  instruction: z.string(),
  /**
   * What [sampling temperature](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277) to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.  We generally recommend altering this or `top_p` but not both.
   */
  temperature: z.number().nullish(),
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  We generally recommend altering this or `temperature` but not both.
   */
  top_p: z.number().nullish(),
  /**
   * NOT SUPPORTED
   */
  /**
   * How many completions to generate for each prompt.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
   */
  // 'n'?: number | null;
});

export type EditParams = z.input<typeof EditParamsSchema>;

export type EditResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: CompletionResponseChoices;
  usage?: CompletionResponseUsage;
};
