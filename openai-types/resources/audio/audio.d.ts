import { APIResource } from '~/openai-types/resource.js';
import * as SpeechAPI from '~/openai-types/resources/audio/speech.js';
import * as TranscriptionsAPI from '~/openai-types/resources/audio/transcriptions.js';
import * as TranslationsAPI from '~/openai-types/resources/audio/translations.js';
export declare class Audio extends APIResource {
    transcriptions: TranscriptionsAPI.Transcriptions;
    translations: TranslationsAPI.Translations;
    speech: SpeechAPI.Speech;
}
export declare namespace Audio {
    export import Transcriptions = TranscriptionsAPI.Transcriptions;
    export import Transcription = TranscriptionsAPI.Transcription;
    export import TranscriptionCreateParams = TranscriptionsAPI.TranscriptionCreateParams;
    export import Translations = TranslationsAPI.Translations;
    export import Translation = TranslationsAPI.Translation;
    export import TranslationCreateParams = TranslationsAPI.TranslationCreateParams;
    export import Speech = SpeechAPI.Speech;
    export import SpeechCreateParams = SpeechAPI.SpeechCreateParams;
}
//# sourceMappingURL=audio.d.ts.map