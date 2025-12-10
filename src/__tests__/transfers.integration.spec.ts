import Auth from "../auth.js";
import { NewlineConfig, getNewlineConfig } from "../config.js";
import TransfersService from "../transfers.js";

describe("TransfersService Integration Tests", () => {
  let authToken: string;
  let cfg: NewlineConfig;
  let transfersService: TransfersService;

  beforeAll(async () => {
    cfg = getNewlineConfig();
    authToken = await new Auth(cfg).getAuthToken();
    transfersService = new TransfersService(cfg.base_url, authToken);
  });

  describe("listTransfers", () => {
    it("should get list of transfers successfully", async () => {
      const response = await transfersService.listTransfers();

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
      const invalidTS = new TransfersService(cfg.base_url, "invalid-token");

      const result = await invalidTS.listTransfers();
      expect(result.content[0].text).toBe("Failed to retrieve transfers");
    });

    it("should handle network errors", async () => {
      const invalidTS = new TransfersService(
        "https://invalid-url.com",
        authToken,
      );

      const result = await invalidTS.listTransfers();
      expect(result.content[0].text).toBe("Failed to retrieve transfers");
    });
  });

  describe("getTransfer", () => {
    it("should handle invalid transfer UID", async () => {
      const invalidUID = "non-existent-transfer-uid-12345";

      const result = await transfersService.getTransfer(invalidUID);
      expect(result.content[0].text).toBe("Failed to retrieve transfer");
    });

    it("should handle empty UID", async () => {
      const result = await transfersService.getTransfer("");
      expect(result.content[0].text).toBe("Failed to retrieve transfer");
    });

    it("should handle null UID", async () => {
      const result = await transfersService.getTransfer(null as any);
      expect(result.content[0].text).toBe("Failed to retrieve transfer");
    });

    it("should handle authentication errors", async () => {
      const invalidTS = new TransfersService(cfg.base_url, "invalid-token");

      const result = await invalidTS.getTransfer("test-uid");
      expect(result.content[0].text).toBe("Failed to retrieve transfer");
    });
  });

  describe("createTransfer", () => {
    it("should validate required fields", async () => {
      const invalidPayload = {} as any;

      const result = await transfersService.createTransfer(invalidPayload);
      expect(result.content[0].text).toContain("Failed to create transfer");
    });

    it("should validate external_uid field", async () => {
      const payloadWithoutExternalUID = {
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "100.00",
      } as any;

      const result = await transfersService.createTransfer(
        payloadWithoutExternalUID,
      );
      expect(result.content[0].text).toContain("Failed to create transfer");
    });

    it("should validate initiating_customer_uid field", async () => {
      const payloadWithoutCustomerUID = {
        external_uid: "test-external-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "100.00",
      } as any;

      const result = await transfersService.createTransfer(
        payloadWithoutCustomerUID,
      );
      expect(result.content[0].text).toContain("Failed to create transfer");
    });

    it("should validate initiator_type field", async () => {
      const payloadWithoutInitiatorType = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "100.00",
      } as any;

      const result = await transfersService.createTransfer(
        payloadWithoutInitiatorType,
      );
      expect(result.content[0].text).toContain("Failed to create transfer");
    });

    it("should validate source_synthetic_account_uid field", async () => {
      const payloadWithoutSourceUID = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "100.00",
      } as any;

      await expect(
        transfersService.createTransfer(payloadWithoutSourceUID),
      ).rejects.toThrow();
    });

    it("should validate destination_synthetic_account_uid field", async () => {
      const payloadWithoutDestUID = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        usd_transfer_amount: "100.00",
      } as any;

      await expect(
        transfersService.createTransfer(payloadWithoutDestUID),
      ).rejects.toThrow();
    });

    it("should validate usd_transfer_amount field", async () => {
      const payloadWithoutAmount = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
      } as any;

      await expect(
        transfersService.createTransfer(payloadWithoutAmount),
      ).rejects.toThrow();
    });

    it("should validate wire transfer creation", async () => {
      const wireTransferPayload = {
        external_uid: "test-wire-transfer-001",
        initiating_customer_uid: "invalid-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "invalid-source-uid",
        destination_synthetic_account_uid: "invalid-dest-uid",
        usd_transfer_amount: "100.00",
        wire: {
          wire_instructions: "Test wire transfer",
        },
      };

      // This should fail due to invalid UIDs
      await expect(
        transfersService.createTransfer(wireTransferPayload),
      ).rejects.toThrow();
    });

    it("should validate ACH transfer creation", async () => {
      const achTransferPayload = {
        external_uid: "test-ach-transfer-001",
        initiating_customer_uid: "invalid-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "invalid-source-uid",
        destination_synthetic_account_uid: "invalid-dest-uid",
        usd_transfer_amount: "100.00",
        ach: {
          sec_code: "PPD",
          service_processing: "standard",
          originator_name: "Test Company",
          company_id: "1234567890",
          prenote: false,
          entry_description: "Test Transfer",
          effective_entry_date: "2024-01-01",
          id_number: "1234567890",
        },
      };

      // This should fail due to invalid UIDs
      await expect(
        transfersService.createTransfer(achTransferPayload),
      ).rejects.toThrow();
    });

    it("should validate instant payment transfer creation", async () => {
      const instantPaymentPayload = {
        external_uid: "test-instant-transfer-001",
        initiating_customer_uid: "invalid-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "invalid-source-uid",
        destination_synthetic_account_uid: "invalid-dest-uid",
        usd_transfer_amount: "100.00",
        instant_payment: {
          memo: "Test instant payment",
          instant_payment_transmitter: {
            name: "Test Transmitter",
            transmitter_identifier: "TEST123",
            street_number: 123,
            street1: "Main St",
            street2: "Suite 1",
            city: "Anytown",
            state: "CA",
            postal_code: "12345",
            country: "US",
          },
        },
      };

      // This should fail due to invalid UIDs
      await expect(
        transfersService.createTransfer(instantPaymentPayload),
      ).rejects.toThrow();
    });

    it("should validate transfer amount format", async () => {
      const invalidAmountPayload = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "invalid-amount",
      };

      await expect(
        transfersService.createTransfer(invalidAmountPayload),
      ).rejects.toThrow();
    });

    it("should validate negative transfer amounts", async () => {
      const negativeAmountPayload = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "-100.00",
      };

      await expect(
        transfersService.createTransfer(negativeAmountPayload),
      ).rejects.toThrow();
    });

    it("should validate zero transfer amounts", async () => {
      const zeroAmountPayload = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "0.00",
      };

      await expect(
        transfersService.createTransfer(zeroAmountPayload),
      ).rejects.toThrow();
    });

    it("should handle authentication errors", async () => {
      const invalidTS = new TransfersService(cfg.base_url, "invalid-token");
      const validPayload = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "test-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "test-source-uid",
        destination_synthetic_account_uid: "test-dest-uid",
        usd_transfer_amount: "100.00",
      };

      await expect(invalidTS.createTransfer(validPayload)).rejects.toThrow();
    });
  });

  describe("Edge cases", () => {
    it("should handle malformed response data", async () => {
      // This tests that the service can handle unexpected API responses
      const invalidTS = new TransfersService(
        "https://httpbin.org/json",
        authToken,
      );

      await expect(invalidTS.listTransfers()).rejects.toThrow();
    });

    it("should handle timeout errors", async () => {
      // This would test timeout handling, but requires a mock or slow endpoint
      const slowTS = new TransfersService(
        "https://httpbin.org/delay/30",
        authToken,
      );

      await expect(slowTS.listTransfers()).rejects.toThrow();
    });

    it("should handle large transfer amounts", async () => {
      const largeAmountPayload = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "invalid-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "invalid-source-uid",
        destination_synthetic_account_uid: "invalid-dest-uid",
        usd_transfer_amount: "999999999999.99",
      };

      // This should fail due to invalid UIDs (amount validation depends on API limits)
      await expect(
        transfersService.createTransfer(largeAmountPayload),
      ).rejects.toThrow();
    });

    it("should handle very small transfer amounts", async () => {
      const smallAmountPayload = {
        external_uid: "test-external-uid",
        initiating_customer_uid: "invalid-customer-uid",
        initiator_type: "customer",
        source_synthetic_account_uid: "invalid-source-uid",
        destination_synthetic_account_uid: "invalid-dest-uid",
        usd_transfer_amount: "0.01",
      };

      // This should fail due to invalid UIDs (amount validation depends on API limits)
      await expect(
        transfersService.createTransfer(smallAmountPayload),
      ).rejects.toThrow();
    });
  });
});
