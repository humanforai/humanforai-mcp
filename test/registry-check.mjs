// Post-publish check: install the package fresh from the npm registry via
// npx (like a real user) and run the MCP handshake + a live tool call.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({ name: 'registry-check', version: '0.0.1' });

await client.connect(new StdioClientTransport({
  command: process.platform === 'win32' ? 'cmd' : 'npx',
  args: process.platform === 'win32'
    ? ['/c', 'npx', '-y', 'humanforai@latest']
    : ['-y', 'humanforai@latest'],
}));

console.log('server:', JSON.stringify(client.getServerVersion()));
const { tools } = await client.listTools();
console.log('tools:', tools.map((t) => t.name).join(', '));
const result = await client.callTool({ name: 'get_human_services', arguments: {} });
console.log('live call OK,', (result.content?.[0]?.text || '').length, 'chars');
await client.close();
console.log('REGISTRY CHECK PASS');
