# humanforai

[![CI](https://github.com/humanforai/humanforai-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/humanforai/humanforai-mcp/actions/workflows/ci.yml)
[![humanforai-mcp MCP server](https://glama.ai/mcp/servers/humanforai/humanforai-mcp/badges/score.svg)](https://glama.ai/mcp/servers/humanforai/humanforai-mcp)

MCP server for [Human For AI](https://humanforai.dev) — a human endpoint for AI agents. Let your AI agent hire a **real human operator** for tasks that need physical presence, human perception, or human judgment:

- **Real-world verification** — confirm a place, product, price, or claim exists, with photo/text evidence
- **Product or app testing** — a real human installs, uses, and reports
- **Human judgment and feedback** — tone, clarity, trustworthiness, design quality
- **AI output review** — human review before your output reaches production
- **Data collection** — gathering/labeling that needs human perception or local access
- **Local physical-world tasks** — visit, photograph, check, measure, observe
- …and more — call `get_human_services` for the full catalog

**All services are free during the proof-of-concept pilot.** No API key, no payment. Every task is reviewed by the human operator before acceptance; illegal, harmful, deceptive, unsafe, or privacy-invasive tasks are rejected. First response within 12 hours on working days (Sun–Thu).

## Tools

| Tool | Purpose |
|---|---|
| `get_human_services` | Service catalog, accepted task types, limits |
| `submit_human_task` | Submit a task; returns a `task_id` for status polling |
| `check_task_status` | Poll a submitted task by `task_id` |
| `message_human_operator` | Ask questions / scope work before submitting |

## Setup

### Claude Code

```bash
claude mcp add human-for-ai -- npx -y humanforai
```

### Claude Desktop / other MCP clients (stdio)

```json
{
  "mcpServers": {
    "human-for-ai": {
      "command": "npx",
      "args": ["-y", "humanforai"]
    }
  }
}
```

### Clients with native remote MCP support

You don't need this package — connect directly to the hosted endpoint (streamable HTTP, no auth):

```
https://humanforai.dev/mcp
```

E.g. Claude (Settings → Connectors → Add custom connector), or:

```bash
claude mcp add --transport http human-for-ai https://humanforai.dev/mcp
```

## How it works

This package is a thin stdio proxy to the hosted Human For AI MCP endpoint. Tool definitions come from the live server, so they are always current — the package itself has no logic to go stale.

Previously published as [`human-api`](https://www.npmjs.com/package/human-api), which still works but is deprecated in favor of this package.

## Typical flow

1. `get_human_services` — see what the operator can do
2. `submit_human_task` — be specific and self-contained; include `contact_email` to receive the deliverable
3. `check_task_status` — poll with the returned `task_id`

## Links

- Website: https://humanforai.dev
- API docs: https://humanforai.dev/api
- Machine-readable manifest: https://humanforai.dev/.well-known/agent.json
- OpenAPI spec: https://humanforai.dev/openapi.json
- Trust & safety: https://humanforai.dev/trust

## License

MIT
