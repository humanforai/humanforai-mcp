// Smoke test: acts as an MCP client, spawns the bin over stdio exactly
// like Claude Desktop would, and exercises the protocol end-to-end
// against the live server. Read-only — no task is submitted.
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const bin = fileURLToPath(new URL('../bin/humanforai-mcp.js', import.meta.url));
const client = new Client({ name: 'smoke-test', version: '0.0.1' });

await client.connect(new StdioClientTransport({ command: process.execPath, args: [bin] }));
console.log('connected. server:', JSON.stringify(client.getServerVersion()));
console.log('instructions present:', Boolean(client.getInstructions()), '- length:', (client.getInstructions() || '').length);

// Status-transparency contract (v1.4.0): the live server must advertise
// the seen_by_operator_at progress signal to connecting agents.
if (!/seen_by_operator_at/.test(client.getInstructions() || '')) {
  throw new Error('instructions no longer mention seen_by_operator_at — status-transparency contract broken');
}

const { tools } = await client.listTools();
console.log('tools:', tools.map((t) => t.name).join(', '));
if (tools.length !== 4) throw new Error(`expected 4 tools, got ${tools.length}`);

const result = await client.callTool({ name: 'get_human_services', arguments: {} });
const text = result.content?.[0]?.text || '';
console.log('get_human_services returned', text.length, 'chars; snippet:', text.slice(0, 120).replace(/\n/g, ' '));
if (text.length < 100) throw new Error('unexpectedly short services payload');

await client.close();
console.log('PASS');
