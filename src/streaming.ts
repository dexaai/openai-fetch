import type { CompletionResponse } from './schemas/completion';

/**
 * Convenience type for brevity in declarations.
 */
type AugmentedCompletionResponse = {
  completion: string;
  response: CompletionResponse;
};

/**
 * A parser for the streaming responses from the OpenAI API.
 *
 * Conveniently shaped like an argument for WritableStream constructor.
 */
class OpenAIStreamParser {
  onchunk?: (chunk: AugmentedCompletionResponse) => void;
  onend?: () => void;

  /**
   * Takes the ReadableStream chunks, produced by `fetch` and turns them into
   * `CompletionResponse` objects.
   * @param chunk The chunk of data from the stream.
   */
  write(chunk: Uint8Array): void {
    const decoder = new TextDecoder();
    const s = decoder.decode(chunk);
    s.split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .forEach((line) => {
        const pos = line.indexOf(':');
        const name = line.substring(0, pos);
        if (name !== 'data') return;
        const content = line.substring(pos + 1).trim();
        if (content.length == 0) return;
        if (content === '[DONE]') {
          this.onend?.();
          return;
        }
        try {
          const parsed = JSON.parse(content);
          this.onchunk?.({
            completion: parsed.choices[0].text || '',
            response: parsed,
          });
        } catch (e) {
          console.error('Failed parsing streamed JSON chunk', e);
        }
      });
  }
}

/**
 * A transform stream that takes the streaming responses from the OpenAI API
 * and turns them into `AugmentedCompletionResponse` objects.
 */
export class StreamCompletionChunker
  implements TransformStream<Uint8Array, AugmentedCompletionResponse>
{
  writable: WritableStream<Uint8Array>;
  readable: ReadableStream<AugmentedCompletionResponse>;

  constructor() {
    const parser = new OpenAIStreamParser();
    this.writable = new WritableStream(parser);
    this.readable = new ReadableStream({
      start(controller) {
        parser.onchunk = (chunk: AugmentedCompletionResponse) =>
          controller.enqueue(chunk);
        parser.onend = () => controller.close();
      },
    });
  }
}
