import * as Core from '../../../core.js';
import { APIResource } from '../../../resource.js';
import * as AssistantsAPI from '../../../resources/beta/assistants/assistants.js';
import * as FilesAPI from '../../../resources/beta/assistants/files.js';
import { CursorPage, type CursorPageParams } from '../../../pagination.js';
export declare class Assistants extends APIResource {
    files: FilesAPI.Files;
    /**
     * Create an assistant with a model and instructions.
     */
    create(body: AssistantCreateParams, options?: Core.RequestOptions): Core.APIPromise<Assistant>;
    /**
     * Retrieves an assistant.
     */
    retrieve(assistantId: string, options?: Core.RequestOptions): Core.APIPromise<Assistant>;
    /**
     * Modifies an assistant.
     */
    update(assistantId: string, body: AssistantUpdateParams, options?: Core.RequestOptions): Core.APIPromise<Assistant>;
    /**
     * Returns a list of assistants.
     */
    list(query?: AssistantListParams, options?: Core.RequestOptions): Core.PagePromise<AssistantsPage, Assistant>;
    list(options?: Core.RequestOptions): Core.PagePromise<AssistantsPage, Assistant>;
    /**
     * Delete an assistant.
     */
    del(assistantId: string, options?: Core.RequestOptions): Core.APIPromise<AsssitantDeleted>;
}
export declare class AssistantsPage extends CursorPage<Assistant> {
}
/**
 * Represents an `assistant` that can call the model and use tools.
 */
