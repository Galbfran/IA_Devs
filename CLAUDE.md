# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`dev-assistant` is an intelligent technical documentation assistant built as a course project. It combines RAG (Retrieval-Augmented Generation), function calling, and the Claude + OpenAI APIs. The project is TypeScript-first, uses Bun as the runtime, and is structured around three main capabilities:

- **Interactive chat** (`src/index.ts`) — CLI-based assistant with conversation history
- **RAG pipeline** (`src/rag/ingest.ts`) — document ingestion and embedding for context retrieval
- **Autonomous agent** (`src/agent/demo.ts`) — tool-calling agent demo
- **Code reviewer** (`src/exercises/code-reviewer.ts`) — exercise using Claude to review code

## Commands

```sh
bun src/index.ts          # run the interactive assistant
bun src/rag/ingest.ts     # ingest documents into the RAG index
bun src/agent/demo.ts     # run the autonomous agent demo
bun src/exercises/code-reviewer.ts  # run the code reviewer exercise
bun typecheck             # run tsc --noEmit type checking
```

> The `package.json` scripts use `tsx` but prefer calling files directly with `bun` to stay consistent with the Bun-first approach.

## Environment variables

Bun auto-loads `.env` — no `dotenv` import needed in new files. Required keys:

- `ANTHROPIC_API_KEY` — for `@anthropic-ai/sdk`
- `OPENAI_API_KEY` — for embeddings via `openai` SDK (RAG pipeline)

## Bun-first rules

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of jest or vitest
- Use `bun install` / `bunx` instead of npm/yarn/pnpm equivalents
- `Bun.serve()` for HTTP/WebSockets — not express
- `bun:sqlite` for SQLite, `Bun.redis` for Redis, `Bun.sql` for Postgres
- `Bun.file` over `node:fs` readFile/writeFile
- Bun.$\`cmd\` instead of execa

## Architecture notes

The `@anthropic-ai/sdk` is used for chat completions and tool/function calling with Claude models. The `openai` SDK is used for embeddings (e.g. `text-embedding-3-small`) to power the RAG retrieval step — not for chat.

TypeScript is strict (`noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`). All source lives under `src/`, compiled output goes to `dist/`.
