# OpenAI Fetch Client

[![Build Status](https://github.com/rileytomasek/openai-fetch/actions/workflows/main.yml/badge.svg)](https://github.com/rileytomasek/openai-fetch/actions/workflows/main.yml) [![npm version](https://img.shields.io/npm/v/openai-fetch.svg?color=0c0)](https://www.npmjs.com/package/openai-fetch)

A minimal and opinionated OpenAI client powered by fetch.

Unfortunately, the official [openai-node](https://github.com/openai/openai-node) uses Axios, which only supports Node and is bloated.

### Reasons to consider using `openai-fetch`:

- Supports all envs with native fetch: Node 18+, browsers, Deno, Cloudflare Workers, etc
- Package size: `openai-fetch` is [~5kb](https://bundlephobia.com/package/openai-fetch) and `openai-node` is [~180kb](https://bundlephobia.com/package/openai-node)
- `openai-fetch` includes the first choice in the response (no repetitive: `response.choices[0.text]`)
- You only need the completions, edits, and embeddings endpoints

### Use `openai-node` if you need:

- Endpoints other than completions, edits, and embeddings
- Streaming response support (this may be added later)
- Responses to contain more than one choice (no `n` support)
- To use tokens instead of strings for input

## Usage

Install `openai-fetch` with your favorite package manager and create an instance of the `OpenAIClient` class.

```ts
import { OpenAIClient } from 'openai-fetch';

const client = new OpenAIClient({ apiKey: '<your api key>' });
```

The `apiKey` is optional and will be read from `process.env.OPENAI_API_KEY` if present.

## API

The API follows OpenAI very closely, so their [reference documentation](https://beta.openai.com/docs/api-reference) can generally be used. Everything is strongly typed, so you will know if anything is different as soon as TypeScript parses your code.

### Create Completion

See: [OpenAI docs](https://beta.openai.com/docs/api-reference/completions) | [Type definitions](/src/schemas/completion.ts)

```ts
client.createCompletion(params: CompletionParams): Promise<{
  /** The completion string. */
  completion: string;
  /** The raw response from the API. */
  response: CompletionResponse;
}>
```

To get a streaming response, use the `streamCompletion` method.

```ts
client.streamCompletion(params: CompletionParams): Promise<
    ReadableStream<{
      /** The completion string. */
      completion: string;
      /** The raw response from the API. */
      response: CompletionResponse;
    }>
  >
```

### Create Chat Completion

See: [OpenAI docs](https://beta.openai.com/docs/api-reference/chat) | [Type definitions](/src/schemas/chat-completion.ts)

```ts
client.createChatCompletion(params: ChatCompletionParams): Promise<{
  /** The completion message. */
  message: ChatResponseMessage;
  /** The raw response from the API. */
  response: ChatCompletionResponse;
}>
```

### Create Embedding

See: [OpenAI docs](https://beta.openai.com/docs/api-reference/embeddings) | [Type definitions](/src/schemas/embedding.ts)

```ts
client.createEmbedding(params: EmbeddingParams): Promise<{
  /** The embedding for the input string. */
  embedding: number[];
  /** The raw response from the API. */
  response: EmbeddingResponse;
}>
```

### Create Edit

See: [OpenAI docs](https://beta.openai.com/docs/api-reference/edits) | [Type definitions](/src/schemas/edit.ts)

```ts
client.createEdit(params: EditParams): Promise<{
  /** The edited input string. */
  completion: string;
  /** The raw response from the API. */
  response: EditResponse;
}>
```
