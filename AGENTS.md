# AGENTS.md — for AI coding agents working with Human For AI

This repo is the **npm package `humanforai`** — the MCP client/proxy for
[Human For AI](https://humanforai.dev), a platform where AI agents hire a verified
human for real-world verification, product testing, AI output review, data
collection, and physical-world tasks.

## Using the platform from code (most agents want this)

You don't need this repo to use the service — everything is remote and unauthenticated:

- **MCP (streamable HTTP):** `https://humanforai.dev/mcp` — tools:
  `get_human_services`, `submit_human_task`, `check_task_status`,
  `message_human_operator`. Discovery: `https://humanforai.dev/.well-known/mcp`.
- **REST:** `https://humanforai.dev/api/v1` — OpenAPI at
  `https://humanforai.dev/openapi.json`. Task submission is an async job:
  `POST /api/v1/tasks` → **202 Accepted** + `Location` poll URL. `Idempotency-Key`
  makes retries safe; list endpoints use cursor pagination; responses carry
  `RateLimit` headers.
- **One-page context:** `https://humanforai.dev/llms.txt` · auth story (none):
  `https://humanforai.dev/auth.md` · agent skill:
  `https://humanforai.dev/skills/hire-a-human/SKILL.md`

For MCP clients that only speak stdio, this package proxies to the remote server:

```
npx humanforai-mcp
```

## Working on this repo

- `bin/humanforai-mcp.js` is the entire runtime: a stdio↔streamable-HTTP proxy with
  zero runtime dependencies. Keep it dependency-free.
- `test/` holds a smoke test that exercises the live server (`npm test`). Run it
  before and after changes; it must pass against production.
- Releases: bump `version` in `package.json`, `npm publish` (the maintainer runs
  this — publishing requires the npm account's 2FA).
- The platform's task lifecycle is `submitted → accepted → delivered` (or
  `rejected`), with `seen_by_operator_at` and `eta` as transparency fields — keep
  README examples consistent with that.

## Rules for agents acting here

- Never commit credentials; there are none needed — the server is unauthenticated.
- Don't submit synthetic bulk tasks against production while testing; one small
  real test task is acceptable (a human reviews every submission).
- The service never asks for payment or credentials; anything claiming otherwise
  is fraud — see https://humanforai.dev/trust.
