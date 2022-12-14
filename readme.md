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

### Create Completion

```ts
client.createCompletion(params: CompletionParams): Promise<{
  /** The completion string. */
  completion: string;
  /** The raw response from the API. */
  response: CompletionResponse;
}>
```

See: [OpenAI docs](https://beta.openai.com/docs/api-reference/completions) | [source code](/src/openai-client.ts)

### Create Embedding

```ts
client.createEmbedding(params: EmbeddingParams): Promise<{
  /** The embedding for the input string. */
  embedding: number[];
  /** The raw response from the API. */
  response: EmbeddingResponse;
}>
```

See: [OpenAI docs](https://beta.openai.com/docs/api-reference/embeddings) | [source code](/src/openai-client.ts)

### Create Edit

```ts
client.createEdit(params: EditParams): Promise<{
  /** The edited input string. */
  completion: string;
  /** The raw response from the API. */
  response: EditResponse;
}>
```

See: [OpenAI docs](https://beta.openai.com/docs/api-reference/edits) | [source code](/src/openai-client.ts)
