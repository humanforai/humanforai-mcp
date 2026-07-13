#!/usr/bin/env node
/**
 * humanforai — stdio MCP server for Human For AI (https://humanforai.dev).
 *
 * A thin proxy: connects to the hosted Human For AI MCP endpoint (streamable
 * HTTP, no auth) and forwards tools/list and tools/call over stdio. Tool
 * definitions live on the server, so this package never goes stale when
 * the catalog changes.
 *
 * Usage:
 *   npx -y humanforai
 *
 * Env:
 *   HUMANFORAI_MCP_URL — override the remote endpoint (default:
 *   https://humanforai.dev/mcp). Useful for local development only.
 *   (HUMAN_API_MCP_URL is still honored for backwards compatibility.)
 */

import { createRequire } from 'node:module';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const REMOTE_URL = process.env.HUMANFORAI_MCP_URL
  || process.env.HUMAN_API_MCP_URL
  || 'https://humanforai.dev/mcp';

async function main() {
  // Connect upstream first so we can mirror its instructions downstream.
  const client = new Client({ name: 'humanforai-mcp', version });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(REMOTE_URL)));
  } catch (err) {
    // stderr only — stdout is reserved for the MCP protocol.
    console.error(`[humanforai-mcp] could not reach ${REMOTE_URL}: ${err.message}`);
    console.error('[humanforai-mcp] check your network connection and try again.');
    process.exit(1);
  }

  const server = new Server(
    { name: 'humanforai', version },
    {
      capabilities: { tools: {} },
      instructions: client.getInstructions(),
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, () => client.listTools());
  server.setRequestHandler(CallToolRequestSchema, (req) => client.callTool(req.params));

  const shutdown = async () => {
    try { await client.close(); } catch { /* already closed */ }
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await server.connect(new StdioServerTransport());
}

main().catch((err) => {
  console.error(`[humanforai-mcp] fatal: ${err.message}`);
  process.exit(1);
});
