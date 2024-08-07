import * as Core from '../core.js';
import { type CompletionUsage } from '../resources/completions.js';
import { type ChatCompletion, type ChatCompletionMessage, type ChatCompletionMessageParam, type ChatCompletionCreateParams } from '../resources/chat/completions.js';
import { type BaseFunctionsArgs } from "./RunnableFunction.js";
import { ChatCompletionFunctionRunnerParams, ChatCompletionToolRunnerParams } from "./ChatCompletionRunner.js";
import { ChatCompletionStreamingFunctionRunnerParams, ChatCompletionStreamingToolRunnerParams } from "./ChatCompletionStreamingRunner.js";
import { BaseEvents, EventStream } from "./EventStream.js";
import { ParsedChatCompletion } from "../resources/beta/chat/completions.js";
import OpenAI from "../index.js";
export interface RunnerOptions extends Core.RequestOptions {
    /** How many requests to make before canceling. Default 10. */
    maxChatCompletions?: number;
}
export declare class AbstractChatCompletionRunner<EventTypes extends AbstractChatCompletionRunnerEvents, ParsedT> extends EventStream<EventTypes> {
    #private;
    protected _chatCompletions: ParsedChatCompletion<ParsedT>[];
    messages: ChatCompletionMessageParam[];
    protected _addChatCompletion(this: AbstractChatCompletionRunner<AbstractChatCompletionRunnerEvents, ParsedT>, chatCompletion: ParsedChatCompletion<ParsedT>): ParsedChatCompletion<ParsedT>;
    protected _addMessage(this: AbstractChatCompletionRunner<AbstractChatCompletionRunnerEvents, ParsedT>, message: ChatCompletionMessageParam, emit?: boolean): void;
    /**
     * @returns a promise that resolves with the final ChatCompletion, or rejects
     * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
     */
    finalChatCompletion(): Promise<ParsedChatCompletion<ParsedT>>;
    /**
     * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
     * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
     */
    finalContent(): Promise<string | null>;
    /**
     * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
     * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
     */
    finalMessage(): Promise<ChatCompletionMessage>;
    /**
     * @returns a promise that resolves with the content of the final FunctionCall, or rejects
     * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
     */
    finalFunctionCall(): Promise<ChatCompletionMessage.FunctionCall | undefined>;
    finalFunctionCallResult(): Promise<string | undefined>;
    totalUsage(): Promise<CompletionUsage>;
    allChatCompletions(): ChatCompletion[];
    protected _emitFinal(this: AbstractChatCompletionRunner<AbstractChatCompletionRunnerEvents, ParsedT>): void;
    protected _createChatCompletion(client: OpenAI, params: ChatCompletionCreateParams, options?: Core.RequestOptions): Promise<ParsedChatCompletion<ParsedT>>;
    protected _runChatCompletion(client: OpenAI, params: ChatCompletionCreateParams, options?: Core.RequestOptions): Promise<ChatCompletion>;
    protected _runFunctions<FunctionsArgs extends BaseFunctionsArgs>(client: OpenAI, params: ChatCompletionFunctionRunnerParams<FunctionsArgs> | ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs>, options?: RunnerOptions): Promise<void>;
    protected _runTools<FunctionsArgs extends BaseFunctionsArgs>(client: OpenAI, params: ChatCompletionToolRunnerParams<FunctionsArgs> | ChatCompletionStreamingToolRunnerParams<FunctionsArgs>, options?: RunnerOptions): Promise<void>;
}
export interface AbstractChatCompletionRunnerEvents extends BaseEvents {
    functionCall: (functionCall: ChatCompletionMessage.FunctionCall) => void;
    message: (message: ChatCompletionMessageParam) => void;
    chatCompletion: (completion: ChatCompletion) => void;
    finalContent: (contentSnapshot: string) => void;
    finalMessage: (message: ChatCompletionMessageParam) => void;
    finalChatCompletion: (completion: ChatCompletion) => void;
    finalFunctionCall: (functionCall: ChatCompletionMessage.FunctionCall) => void;
    functionCallResult: (content: string) => void;
    finalFunctionCallResult: (content: string) => void;
    totalUsage: (usage: CompletionUsage) => void;
}
//# sourceMappingURL=AbstractChatCompletionRunner.d.ts.map