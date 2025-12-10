#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import Auth from "./auth.js";
import SyntheticAccounts from "./synthetic_accounts.js";
import TransfersService from "./transfers.js";
import CustomersService from "./customers.js";
import TransactionsService from "./transactions.js";
import ResourcesService from "./resources.js";
import ExtendedResourcesService from "./extended_resources.js";
import { getNewlineConfig } from "./config.js";
const baseNewlineUrl: string = getNewlineConfig().base_url;

// Create server instance
const server = new McpServer({
  name: "newline",
  version: "1.0.0",
});

async function main() {
  const transport = new StdioServerTransport();
  const auth = new Auth(getNewlineConfig());
  const token = await auth.getAuthToken();

  // Initialize services
  const syntheticAccounts = new SyntheticAccounts(baseNewlineUrl, token);
  const transfers = new TransfersService(baseNewlineUrl, token);
  const customers = new CustomersService(baseNewlineUrl, token);
  const transactions = new TransactionsService(baseNewlineUrl, token);
  const resources = new ResourcesService(baseNewlineUrl, token);
  const extendedResources = new ExtendedResourcesService(baseNewlineUrl, token);

  // Register services
  syntheticAccounts.register(server);
  transfers.register(server);
  customers.register(server);
  transactions.register(server);
  resources.register(server);
  extendedResources.register(server);

  server.tool(
    "get-newline-auth-token",
    "Get newline auth token",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: token,
          },
        ],
      };
    },
  );
  await server.connect(transport);
  console.error("Newline MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
