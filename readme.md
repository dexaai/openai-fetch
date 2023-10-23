# OpenAI Fetch Client

[![Build Status](https://github.com/rileytomasek/openai-fetch/actions/workflows/main.yml/badge.svg)](https://github.com/rileytomasek/openai-fetch/actions/workflows/main.yml) [![npm version](https://img.shields.io/npm/v/openai-fetch.svg?color=0c0)](https://www.npmjs.com/package/openai-fetch)

A minimal and opinionated OpenAI client powered by fetch.

Unfortunately, the official [openai-node](https://github.com/openai/openai-node) package patches fetch in problematic ways and is quite bloated.

### Reasons to consider using `openai-fetch`:

- You want a fast and small client that doesn't patch fetch
- Supports all envs with native fetch: Node 18+, browsers, Deno, Cloudflare Workers, etc
- Package size: `openai-fetch` is [~13kb](https://bundlephobia.com/package/openai-fetch) and `openai` is [~47kb](https://bundlephobia.com/package/openai-node)
- You only need the chat, completions, and embeddings

### Use `openai-node` if you need:

- Your runtime doesn't have native fetch support
- Your app can't handle native ESM code
- Endpoints other than chat, completions, and embeddings
- Aren't concerned with lib size or fetch patching

## Usage

**Warning:** This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and no longer provides a CommonJS export. If your project uses CommonJS, you will have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function. Please don't open issues for questions regarding CommonJS / ESM.

Install `openai-fetch` with your favorite package manager and create an instance of the `OpenAIClient` class.

```ts
import { OpenAIClient } from 'openai-fetch';

const client = new OpenAIClient({ apiKey: '<your api key>' });
```

The `apiKey` is optional and will be read from `process.env.OPENAI_API_KEY` if present.

## API

The API follows OpenAI very closely, so their [reference documentation](https://beta.openai.com/docs/api-reference) can generally be used. Everything is strongly typed, so you will know if anything is different as soon as TypeScript parses your code.

```ts
// Generate a single chat completion
client.createChatCompletion(params: ChatParams): Promise<ChatResponse>;

// Stream a single completion via a ReadableStream
client.streamChatCompletion(params: ChatStreamParams): Promise<ChatStreamResponse>;

// Generate one or more completions
client.createCompletions(params: CompletionParams): Promise<CompletionResponse>;

// Stream a single completion via a ReadableStream
client.streamCompletion(params: CompletionStreamParams): Promise<CompletionStreamResponse>;

// Generate one or more embeddings
client.createEmbeddings(params: EmbeddingParams): Promise<EmbeddingResponse>
```

### Type Definitions

The type definitions are avaible through TSServer, and can be found here: [type definitions](/src/types.ts).
