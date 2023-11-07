import * as Core from '~/openai-types/core.js';
import { APIResource } from '~/openai-types/resource.js';
import { type Response } from '~/openai-types/_shims/index.js';
import * as SpeechAPI from '~/openai-types/resources/audio/speech.js';
export declare class Speech extends APIResource {
    /**
     * Generates audio from the input text.
     */
    create(body: SpeechCreateParams, options?: Core.RequestOptions): Core.APIPromise<Response>;
}
export interface SpeechCreateParams {
    /**
     * The text to generate audio for. The maximum length is 4096 characters.
     */
    input: string;
    /**
     * One of the available [TTS models](https://platform.openai.com/docs/models/tts):
     * `tts-1` or `tts-1-hd`
     */
    model: (string & {}) | 'tts-1' | 'tts-1-hd';
    /**
     * The voice to use when generating the audio. Supported voices are `alloy`,
     * `echo`, `fable`, `onyx`, `nova`, and `shimmer`.
     */
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    /**
     * The format to audio in. Supported formats are `mp3`, `opus`, `aac`, and `flac`.
     */
    response_format?: 'mp3' | 'opus' | 'aac' | 'flac';
    /**
     * The speed of the generated audio. Select a value from `0.25` to `4.0`. `1.0` is
     * the default.
     */
    speed?: number;
}
export declare namespace Speech {
    export import SpeechCreateParams = SpeechAPI.SpeechCreateParams;
}
//# sourceMappingURL=speech.d.ts.map