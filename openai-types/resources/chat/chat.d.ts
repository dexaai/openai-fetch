import { APIResource } from 'openai/resource';
import * as CompletionsAPI from 'openai/resources/chat/completions';
export declare class Chat extends APIResource {
    completions: CompletionsAPI.Completions;
}
export declare namespace Chat {
    export import Completions = CompletionsAPI.Completions;
    export import ChatCompletion = CompletionsAPI.ChatCompletion;
    export import ChatCompletionChunk = CompletionsAPI.ChatCompletionChunk;
    export import ChatCompletionMessage = CompletionsAPI.ChatCompletionMessage;
    export import ChatCompletionMessageParam = CompletionsAPI.ChatCompletionMessageParam;
    export import ChatCompletionRole = CompletionsAPI.ChatCompletionRole;
    /**
     * @deprecated ChatCompletionMessageParam should be used instead
     */
    export import CreateChatCompletionRequestMessage = CompletionsAPI.CreateChatCompletionRequestMessage;
    export import ChatCompletionCreateParams = CompletionsAPI.ChatCompletionCreateParams;
    export import CompletionCreateParams = CompletionsAPI.CompletionCreateParams;
    export import ChatCompletionCreateParamsNonStreaming = CompletionsAPI.ChatCompletionCreateParamsNonStreaming;
    export import CompletionCreateParamsNonStreaming = CompletionsAPI.CompletionCreateParamsNonStreaming;
    export import ChatCompletionCreateParamsStreaming = CompletionsAPI.ChatCompletionCreateParamsStreaming;
    export import CompletionCreateParamsStreaming = CompletionsAPI.CompletionCreateParamsStreaming;
}
//# sourceMappingURL=chat.d.ts.map