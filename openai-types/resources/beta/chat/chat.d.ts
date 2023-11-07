import { APIResource } from '~/openai-types/resource.js';
import * as CompletionsAPI from '~/openai-types/resources/beta/chat/completions.js';
export declare class Chat extends APIResource {
    completions: CompletionsAPI.Completions;
}
export declare namespace Chat {
    export import Completions = CompletionsAPI.Completions;
}
//# sourceMappingURL=chat.d.ts.map