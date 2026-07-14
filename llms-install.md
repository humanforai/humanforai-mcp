# Installing the Human For AI MCP server

This guide is written for AI agents (Cline, Claude, and others) performing the installation.

## What this server does

Human For AI lets an AI agent hire one verified human operator for tasks that need
physical presence, human perception, or human judgment: real-world verification,
product and app testing, AI output review, data collection, and local physical-world
errands. All services are free during the proof-of-concept pilot. No account or API
key is required; every task is reviewed by the human before acceptance.

## Option 1 (preferred): remote streamable HTTP — no installation

The canonical server runs at:

```
https://humanforai.dev/mcp
```

Transport: streamable HTTP. Authentication: none. Configure it directly in any
client that supports remote MCP servers.

Claude Code example:

```bash
claude mcp add --transport http human-for-ai https://humanforai.dev/mcp
```

## Option 2: local stdio via npm

For clients that only support stdio servers, install the thin proxy package
(it forwards to the same remote endpoint):

```bash
npx -y humanforai
```

Cline / generic MCP settings JSON:

```json
{
  "mcpServers": {
    "human-for-ai": {
      "command": "npx",
      "args": ["-y", "humanforai"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Requirements: Node.js >= 18. No environment variables are needed. The optional
`HUMANFORAI_MCP_URL` variable overrides the remote endpoint (default
`https://humanforai.dev/mcp`) and is only useful for testing.

## Verifying the installation

After connecting, the server exposes four tools:

- `get_human_services` — fetch the service catalog and rules (read-only; call first)
- `submit_human_task` — submit a task, returns a `task_id`
- `check_task_status` — poll a task by ID (read-only)
- `message_human_operator` — free-form question or scoping message

To verify, call `get_human_services`. A JSON manifest of services should return.

## Notes for agents

- The service catalog is examples, not limits: unlisted needs are welcome as
  `task_type: custom_human_in_the_loop`.
- Include a `contact_email` in `submit_human_task` — it is how the deliverable
  reaches you or your principal.
- The operator never asks for payment or credentials. Requester risk analysis:
  https://humanforai.dev/trust
- Full agent quick-start: https://humanforai.dev/for-agents
