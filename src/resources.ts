import { fetchData } from "./fetch.js";
import { z } from "zod";

// Generic response interface for list endpoints
interface ListResponse<T> {
  total_count: number;
  count: number;
  limit: number;
  offset: number;
  data: T[];
}

// Basic resource interfaces
interface Pool {
  uid: string;
  external_uid: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  customer_uids: string[];
  synthetic_account_uids: string[];
}

interface Product {
  uid: string;
  name: string;
  description: string;
  product_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CustomerProduct {
  uid: string;
  customer_uid: string;
  product_uid: string;
  status: string;
  created_at: string;
  updated_at: string;
  activated_at: string | null;
}

interface CustodialAccount {
  uid: string;
  external_uid: string;
  name: string;
  account_number: string;
  routing_number: string;
  account_type: string;
  status: string;
  balance: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface TransactionEvent {
  uid: string;
  transaction_uid: string;
  event_type: string;
  status: string;
  description: string;
  created_at: string;
  metadata: Record<string, any>;
}

interface SyntheticLineItem {
  uid: string;
  synthetic_account_uid: string;
  transaction_uid: string;
  amount: string;
  currency: string;
  description: string;
  created_at: string;
}

interface CustodialLineItem {
  uid: string;
  custodial_account_uid: string;
  transaction_uid: string;
  amount: string;
  currency: string;
  description: string;
  created_at: string;
}

interface VirtualReferenceNumber {
  uid: string;
  reference_number: string;
  status: string;
  customer_uid: string;
  synthetic_account_uid: string;
  created_at: string;
  expires_at: string | null;
}

interface Return {
  uid: string;
  external_uid: string;
  original_transaction_uid: string;
  return_reason: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
}

interface CombinedTransfer {
  uid: string;
  external_uid: string;
  transfer_uids: string[];
  status: string;
  total_amount: string;
  currency: string;
  created_at: string;
}

interface CustomerActivity {
  uid: string;
  customer_uid: string;
  activity_type: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
}

class NewlineResourcesService {
  baseUrl: string;
  authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  // Pool methods
  private formatPool(pool: Pool): string {
    return [
      `UID: ${pool.uid}`,
      `External UID: ${pool.external_uid}`,
      `Name: ${pool.name}`,
      `Description: ${pool.description}`,
      `Customer UIDs: ${pool.customer_uids.join(", ") || "None"}`,
      `Synthetic Account UIDs: ${
        pool.synthetic_account_uids.join(", ") || "None"
      }`,
      `Created At: ${pool.created_at}`,
      `Updated At: ${pool.updated_at}`,
      "---",
    ].join("\n");
  }

  async listPools(): Promise<any> {
    const response = await fetchData<ListResponse<Pool>>(
      `${this.baseUrl}/pools`,
      this.authToken,
    );

    if (!response) {
      return { content: [{ type: "text", text: "Failed to retrieve pools" }] };
    }

    const pools = response.data || [];
    if (pools.length === 0) {
      return { content: [{ type: "text", text: "No pools found" }] };
    }

    const formattedPools = pools.map(this.formatPool);
    return {
      content: [
        {
          type: "text",
          text: `Pools (${response.count} of ${
            response.total_count
          }):\n\n${formattedPools.join("\n")}`,
        },
      ],
    };
  }

  async getPool(uid: string): Promise<any> {
    const response = await fetchData<Pool>(
      `${this.baseUrl}/pools/${uid}`,
      this.authToken,
    );

    if (!response) {
      return { content: [{ type: "text", text: "Failed to retrieve pool" }] };
    }

    return {
      content: [
        {
          type: "text",
          text: `Pool Details:\n\n${this.formatPool(response)}`,
        },
      ],
    };
  }

  // Product methods
  private formatProduct(product: Product): string {
    return [
      `UID: ${product.uid}`,
      `Name: ${product.name}`,
      `Description: ${product.description}`,
      `Type: ${product.product_type}`,
      `Status: ${product.status}`,
      `Created At: ${product.created_at}`,
      `Updated At: ${product.updated_at}`,
      "---",
    ].join("\n");
  }

  async listProducts(): Promise<any> {
    const response = await fetchData<ListResponse<Product>>(
      `${this.baseUrl}/products`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [{ type: "text", text: "Failed to retrieve products" }],
      };
    }

    const products = response.data || [];
    if (products.length === 0) {
      return { content: [{ type: "text", text: "No products found" }] };
    }

    const formattedProducts = products.map(this.formatProduct);
    return {
      content: [
        {
          type: "text",
          text: `Products (${response.count} of ${
            response.total_count
          }):\n\n${formattedProducts.join("\n")}`,
        },
      ],
    };
  }