export interface Assistant {
    /**
     * The identifier, which can be referenced in API endpoints.
     */
    id: string;
    /**
     * The Unix timestamp (in seconds) for when the assistant was created.
     */
    created_at: number;
    /**
     * The description of the assistant. The maximum length is 512 characters.
     */
    description: string | null;
    /**
     * A list of [file](https://platform.openai.com/docs/api-reference/files) IDs
     * attached to this assistant. There can be a maximum of 20 files attached to the
     * assistant. Files are ordered by their creation date in ascending order.
     */
    file_ids: Array<string>;
    /**
     * The system instructions that the assistant uses. The maximum length is 32768
     * characters.
     */
    instructions: string | null;
    /**
     * Set of 16 key-value pairs that can be attached to an object. This can be useful
     * for storing additional information about the object in a structured format. Keys
     * can be a maximum of 64 characters long and values can be a maxium of 512
     * characters long.
     */
    metadata: unknown | null;
    /**
     * ID of the model to use. You can use the
     * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
     * see all of your available models, or see our
     * [Model overview](https://platform.openai.com/docs/models/overview) for
     * descriptions of them.
     */
    model: string;
    /**
     * The name of the assistant. The maximum length is 256 characters.
     */
    name: string | null;
    /**
     * The object type, which is always `assistant`.
     */
    object: 'assistant';
    /**
     * A list of tool enabled on the assistant. There can be a maximum of 128 tools per
     * assistant. Tools can be of types `code_interpreter`, `retrieval`, or `function`.
     */
    tools: Array<Assistant.CodeInterpreter | Assistant.Retrieval | Assistant.Function>;
}
export declare namespace Assistant {
    interface CodeInterpreter {
        /**
         * The type of tool being defined: `code_interpreter`
         */
        type: 'code_interpreter';
    }
    interface Retrieval {
        /**
         * The type of tool being defined: `retrieval`
         */
        type: 'retrieval';
    }
    interface Function {
        /**
         * The function definition.
         */
        function: Function.Function;
        /**
         * The type of tool being defined: `function`
         */
        type: 'function';
    }
    namespace Function {
        /**
         * The function definition.
         */
        interface Function {
            /**
             * A description of what the function does, used by the model to choose when and
             * how to call the function.
             */
            description: string;
            /**
             * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
             * underscores and dashes, with a maximum length of 64.
             */
            name: string;
            /**
             * The parameters the functions accepts, described as a JSON Schema object. See the
             * [guide](https://platform.openai.com/docs/guides/gpt/function-calling) for
             * examples, and the
             * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
             * documentation about the format.
             *
             * To describe a function that accepts no parameters, provide the value
             * `{"type": "object", "properties": {}}`.
             */
            parameters: Record<string, unknown>;
        }
    }
}
export interface AsssitantDeleted {
    id: string;
    deleted: boolean;
    object: 'assistant.deleted';
}
export interface AssistantCreateParams {
    /**
     * ID of the model to use. You can use the
     * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
     * see all of your available models, or see our
     * [Model overview](https://platform.openai.com/docs/models/overview) for
     * descriptions of them.
     */
    model: string;
    /**
     * The description of the assistant. The maximum length is 512 characters.
     */
    description?: string | null;
    /**
     * A list of [file](https://platform.openai.com/docs/api-reference/files) IDs
     * attached to this assistant. There can be a maximum of 20 files attached to the
     * assistant. Files are ordered by their creation date in ascending order.
     */
    file_ids?: Array<string>;
    /**
     * The system instructions that the assistant uses. The maximum length is 32768
     * characters.
     */
    instructions?: string | null;
    /**
     * Set of 16 key-value pairs that can be attached to an object. This can be useful
     * for storing additional information about the object in a structured format. Keys
     * can be a maximum of 64 characters long and values can be a maxium of 512
     * characters long.
     */
    metadata?: unknown | null;
    /**
     * The name of the assistant. The maximum length is 256 characters.
     */
    name?: string | null;
    /**
     * A list of tool enabled on the assistant. There can be a maximum of 128 tools per
     * assistant. Tools can be of types `code_interpreter`, `retrieval`, or `function`.
     */
    tools?: Array<AssistantCreateParams.AssistantToolsCode | AssistantCreateParams.AssistantToolsRetrieval | AssistantCreateParams.AssistantToolsFunction>;
}
export declare namespace AssistantCreateParams {
    interface AssistantToolsCode {
        /**
         * The type of tool being defined: `code_interpreter`
         */
        type: 'code_interpreter';
    }
    interface AssistantToolsRetrieval {
        /**
         * The type of tool being defined: `retrieval`
         */
        type: 'retrieval';
    }
    interface AssistantToolsFunction {
        /**
         * The function definition.
         */
        function: AssistantToolsFunction.Function;
        /**
         * The type of tool being defined: `function`
         */
        type: 'function';
    }
    namespace AssistantToolsFunction {
        /**
         * The function definition.
         */
        interface Function {
            /**
             * A description of what the function does, used by the model to choose when and
             * how to call the function.
             */
            description: string;
            /**
             * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
             * underscores and dashes, with a maximum length of 64.
             */
            name: string;
            /**
             * The parameters the functions accepts, described as a JSON Schema object. See the
             * [guide](https://platform.openai.com/docs/guides/gpt/function-calling) for
             * examples, and the
             * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
             * documentation about the format.
             *
             * To describe a function that accepts no parameters, provide the value
             * `{"type": "object", "properties": {}}`.
             */
            parameters: Record<string, unknown>;
        }
    }
}
export interface AssistantUpdateParams {
    /**
     * The description of the assistant. The maximum length is 512 characters.
     */
    description?: string | null;
    /**
     * A list of [File](https://platform.openai.com/docs/api-reference/files) IDs
     * attached to this assistant. There can be a maximum of 20 files attached to the
     * assistant. Files are ordered by their creation date in ascending order. If a
     * file was previosuly attached to the list but does not show up in the list, it
     * will be deleted from the assistant.
     */
    file_ids?: Array<string>;
    /**
     * The system instructions that the assistant uses. The maximum length is 32768
     * characters.
     */
    instructions?: string | null;
    /**
     * Set of 16 key-value pairs that can be attached to an object. This can be useful
     * for storing additional information about the object in a structured format. Keys
     * can be a maximum of 64 characters long and values can be a maxium of 512
     * characters long.
     */
    metadata?: unknown | null;
    /**
     * ID of the model to use. You can use the
     * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
     * see all of your available models, or see our
     * [Model overview](https://platform.openai.com/docs/models/overview) for
     * descriptions of them.
     */
    model?: string;
    /**
     * The name of the assistant. The maximum length is 256 characters.
     */
    name?: string | null;
    /**
     * A list of tool enabled on the assistant. There can be a maximum of 128 tools per
     * assistant. Tools can be of types `code_interpreter`, `retrieval`, or `function`.
     */
    tools?: Array<AssistantUpdateParams.AssistantToolsCode | AssistantUpdateParams.AssistantToolsRetrieval | AssistantUpdateParams.AssistantToolsFunction>;
}
export declare namespace AssistantUpdateParams {
    interface AssistantToolsCode {
        /**
         * The type of tool being defined: `code_interpreter`
         */
        type: 'code_interpreter';
    }
    interface AssistantToolsRetrieval {
        /**
         * The type of tool being defined: `retrieval`
         */
        type: 'retrieval';
    }
    interface AssistantToolsFunction {
        /**
         * The function definition.
         */
        function: AssistantToolsFunction.Function;
        /**
         * The type of tool being defined: `function`
         */
        type: 'function';
    }
    namespace AssistantToolsFunction {
        /**
         * The function definition.
         */
        interface Function {
            /**
             * A description of what the function does, used by the model to choose when and
             * how to call the function.
             */
            description: string;
            /**
             * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
             * underscores and dashes, with a maximum length of 64.
             */
            name: string;
            /**
             * The parameters the functions accepts, described as a JSON Schema object. See the
             * [guide](https://platform.openai.com/docs/guides/gpt/function-calling) for
             * examples, and the
             * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
             * documentation about the format.
             *
             * To describe a function that accepts no parameters, provide the value
             * `{"type": "object", "properties": {}}`.
             */
            parameters: Record<string, unknown>;
        }
    }
}
export interface AssistantListParams extends CursorPageParams {
    /**
     * A cursor for use in pagination. `before` is an object ID that defines your place
     * in the list. For instance, if you make a list request and receive 100 objects,
     * ending with obj_foo, your subsequent call can include before=obj_foo in order to
     * fetch the previous page of the list.
     */
    before?: string;
    /**
     * Sort order by the `created_at` timestamp of the objects. `asc` for ascending
     * order and `desc` for descending order.
     */
    order?: 'asc' | 'desc';
}
export declare namespace Assistants {
    export import Assistant = AssistantsAPI.Assistant;
    export import AsssitantDeleted = AssistantsAPI.AsssitantDeleted;
    export import AssistantsPage = AssistantsAPI.AssistantsPage;
    export import AssistantCreateParams = AssistantsAPI.AssistantCreateParams;
    export import AssistantUpdateParams = AssistantsAPI.AssistantUpdateParams;
    export import AssistantListParams = AssistantsAPI.AssistantListParams;
    export import Files = FilesAPI.Files;
    export import AssistantFile = FilesAPI.AssistantFile;
    export import FileDeleteResponse = FilesAPI.FileDeleteResponse;
    export import AssistantFilesPage = FilesAPI.AssistantFilesPage;
    export import FileCreateParams = FilesAPI.FileCreateParams;
    export import FileListParams = FilesAPI.FileListParams;
}
//# sourceMappingURL=assistants.d.ts.map