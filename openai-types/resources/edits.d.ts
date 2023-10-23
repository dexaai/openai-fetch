import * as Core from 'openai/core';
import { APIResource } from 'openai/resource';
import * as EditsAPI from 'openai/resources/edits';
import * as CompletionsAPI from 'openai/resources/completions';
export declare class Edits extends APIResource {
    /**
     * Creates a new edit for the provided input, instruction, and parameters.
     *
     * @deprecated The Edits API is deprecated; please use Chat Completions instead.
     *
     * https://openai.com/blog/gpt-4-api-general-availability#deprecation-of-the-edits-api
     */
    create(body: EditCreateParams, options?: Core.RequestOptions): Core.APIPromise<Edit>;
}
export interface Edit {
    /**
     * A list of edit choices. Can be more than one if `n` is greater than 1.
     */
    choices: Array<Edit.Choice>;
    /**
     * The Unix timestamp (in seconds) of when the edit was created.
     */
    created: number;
    /**
     * The object type, which is always `edit`.
     */
    object: string;
    /**
     * Usage statistics for the completion request.
     */
    usage: CompletionsAPI.CompletionUsage;
}
export declare namespace Edit {
    interface Choice {
        /**
         * The reason the model stopped generating tokens. This will be `stop` if the model
         * hit a natural stop point or a provided stop sequence, `length` if the maximum
         * number of tokens specified in the request was reached, or `content_filter` if
         * content was omitted due to a flag from our content filters.
         */
        finish_reason: 'stop' | 'length';
        /**
         * The index of the choice in the list of choices.
         */
        index: number;
        /**
         * The edited result.
         */
        text: string;
    }
}
export interface EditCreateParams {
    /**
     * The instruction that tells the model how to edit the prompt.
     */
    instruction: string;
    /**
     * ID of the model to use. You can use the `text-davinci-edit-001` or
     * `code-davinci-edit-001` model with this endpoint.
     */
    model: (string & {}) | 'text-davinci-edit-001' | 'code-davinci-edit-001';
    /**
     * The input text to use as a starting point for the edit.
     */
    input?: string | null;
    /**
     * How many edits to generate for the input and instruction.
     */
    n?: number | null;
    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
     * make the output more random, while lower values like 0.2 will make it more
     * focused and deterministic.
     *
     * We generally recommend altering this or `top_p` but not both.
     */
    temperature?: number | null;
    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the
     * model considers the results of the tokens with top_p probability mass. So 0.1
     * means only the tokens comprising the top 10% probability mass are considered.
     *
     * We generally recommend altering this or `temperature` but not both.
     */
    top_p?: number | null;
}
export declare namespace Edits {
    export import Edit = EditsAPI.Edit;
    export import EditCreateParams = EditsAPI.EditCreateParams;
}
//# sourceMappingURL=edits.d.ts.map