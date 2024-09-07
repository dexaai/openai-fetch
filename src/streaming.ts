/** A function that converts from raw Completion response from OpenAI
 * into a nicer object which includes the first choice in response from OpenAI.
 */
type ResponseFactory<Raw, Nice> = (response: Raw) => Nice;

/**
 * A parser for the streaming responses from the OpenAI API.
 *
 * Conveniently shaped like an argument for WritableStream constructor.
 */
class OpenAIStreamParser<Raw, Nice> {
  private responseFactory: ResponseFactory<Raw, Nice>;
  onchunk?: (chunk: Nice) => void;
  onend?: () => void;
  buffer: string;

  constructor(responseFactory: ResponseFactory<Raw, Nice>) {
    this.responseFactory = responseFactory;
    this.buffer = '';
  }

  /**
   * Takes the ReadableStream chunks, produced by `fetch` and turns them into
   * `CompletionResponse` objects.
   * @param chunk The chunk of data from the stream.
   */
  write(chunk: Uint8Array): void {
    const decoder = new TextDecoder();
    const s = decoder.decode(chunk);
    let parts = s.split('\n');

    // Buffer incomplete line.
    if (parts.length === 1) {
      this.buffer += parts[0];
      return;
    }

    // Prepend the buffer to the first part.
    if (this.buffer.length > 0) {
      parts[0] = this.buffer + parts[0];
      this.buffer = '';
    }

    // If the last part isn't an empty string, then we need to buffer it.
    const last = parts[parts.length - 1];
    if (last && last.length > 0) {
      this.buffer = parts.pop()!;
    }

    parts
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .forEach((line) => {
        const pos = line.indexOf(':');
        const name = line.substring(0, pos);
        if (name !== 'data') return;
        const content = line.substring(pos + 1).trim();
        if (content.length === 0) return;
        if (content === '[DONE]') {
          this.onend?.();
          return;
        }
        try {
          const parsed = JSON.parse(content);
          this.onchunk?.(this.responseFactory(parsed));
        } catch (e) {
          console.error('Failed parsing streamed JSON chunk', e, content, line);
        }
      });
  }
}

/**
 * A parser for the streaming responses from the OpenAI API.
 *
 * Conveniently shaped like an argument for WritableStream constructor.
 */
class AnthropicStreamParser<Raw, Nice> {
  private responseFactory: ResponseFactory<Raw, Nice>;
  onchunk?: (chunk: Nice) => void;
  onend?: () => void;
  buffer: string;

  constructor(responseFactory: ResponseFactory<Raw, Nice>) {
    this.responseFactory = responseFactory;
    this.buffer = '';
  }

  /**
   * Takes the ReadableStream chunks, produced by `fetch` and turns them into
   * `CompletionResponse` objects.
   * @param chunk The chunk of data from the stream.
   */
  write(chunk: Uint8Array): void {
    const decoder = new TextDecoder();
    const s = decoder.decode(chunk);
    let parts = s.split('\n\n');

     // Handle buffering
    if (this.buffer) {
      parts[0] = this.buffer + parts[0];
      this.buffer = '';
    }
    if (!s.endsWith('\n\n')) {
      this.buffer = parts.pop() || '';
    }

    parts.forEach((part) => {
      const lines = part.split('\n');
      const eventType = lines[0]?.substring(7); // Remove "event: "
      const data = JSON.parse(lines[1]?.substring(6) || '{}'); // Remove "data: " and parse JSON

      if (eventType === 'content_block_delta' && data.delta.type === 'text_delta') {
        try {
          const niceChunk = this.responseFactory(data.delta as Raw);
          this.onchunk?.(niceChunk);
        } catch (error) {
          console.error('Error processing chunk:', error);
        }
      } else if (eventType === 'message_stop') {
        this.onend?.();
      }
    });
  }
}

/**
 * A transform stream that takes the streaming responses from the OpenAI API
 * and turns them into useful response objects.
 */
export class StreamCompletionChunker<Raw, Nice>
  implements TransformStream<Uint8Array, Nice>
{
  writable: WritableStream<Uint8Array>;
  readable: ReadableStream<Nice>;

  constructor(responseFactory: ResponseFactory<Raw, Nice>, parserType: 'openai' | 'anthropic' = 'openai') {
    const parser = parserType === 'openai' ? new OpenAIStreamParser(responseFactory) : new AnthropicStreamParser(responseFactory);
    this.writable = new WritableStream(parser);
    this.readable = new ReadableStream({
      start(controller) {
        parser.onchunk = (chunk: Nice) => controller.enqueue(chunk);
        parser.onend = () => controller.close();
      },
    });
  }
}