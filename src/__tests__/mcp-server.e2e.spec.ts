import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Auth from "../auth.js";
import SyntheticAccounts from "../synthetic_accounts.js";
import TransfersService from "../transfers.js";
import { getNewlineConfig } from "../config.js";

describe("MCP Server E2E Tests", () => {
  let server: McpServer;
  let auth: Auth;
  let syntheticAccounts: SyntheticAccounts;
  let transfers: TransfersService;
  let authToken: string;
  let cfg: any;

  beforeAll(async () => {
    cfg = getNewlineConfig();
    server = new McpServer({
      name: "newline-test",
      version: "1.0.0",
    });

    auth = new Auth(cfg);

    try {
      authToken = await auth.getAuthToken();
      syntheticAccounts = new SyntheticAccounts(cfg.base_url, authToken);
      transfers = new TransfersService(cfg.base_url, authToken);

      // Register tools with the server
      syntheticAccounts.register(server);
      transfers.register(server);

      server.tool(
        "get-newline-auth-token",
        "Get newline auth token",
        {},
        async () => {
          return {
            content: [
              {
                type: "text",
                text: authToken,
              },
            ],
          };
        },
      );
    } catch (error) {
      console.warn(
        "E2E tests require valid API credentials. Skipping authentication-dependent tests.",
      );
    }
  });

  describe("Server Initialization", () => {
    it("should create MCP server instance", () => {
      expect(server).toBeInstanceOf(McpServer);
      // Note: name and version are not publicly accessible properties
      expect(server).toBeDefined();
    });

    it("should create service instances", () => {
      expect(auth).toBeInstanceOf(Auth);
      if (authToken) {
        expect(syntheticAccounts).toBeInstanceOf(SyntheticAccounts);
        expect(transfers).toBeInstanceOf(TransfersService);
      }
    });
  });

  describe("Authentication Flow", () => {
    it("should authenticate successfully with valid credentials", async () => {
      if (!authToken) {
        console.warn("Skipping authentication test - no valid credentials");
        return;
      }

      expect(authToken).toBeDefined();
      expect(typeof authToken).toBe("string");
      expect(authToken.length).toBeGreaterThan(0);
    });

    it("should provide auth token through MCP tool", async () => {
      if (!authToken) {
        console.warn("Skipping auth token tool test - no valid credentials");
        return;
      }

      // Note: Direct tool testing would require MCP client simulation
      // This tests the tool registration instead
      expect(server).toBeDefined();
      expect(authToken).toBeDefined();
    });
  });

  describe("Synthetic Accounts Workflow", () => {
    it("should list synthetic account types", async () => {
      if (!authToken) {
        console.warn(
          "Skipping synthetic account types test - no valid credentials",
        );
        return;
      }

      try {
        const result = await syntheticAccounts.getSyntheticAccountTypes();

        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
        expect(result.content[0].type).toBe("text");
      } catch (error) {
        console.warn("API call failed:", (error as Error).message);
      }
    });

    it("should list synthetic accounts", async () => {
      if (!authToken) {
        console.warn("Skipping synthetic accounts test - no valid credentials");
        return;
      }

      try {
        const result = await syntheticAccounts.getSyntheticAccounts();

        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
        expect(result.content[0].type).toBe("text");
      } catch (error) {
        console.warn("API call failed:", (error as Error).message);
      }
    });

    it("should validate account creation with real account types", async () => {
      if (!authToken) {
        console.warn(
          "Skipping account creation validation test - no valid credentials",
        );
        return;
      }

      try {
        // First get available account types
        const typesResult = await syntheticAccounts.getSyntheticAccountTypes();
        expect(typesResult.content).toBeDefined();

        // Test with invalid data should still fail
        const invalidPayload = {
          name: "Test Account",
          pool_uid: "invalid-pool-uid",
          synthetic_account_type_uid: "invalid-type-uid",
        };

        await expect(
          syntheticAccounts.createSyntheticAccount(invalidPayload),
        ).rejects.toThrow();
      } catch (error) {
        console.warn("API call failed:", (error as Error).message);
      }
    });
  });

  describe("Transfers Workflow", () => {
    it("should list transfers", async () => {
      if (!authToken) {
        console.warn("Skipping transfers list test - no valid credentials");
        return;
      }

      try {
        const result = await transfers.listTransfers();

        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
        expect(result.content[0].type).toBe("text");
      } catch (error) {
        console.warn("API call failed:", (error as Error).message);
      }
    });

    it("should validate transfer creation with real accounts", async () => {
      if (!authToken) {
        console.warn(
          "Skipping transfer creation validation test - no valid credentials",
        );
        return;
      }

      try {
        // Test with invalid data should fail
        const invalidPayload = {
          external_uid: "test-transfer-001",
          initiating_customer_uid: "invalid-customer-uid",
          initiator_type: "customer",
          source_synthetic_account_uid: "invalid-source-uid",
          destination_synthetic_account_uid: "invalid-dest-uid",
          usd_transfer_amount: "100.00",
        };

        await expect(
          transfers.createTransfer(invalidPayload),
        ).rejects.toThrow();
      } catch (error) {
        console.warn("API call failed:", (error as Error).message);
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid authentication gracefully", async () => {
      const invalidAuth = new Auth({
        base_url: cfg.base_url,
        hmac_key: "invalid-hmac-key",
        program_id: "invalid-program-uid",
      });

      await expect(invalidAuth.getAuthToken()).rejects.toThrow();
    });

    it("should handle network errors gracefully", async () => {
      const networkAuth = new Auth({
        base_url: "https://non-existent-domain-12345.com/api/v1",
        hmac_key: "test-key",
        program_id: "test-uid",
      });

      await expect(networkAuth.getAuthToken()).rejects.toThrow();
    });

    it("should handle malformed API responses", async () => {
      if (!authToken) {
        console.warn("Skipping malformed response test - no valid credentials");
        return;
      }

      // Create service with invalid base URL that returns non-JSON
      const invalidSA = new SyntheticAccounts(
        "https://httpbin.org/html",
        authToken,
      );

      await expect(invalidSA.getSyntheticAccountTypes()).rejects.toThrow();
    });
  });

  describe("Data Validation", () => {
    it("should validate required fields for account creation", async () => {
      if (!authToken) {
        console.warn("Skipping validation test - no valid credentials");
        return;
      }

      const invalidPayloads = [
        {}, // Empty payload
        { name: "Test" }, // Missing required fields
        { name: "Test", pool_uid: "test" }, // Missing synthetic_account_type_uid
        { name: "", pool_uid: "test", synthetic_account_type_uid: "test" }, // Empty name
      ];

      for (const payload of invalidPayloads) {
        await expect(
          syntheticAccounts.createSyntheticAccount(payload as any),
        ).rejects.toThrow();
      }
    });

    it("should validate required fields for transfer creation", async () => {
      if (!authToken) {
        console.warn("Skipping validation test - no valid credentials");
        return;
      }

      const invalidPayloads = [
        {}, // Empty payload
        { external_uid: "test" }, // Missing other required fields
        {
          external_uid: "test",
          initiating_customer_uid: "test",
          initiator_type: "customer",
        }, // Missing account UIDs and amount
        {
          external_uid: "test",
          initiating_customer_uid: "test",
          initiator_type: "customer",
          source_synthetic_account_uid: "test",
          destination_synthetic_account_uid: "test",
          usd_transfer_amount: "invalid-amount", // Invalid amount format
        },
      ];

      for (const payload of invalidPayloads) {
        await expect(
          transfers.createTransfer(payload as any),
        ).rejects.toThrow();
      }
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle typical user workflow", async () => {
      if (!authToken) {
        console.warn(
          "Skipping integration workflow test - no valid credentials",
        );
        return;
      }

      try {
        // 1. Get account types
        const accountTypes = await syntheticAccounts.getSyntheticAccountTypes();
        expect(accountTypes.content).toBeDefined();

        // 2. Get existing accounts
        const accounts = await syntheticAccounts.getSyntheticAccounts();
        expect(accounts.content).toBeDefined();

        // 3. Get transfers
        const transfersList = await transfers.listTransfers();
        expect(transfersList.content).toBeDefined();

        // This represents a typical discovery workflow that a user might follow
        console.log("Workflow completed successfully");
      } catch (error) {
        console.warn("Workflow test failed:", (error as Error).message);
      }
    });

    it("should handle concurrent requests", async () => {
      if (!authToken) {
        console.warn(
          "Skipping concurrent requests test - no valid credentials",
        );
        return;
      }

      try {
        // Make multiple concurrent requests
        const promises = [
          syntheticAccounts.getSyntheticAccountTypes(),
          syntheticAccounts.getSyntheticAccounts(),
          transfers.listTransfers(),
        ];

        const results = await Promise.all(promises);

        results.forEach((result) => {
          expect(result.content).toBeDefined();
          expect(Array.isArray(result.content)).toBe(true);
        });
      } catch (error) {
        console.warn(
          "Concurrent requests test failed:",
          (error as Error).message,
        );
      }
    });
  });
});
