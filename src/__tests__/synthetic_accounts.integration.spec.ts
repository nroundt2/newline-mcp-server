import Auth from "../auth.js";
import { NewlineConfig, getNewlineConfig } from "../config.js";
import SyntheticAccounts from "../synthetic_accounts.js";

describe("SyntheticAccounts Integration Tests", () => {
  let authToken: string;
  let cfg: NewlineConfig;
  let syntheticAccounts: SyntheticAccounts;

  beforeAll(async () => {
    cfg = getNewlineConfig();
    authToken = await new Auth(cfg).getAuthToken();
    syntheticAccounts = new SyntheticAccounts(cfg.base_url, authToken);
  });

  describe("getSyntheticAccountTypes", () => {
    it("should get synthetic account types successfully", async () => {
      const response = await syntheticAccounts.getSyntheticAccountTypes();

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content.length).toBeGreaterThan(0);

      // Verify response structure
      const content = response.content[0];
      expect(content.type).toBe("text");
      expect(content.text).toBeDefined();
    });

    it("should handle authentication errors", async () => {
      const invalidSA = new SyntheticAccounts(cfg.base_url, "invalid-token");

      const result = await invalidSA.getSyntheticAccountTypes();
      expect(result.content[0].text).toBe(
        "Failed to retrieve synthetic account types",
      );
    });

    it("should handle network errors", async () => {
      const invalidSA = new SyntheticAccounts(
        "https://invalid-url.com",
        authToken,
      );

      await expect(invalidSA.getSyntheticAccountTypes()).rejects.toThrow();
    });
  });

  describe("getSyntheticAccounts", () => {
    it("should get synthetic accounts successfully", async () => {
      const response = await syntheticAccounts.getSyntheticAccounts();

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(Array.isArray(response.content)).toBe(true);

      if (response.content.length > 0) {
        const content = response.content[0];
        expect(content.type).toBe("text");
        expect(content.text).toBeDefined();
      }
    });

    it("should handle authentication errors", async () => {
      const invalidSA = new SyntheticAccounts(cfg.base_url, "invalid-token");

      await expect(invalidSA.getSyntheticAccounts()).rejects.toThrow();
    });
  });

  describe("getSyntheticAccount", () => {
    it("should handle invalid account UID", async () => {
      const invalidUID = "non-existent-account-uid-12345";

      await expect(
        syntheticAccounts.getSyntheticAccount(invalidUID),
      ).rejects.toThrow();
    });

    it("should handle empty UID", async () => {
      await expect(syntheticAccounts.getSyntheticAccount("")).rejects.toThrow();
    });

    it("should handle null UID", async () => {
      await expect(
        syntheticAccounts.getSyntheticAccount(null as any),
      ).rejects.toThrow();
    });
  });

  describe("createSyntheticAccount", () => {
    it("should validate required fields", async () => {
      const invalidPayload = {} as any;

      await expect(
        syntheticAccounts.createSyntheticAccount(invalidPayload),
      ).rejects.toThrow();
    });

    it("should validate name field", async () => {
      const payloadWithoutName = {
        pool_uid: "test-pool-uid",
        synthetic_account_type_uid: "test-type-uid",
      } as any;

      await expect(
        syntheticAccounts.createSyntheticAccount(payloadWithoutName),
      ).rejects.toThrow();
    });

    it("should validate pool_uid field", async () => {
      const payloadWithoutPoolUID = {
        name: "Test Account",
        synthetic_account_type_uid: "test-type-uid",
      } as any;

      await expect(
        syntheticAccounts.createSyntheticAccount(payloadWithoutPoolUID),
      ).rejects.toThrow();
    });

    it("should validate synthetic_account_type_uid field", async () => {
      const payloadWithoutTypeUID = {
        name: "Test Account",
        pool_uid: "test-pool-uid",
      } as any;

      await expect(
        syntheticAccounts.createSyntheticAccount(payloadWithoutTypeUID),
      ).rejects.toThrow();
    });

    it("should validate wire account creation", async () => {
      const wirePayload = {
        name: "Test Wire Account",
        pool_uid: "invalid-pool-uid",
        synthetic_account_type_uid: "invalid-type-uid",
        wire: {
          counterparty_name: "Test Counterparty",
        },
      };

      // This should fail due to invalid UIDs
      await expect(
        syntheticAccounts.createSyntheticAccount(wirePayload),
      ).rejects.toThrow();
    });

    it("should validate ACH account creation", async () => {
      const achPayload = {
        name: "Test ACH Account",
        pool_uid: "invalid-pool-uid",
        synthetic_account_type_uid: "invalid-type-uid",
        ach: {
          account_type: "checking",
          counterparty_name: "Test Counterparty",
        },
      };

      // This should fail due to invalid UIDs
      await expect(
        syntheticAccounts.createSyntheticAccount(achPayload),
      ).rejects.toThrow();
    });

    it("should validate instant payment account creation", async () => {
      const instantPaymentPayload = {
        name: "Test Instant Payment Account",
        pool_uid: "invalid-pool-uid",
        synthetic_account_type_uid: "invalid-type-uid",
        instant_payment: {
          counterparty_name: "Test Counterparty",
          counterparty_address: {
            street_number: 123,
            street1: "Main St",
            street2: "Apt 1",
            city: "Anytown",
            state: "CA",
            postal_code: "12345",
            country: "US",
          },
        },
      };

      // This should fail due to invalid UIDs
      await expect(
        syntheticAccounts.createSyntheticAccount(instantPaymentPayload),
      ).rejects.toThrow();
    });
  });

  describe("deleteSyntheticAccount", () => {
    it("should handle invalid account UID", async () => {
      const invalidUID = "non-existent-account-uid-12345";

      await expect(
        syntheticAccounts.deleteSyntheticAccount(invalidUID),
      ).rejects.toThrow();
    });

    it("should handle empty UID", async () => {
      await expect(
        syntheticAccounts.deleteSyntheticAccount(""),
      ).rejects.toThrow();
    });

    it("should handle null UID", async () => {
      await expect(
        syntheticAccounts.deleteSyntheticAccount(null as any),
      ).rejects.toThrow();
    });

    it("should handle authentication errors", async () => {
      const invalidSA = new SyntheticAccounts(cfg.base_url, "invalid-token");

      await expect(
        invalidSA.deleteSyntheticAccount("test-uid"),
      ).rejects.toThrow();
    });
  });

  describe("Error handling", () => {
    it("should handle malformed response data", async () => {
      // This tests that the service can handle unexpected API responses
      const invalidSA = new SyntheticAccounts(
        "https://httpbin.org/json",
        authToken,
      );

      await expect(invalidSA.getSyntheticAccountTypes()).rejects.toThrow();
    });

    it("should handle timeout errors", async () => {
      // This would test timeout handling, but requires a mock or slow endpoint
      const slowSA = new SyntheticAccounts(
        "https://httpbin.org/delay/30",
        authToken,
      );

      await expect(slowSA.getSyntheticAccountTypes()).rejects.toThrow();
    });
  });
});
