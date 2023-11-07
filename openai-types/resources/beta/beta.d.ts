import { APIResource } from '../../resource.js';
import * as AssistantsAPI from '../../resources/beta/assistants/assistants.js';
import * as ChatAPI from '../../resources/beta/chat/chat.js';
import * as ThreadsAPI from '../../resources/beta/threads/threads.js';
export declare class Beta extends APIResource {
    chat: ChatAPI.Chat;
    assistants: AssistantsAPI.Assistants;
    threads: ThreadsAPI.Threads;
}
export declare namespace Beta {
    export import Chat = ChatAPI.Chat;
    export import Assistants = AssistantsAPI.Assistants;
    export import Assistant = AssistantsAPI.Assistant;
    export import AsssitantDeleted = AssistantsAPI.AsssitantDeleted;
    export import AssistantsPage = AssistantsAPI.AssistantsPage;
    export import AssistantCreateParams = AssistantsAPI.AssistantCreateParams;
    export import AssistantUpdateParams = AssistantsAPI.AssistantUpdateParams;
    export import AssistantListParams = AssistantsAPI.AssistantListParams;
    export import Threads = ThreadsAPI.Threads;
    export import Thread = ThreadsAPI.Thread;
    export import ThreadDeleted = ThreadsAPI.ThreadDeleted;
    export import ThreadCreateParams = ThreadsAPI.ThreadCreateParams;
    export import ThreadUpdateParams = ThreadsAPI.ThreadUpdateParams;
    export import ThreadCreateAndRunParams = ThreadsAPI.ThreadCreateAndRunParams;
}
//# sourceMappingURL=beta.d.ts.map