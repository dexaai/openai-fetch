import { type OpenAI } from '../openai-types/index.js';

export type ModerationParams = OpenAI.ModerationCreateParams;
export type ModerationResponse = OpenAI.ModerationCreateResponse;

export type SpeechParams = OpenAI.Audio.SpeechCreateParams;
export type SpeechResponse = ArrayBuffer;