  async getProduct(uid: string): Promise<any> {
    const response = await fetchData<Product>(
      `${this.baseUrl}/products/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [{ type: "text", text: "Failed to retrieve product" }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Product Details:\n\n${this.formatProduct(response)}`,
        },
      ],
    };
  }

  // Customer Product methods
  private formatCustomerProduct(cp: CustomerProduct): string {
    return [
      `UID: ${cp.uid}`,
      `Customer UID: ${cp.customer_uid}`,
      `Product UID: ${cp.product_uid}`,
      `Status: ${cp.status}`,
      `Created At: ${cp.created_at}`,
      `Updated At: ${cp.updated_at}`,
      `Activated At: ${cp.activated_at || "Not activated"}`,
      "---",
    ].join("\n");
  }

  async listCustomerProducts(): Promise<any> {
    const response = await fetchData<ListResponse<CustomerProduct>>(
      `${this.baseUrl}/customer_products`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve customer products" },
        ],
      };
    }

    const customerProducts = response.data || [];
    if (customerProducts.length === 0) {
      return {
        content: [{ type: "text", text: "No customer products found" }],
      };
    }

    const formattedCustomerProducts = customerProducts.map(
      this.formatCustomerProduct,
    );
    return {
      content: [
        {
          type: "text",
          text: `Customer Products (${response.count} of ${
            response.total_count
          }):\n\n${formattedCustomerProducts.join("\n")}`,
        },
      ],
    };
  }

  async getCustomerProduct(uid: string): Promise<any> {
    const response = await fetchData<CustomerProduct>(
      `${this.baseUrl}/customer_products/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve customer product" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Customer Product Details:\n\n${this.formatCustomerProduct(
            response,
          )}`,
        },
      ],
    };
  }

  // Custodial Account methods
  private formatCustodialAccount(ca: CustodialAccount): string {
    return [
      `UID: ${ca.uid}`,
      `External UID: ${ca.external_uid}`,
      `Name: ${ca.name}`,
      `Account Number: ${ca.account_number}`,
      `Routing Number: ${ca.routing_number}`,
      `Account Type: ${ca.account_type}`,
      `Status: ${ca.status}`,
      `Balance: ${ca.balance} ${ca.currency}`,
      `Created At: ${ca.created_at}`,
      `Updated At: ${ca.updated_at}`,
      "---",
    ].join("\n");
  }

  async listCustodialAccounts(): Promise<any> {
    const response = await fetchData<ListResponse<CustodialAccount>>(
      `${this.baseUrl}/custodial_accounts`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve custodial accounts" },
        ],
      };
    }

    const accounts = response.data || [];
    if (accounts.length === 0) {
      return {
        content: [{ type: "text", text: "No custodial accounts found" }],
      };
    }

    const formattedAccounts = accounts.map(this.formatCustodialAccount);
    return {
      content: [
        {
          type: "text",
          text: `Custodial Accounts (${response.count} of ${
            response.total_count
          }):\n\n${formattedAccounts.join("\n")}`,
        },
      ],
    };
  }

  async getCustodialAccount(uid: string): Promise<any> {
    const response = await fetchData<CustodialAccount>(
      `${this.baseUrl}/custodial_accounts/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve custodial account" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Custodial Account Details:\n\n${this.formatCustodialAccount(
            response,
          )}`,
        },
      ],
    };
  }

  register(server: any) {
    // Pool tools
    server.tool("list-pools", "Get a list of pools", {}, async () =>
      this.listPools(),
    );

    server.tool(
      "get-pool",
      "Get details for a specific pool",
      {
        uid: z.string().describe("The pool UID"),
      },
      async ({ uid }: { uid: string }) => this.getPool(uid),
    );

    // Product tools
    server.tool("list-products", "Get a list of products", {}, async () =>
      this.listProducts(),
    );

    server.tool(
      "get-product",
      "Get details for a specific product",
      {
        uid: z.string().describe("The product UID"),
      },
      async ({ uid }: { uid: string }) => this.getProduct(uid),
    );

    // Customer Product tools
    server.tool(
      "list-customer-products",
      "Get a list of customer products",
      {},
      async () => this.listCustomerProducts(),
    );

    server.tool(
      "get-customer-product",
      "Get details for a specific customer product",
      {
        uid: z.string().describe("The customer product UID"),
      },
      async ({ uid }: { uid: string }) => this.getCustomerProduct(uid),
    );

    // Custodial Account tools
    server.tool(
      "list-custodial-accounts",
      "Get a list of custodial accounts",
      {},
      async () => this.listCustodialAccounts(),
    );

    server.tool(
      "get-custodial-account",
      "Get details for a specific custodial account",
      {
        uid: z.string().describe("The custodial account UID"),
      },
      async ({ uid }: { uid: string }) => this.getCustodialAccount(uid),
    );
  }
}

export default NewlineResourcesService;
