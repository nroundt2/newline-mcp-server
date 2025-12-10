import Auth from "../auth.js";
import { getNewlineConfig } from "../config.js";

describe("Auth Integration Tests", () => {
  it("should get token successfully", async () => {
    const cfg = getNewlineConfig();
    const auth = new Auth(cfg);
    const token = await auth.getAuthToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should handle missing environment variables gracefully", async () => {
    const invalidConfig = {
      base_url: "https://invalid-url.example.com",
      hmac_key: "",
      program_id: "",
    };

    const auth = new Auth(invalidConfig);

    await expect(auth.getAuthToken()).rejects.toThrow();
  });

  it("should handle invalid credentials gracefully", async () => {
    const invalidConfig = {
      base_url: "https://sandbox.newline53.com/api/v1",
      hmac_key: "invalid-hmac-key",
      program_id: "invalid-program-uid",
    };

    const auth = new Auth(invalidConfig);

    await expect(auth.getAuthToken()).rejects.toThrow();
  });

  it("should handle network errors gracefully", async () => {
    const invalidConfig = {
      base_url: "https://non-existent-domain-12345.com/api/v1",
      hmac_key: "test-hmac-key",
      program_id: "test-program-uid",
    };

    const auth = new Auth(invalidConfig);

    await expect(auth.getAuthToken()).rejects.toThrow();
  });
});
