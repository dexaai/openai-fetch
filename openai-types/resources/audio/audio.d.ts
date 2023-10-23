import { APIResource } from 'openai/resource';
import * as TranscriptionsAPI from 'openai/resources/audio/transcriptions';
import * as TranslationsAPI from 'openai/resources/audio/translations';
export declare class Audio extends APIResource {
    transcriptions: TranscriptionsAPI.Transcriptions;
    translations: TranslationsAPI.Translations;
}
export declare namespace Audio {
    export import Transcriptions = TranscriptionsAPI.Transcriptions;
    export import Transcription = TranscriptionsAPI.Transcription;
    export import TranscriptionCreateParams = TranscriptionsAPI.TranscriptionCreateParams;
    export import Translations = TranslationsAPI.Translations;
    export import Translation = TranslationsAPI.Translation;
    export import TranslationCreateParams = TranslationsAPI.TranslationCreateParams;
}
//# sourceMappingURL=audio.d.ts.map