import * as Core from "./core.js";
import * as Pagination from "./pagination.js";
import * as Errors from "./error.js";
import { type Agent } from "./_shims/index.js";
import * as Uploads from "./uploads.js";
import * as API from '~/openai-types/resources/index.js';
export interface ClientOptions {
    /**
     * Defaults to process.env['OPENAI_API_KEY'].
     */
    apiKey?: string;
    /**
     * Defaults to process.env['OPENAI_ORG_ID'].
     */
    organization?: string | null;
    /**
     * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
     */
    baseURL?: string;
    /**
     * The maximum amount of time (in milliseconds) that the client should wait for a response
     * from the server before timing out a single request.
     *
     * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
     * much longer than this timeout before the promise succeeds or fails.
     */
    timeout?: number;
    /**
     * An HTTP agent used to manage HTTP(S) connections.
     *
     * If not provided, an agent will be constructed by default in the Node.js environment,
     * otherwise no agent is used.
     */
    httpAgent?: Agent;
    /**
     * Specify a custom `fetch` function implementation.
     *
     * If not provided, we use `node-fetch` on Node.js and otherwise expect that `fetch` is
     * defined globally.
     */
    fetch?: Core.Fetch | undefined;
    /**
     * The maximum number of times that the client will retry a request in case of a
     * temporary failure, like a network error or a 5XX error from the server.
     *
     * @default 2
     */
    maxRetries?: number;
    /**
     * Default headers to include with every request to the API.
     *
     * These can be removed in individual requests by explicitly setting the
     * header to `undefined` or `null` in request options.
     */
    defaultHeaders?: Core.Headers;
    /**
     * Default query parameters to include with every request to the API.
     *
     * These can be removed in individual requests by explicitly setting the
     * param to `undefined` in request options.
     */
    defaultQuery?: Core.DefaultQuery;
    /**
     * By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
     * Only set this option to `true` if you understand the risks and have appropriate mitigations in place.
     */
    dangerouslyAllowBrowser?: boolean;
}
/** API Client for interfacing with the OpenAI API. */
export declare class OpenAI extends Core.APIClient {
    apiKey: string;
    organization: string | null;
    private _options;
    /**
     * API Client for interfacing with the OpenAI API.
     *
     * @param {string} [opts.apiKey==process.env['OPENAI_API_KEY'] ?? undefined]
     * @param {string | null} [opts.organization==process.env['OPENAI_ORG_ID'] ?? null]
     * @param {string} [opts.baseURL] - Override the default base URL for the API.
     * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
     * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
     * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
     * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
     * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
     * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
     * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
     */
    constructor({ apiKey, organization, ...opts }?: ClientOptions);
    completions: API.Completions;
    chat: API.Chat;
    edits: API.Edits;
    embeddings: API.Embeddings;
    files: API.Files;
    images: API.Images;
    audio: API.Audio;
    moderations: API.Moderations;
    models: API.Models;
    fineTuning: API.FineTuning;
    fineTunes: API.FineTunes;
    beta: API.Beta;
    protected defaultQuery(): Core.DefaultQuery | undefined;
    protected defaultHeaders(opts: Core.FinalRequestOptions): Core.Headers;
    protected authHeaders(opts: Core.FinalRequestOptions): Core.Headers;
    static OpenAI: typeof OpenAI;
    static OpenAIError: typeof Errors.OpenAIError;
    static APIError: typeof Errors.APIError;
    static APIConnectionError: typeof Errors.APIConnectionError;
    static APIConnectionTimeoutError: typeof Errors.APIConnectionTimeoutError;
    static APIUserAbortError: typeof Errors.APIUserAbortError;
    static NotFoundError: typeof Errors.NotFoundError;
    static ConflictError: typeof Errors.ConflictError;
    static RateLimitError: typeof Errors.RateLimitError;
    static BadRequestError: typeof Errors.BadRequestError;
    static AuthenticationError: typeof Errors.AuthenticationError;
    static InternalServerError: typeof Errors.InternalServerError;
    static PermissionDeniedError: typeof Errors.PermissionDeniedError;
    static UnprocessableEntityError: typeof Errors.UnprocessableEntityError;
}
export declare const OpenAIError: typeof Errors.OpenAIError, APIError: typeof Errors.APIError, APIConnectionError: typeof Errors.APIConnectionError, APIConnectionTimeoutError: typeof Errors.APIConnectionTimeoutError, APIUserAbortError: typeof Errors.APIUserAbortError, NotFoundError: typeof Errors.NotFoundError, ConflictError: typeof Errors.ConflictError, RateLimitError: typeof Errors.RateLimitError, BadRequestError: typeof Errors.BadRequestError, AuthenticationError: typeof Errors.AuthenticationError, InternalServerError: typeof Errors.InternalServerError, PermissionDeniedError: typeof Errors.PermissionDeniedError, UnprocessableEntityError: typeof Errors.UnprocessableEntityError;
export import toFile = Uploads.toFile;
export import fileFromPath = Uploads.fileFromPath;
export declare namespace OpenAI {
    export import toFile = Uploads.toFile;
    export import fileFromPath = Uploads.fileFromPath;
    export import RequestOptions = Core.RequestOptions;
    export import Page = Pagination.Page;
    export import PageResponse = Pagination.PageResponse;
    export import CursorPage = Pagination.CursorPage;
    export import CursorPageParams = Pagination.CursorPageParams;
    export import CursorPageResponse = Pagination.CursorPageResponse;
    export import Completions = API.Completions;
    export import Completion = API.Completion;
    export import CompletionChoice = API.CompletionChoice;
    export import CompletionUsage = API.CompletionUsage;
    export import CompletionCreateParams = API.CompletionCreateParams;
    export import CompletionCreateParamsNonStreaming = API.CompletionCreateParamsNonStreaming;
    export import CompletionCreateParamsStreaming = API.CompletionCreateParamsStreaming;
    export import Chat = API.Chat;
    export import ChatCompletion = API.ChatCompletion;
    export import ChatCompletionAssistantMessageParam = API.ChatCompletionAssistantMessageParam;
    export import ChatCompletionChunk = API.ChatCompletionChunk;
    export import ChatCompletionContentPart = API.ChatCompletionContentPart;
    export import ChatCompletionContentPartImage = API.ChatCompletionContentPartImage;
    export import ChatCompletionContentPartText = API.ChatCompletionContentPartText;
    export import ChatCompletionFunctionCallOption = API.ChatCompletionFunctionCallOption;
    export import ChatCompletionFunctionMessageParam = API.ChatCompletionFunctionMessageParam;
    export import ChatCompletionMessage = API.ChatCompletionMessage;
    export import ChatCompletionMessageParam = API.ChatCompletionMessageParam;
    export import ChatCompletionMessageToolCall = API.ChatCompletionMessageToolCall;
    export import ChatCompletionNamedToolChoice = API.ChatCompletionNamedToolChoice;
    export import ChatCompletionRole = API.ChatCompletionRole;
    export import ChatCompletionSystemMessageParam = API.ChatCompletionSystemMessageParam;
    export import ChatCompletionTool = API.ChatCompletionTool;
    export import ChatCompletionToolChoiceOption = API.ChatCompletionToolChoiceOption;
    export import ChatCompletionToolMessageParam = API.ChatCompletionToolMessageParam;
    export import ChatCompletionUserMessageParam = API.ChatCompletionUserMessageParam;
    export import ChatCompletionCreateParams = API.ChatCompletionCreateParams;
    export import ChatCompletionCreateParamsNonStreaming = API.ChatCompletionCreateParamsNonStreaming;
    export import ChatCompletionCreateParamsStreaming = API.ChatCompletionCreateParamsStreaming;
    export import Edits = API.Edits;
    export import Edit = API.Edit;
    export import EditCreateParams = API.EditCreateParams;
    export import Embeddings = API.Embeddings;
    export import CreateEmbeddingResponse = API.CreateEmbeddingResponse;
    export import Embedding = API.Embedding;
    export import EmbeddingCreateParams = API.EmbeddingCreateParams;
    export import Files = API.Files;
    export import FileContent = API.FileContent;
    export import FileDeleted = API.FileDeleted;
    export import FileObject = API.FileObject;
    export import FileObjectsPage = API.FileObjectsPage;
    export import FileCreateParams = API.FileCreateParams;
    export import FileListParams = API.FileListParams;
    export import Images = API.Images;
    export import Image = API.Image;
    export import ImagesResponse = API.ImagesResponse;
    export import ImageCreateVariationParams = API.ImageCreateVariationParams;
    export import ImageEditParams = API.ImageEditParams;
    export import ImageGenerateParams = API.ImageGenerateParams;
    export import Audio = API.Audio;
    export import Moderations = API.Moderations;
    export import Moderation = API.Moderation;
    export import ModerationCreateResponse = API.ModerationCreateResponse;
    export import ModerationCreateParams = API.ModerationCreateParams;
    export import Models = API.Models;
    export import Model = API.Model;
    export import ModelDeleted = API.ModelDeleted;
    export import ModelsPage = API.ModelsPage;
    export import FineTuning = API.FineTuning;
    export import FineTunes = API.FineTunes;
    export import FineTune = API.FineTune;
    export import FineTuneEvent = API.FineTuneEvent;
    export import FineTuneEventsListResponse = API.FineTuneEventsListResponse;
    export import FineTunesPage = API.FineTunesPage;
    export import FineTuneCreateParams = API.FineTuneCreateParams;
    export import FineTuneListEventsParams = API.FineTuneListEventsParams;
    export import FineTuneListEventsParamsNonStreaming = API.FineTuneListEventsParamsNonStreaming;
    export import FineTuneListEventsParamsStreaming = API.FineTuneListEventsParamsStreaming;
    export import Beta = API.Beta;
}
export default OpenAI;
//# sourceMappingURL=index.d.ts.map