import { fetchData } from "./fetch.js";
import { z } from "zod";

// Generic response interface
interface ListResponse<T> {
  total_count: number;
  count: number;
  limit: number;
  offset: number;
  data: T[];
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
  balance_after: string;
}

interface CustodialLineItem {
  uid: string;
  custodial_account_uid: string;
  transaction_uid: string;
  amount: string;
  currency: string;
  description: string;
  created_at: string;
  balance_after: string;
}

interface VirtualReferenceNumber {
  uid: string;
  reference_number: string;
  status: string;
  customer_uid: string;
  synthetic_account_uid: string;
  created_at: string;
  expires_at: string | null;
  locked_at: string | null;
  locked_reason: string | null;
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
  processed_at: string | null;
}

interface CombinedTransfer {
  uid: string;
  external_uid: string;
  transfer_uids: string[];
  status: string;
  total_amount: string;
  currency: string;
  created_at: string;
  completed_at: string | null;
}

interface CustomerActivity {
  uid: string;
  customer_uid: string;
  activity_type: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

interface CustodialPartner {
  uid: string;
  name: string;
  partner_type: string;
  status: string;
  description: string;
  created_at: string;
}

interface Client {
  uid: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Program {
  uid: string;
  name: string;
  description: string;
  status: string;
  client_uid: string;
  created_at: string;
  updated_at: string;
}

interface ProgramConfig {
  uid: string;
  program_uid: string;
  config_type: string;
  config_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

class NewlineExtendedService {
  baseUrl: string;
  authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  // Transaction Events
  private formatTransactionEvent(event: TransactionEvent): string {
    return [
      `UID: ${event.uid}`,
      `Transaction UID: ${event.transaction_uid}`,
      `Event Type: ${event.event_type}`,
      `Status: ${event.status}`,
      `Description: ${event.description}`,
      `Created At: ${event.created_at}`,
      `Metadata: ${JSON.stringify(event.metadata)}`,
      "---",
    ].join("\n");
  }

  async listTransactionEvents(): Promise<any> {
    const response = await fetchData<ListResponse<TransactionEvent>>(
      `${this.baseUrl}/transaction_events`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve transaction events" },
        ],
      };
    }

    const events = response.data || [];
    if (events.length === 0) {
      return {
        content: [{ type: "text", text: "No transaction events found" }],
      };
    }

    const formattedEvents = events.map(this.formatTransactionEvent);
    return {
      content: [
        {
          type: "text",
          text: `Transaction Events (${response.count} of ${
            response.total_count
          }):\n\n${formattedEvents.join("\n")}`,
        },
      ],
    };
  }

  async getTransactionEvent(uid: string): Promise<any> {
    const response = await fetchData<TransactionEvent>(
      `${this.baseUrl}/transaction_events/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve transaction event" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Transaction Event Details:\n\n${this.formatTransactionEvent(
            response,
          )}`,
        },
      ],
    };
  }

  // Synthetic Line Items
  private formatSyntheticLineItem(item: SyntheticLineItem): string {
    return [
      `UID: ${item.uid}`,
      `Synthetic Account UID: ${item.synthetic_account_uid}`,
      `Transaction UID: ${item.transaction_uid}`,
      `Amount: ${item.amount} ${item.currency}`,
      `Description: ${item.description}`,
      `Balance After: ${item.balance_after}`,
      `Created At: ${item.created_at}`,
      "---",
    ].join("\n");
  }

  async listSyntheticLineItems(): Promise<any> {
    const response = await fetchData<ListResponse<SyntheticLineItem>>(
      `${this.baseUrl}/synthetic_line_items`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve synthetic line items" },
        ],
      };
    }

    const items = response.data || [];
    if (items.length === 0) {
      return {
        content: [{ type: "text", text: "No synthetic line items found" }],
      };
    }

    const formattedItems = items.map(this.formatSyntheticLineItem);
    return {
      content: [
        {
          type: "text",
          text: `Synthetic Line Items (${response.count} of ${
            response.total_count
          }):\n\n${formattedItems.join("\n")}`,
        },
      ],
    };
  }

  async getSyntheticLineItem(uid: string): Promise<any> {
    const response = await fetchData<SyntheticLineItem>(
      `${this.baseUrl}/synthetic_line_items/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve synthetic line item" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Synthetic Line Item Details:\n\n${this.formatSyntheticLineItem(
            response,
          )}`,
        },
      ],
    };
  }

  // Custodial Line Items
  private formatCustodialLineItem(item: CustodialLineItem): string {
    return [
      `UID: ${item.uid}`,
      `Custodial Account UID: ${item.custodial_account_uid}`,
      `Transaction UID: ${item.transaction_uid}`,
      `Amount: ${item.amount} ${item.currency}`,
      `Description: ${item.description}`,
      `Balance After: ${item.balance_after}`,
      `Created At: ${item.created_at}`,
      "---",
    ].join("\n");
  }

  async listCustodialLineItems(): Promise<any> {
    const response = await fetchData<ListResponse<CustodialLineItem>>(
      `${this.baseUrl}/custodial_line_items`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve custodial line items" },
        ],
      };
    }

    const items = response.data || [];
    if (items.length === 0) {
      return {
        content: [{ type: "text", text: "No custodial line items found" }],
      };
    }

    const formattedItems = items.map(this.formatCustodialLineItem);
    return {
      content: [
        {
          type: "text",
          text: `Custodial Line Items (${response.count} of ${
            response.total_count
          }):\n\n${formattedItems.join("\n")}`,
        },
      ],
    };
  }

  async getCustodialLineItem(uid: string): Promise<any> {
    const response = await fetchData<CustodialLineItem>(
      `${this.baseUrl}/custodial_line_items/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve custodial line item" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Custodial Line Item Details:\n\n${this.formatCustodialLineItem(
            response,
          )}`,
        },
      ],
    };
  }

  // Virtual Reference Numbers
  private formatVirtualReferenceNumber(vrn: VirtualReferenceNumber): string {
    return [
      `UID: ${vrn.uid}`,
      `Reference Number: ${vrn.reference_number}`,
      `Status: ${vrn.status}`,
      `Customer UID: ${vrn.customer_uid}`,
      `Synthetic Account UID: ${vrn.synthetic_account_uid}`,
      `Created At: ${vrn.created_at}`,
      `Expires At: ${vrn.expires_at || "Never"}`,
      `Locked At: ${vrn.locked_at || "Not locked"}`,
      `Lock Reason: ${vrn.locked_reason || "None"}`,
      "---",
    ].join("\n");
  }

  async listVirtualReferenceNumbers(): Promise<any> {
    const response = await fetchData<ListResponse<VirtualReferenceNumber>>(
      `${this.baseUrl}/virtual_reference_numbers`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve virtual reference numbers",
          },
        ],
      };
    }

    const vrns = response.data || [];
    if (vrns.length === 0) {
      return {
        content: [{ type: "text", text: "No virtual reference numbers found" }],
      };
    }

    const formattedVrns = vrns.map(this.formatVirtualReferenceNumber);
    return {
      content: [
        {
          type: "text",
          text: `Virtual Reference Numbers (${response.count} of ${
            response.total_count
          }):\n\n${formattedVrns.join("\n")}`,
        },
      ],
    };
  }

  async getVirtualReferenceNumber(uid: string): Promise<any> {
    const response = await fetchData<VirtualReferenceNumber>(
      `${this.baseUrl}/virtual_reference_numbers/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve virtual reference number" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Virtual Reference Number Details:\n\n${this.formatVirtualReferenceNumber(
            response,
          )}`,
        },
      ],
    };
  }

  // Returns
  private formatReturn(returnItem: Return): string {
    return [
      `UID: ${returnItem.uid}`,
      `External UID: ${returnItem.external_uid}`,
      `Original Transaction UID: ${returnItem.original_transaction_uid}`,
      `Return Reason: ${returnItem.return_reason}`,
      `Amount: ${returnItem.amount} ${returnItem.currency}`,
      `Status: ${returnItem.status}`,
      `Created At: ${returnItem.created_at}`,
      `Processed At: ${returnItem.processed_at || "Not processed"}`,
      "---",
    ].join("\n");
  }

  async listReturns(): Promise<any> {
    const response = await fetchData<ListResponse<Return>>(
      `${this.baseUrl}/returns`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [{ type: "text", text: "Failed to retrieve returns" }],
      };
    }

    const returns = response.data || [];
    if (returns.length === 0) {
      return { content: [{ type: "text", text: "No returns found" }] };
    }

    const formattedReturns = returns.map(this.formatReturn);
    return {
      content: [
        {
          type: "text",
          text: `Returns (${response.count} of ${
            response.total_count
          }):\n\n${formattedReturns.join("\n")}`,
        },
      ],
    };
  }

  async getReturn(uid: string): Promise<any> {
    const response = await fetchData<Return>(
      `${this.baseUrl}/returns/${uid}`,
      this.authToken,
    );

    if (!response) {
      return { content: [{ type: "text", text: "Failed to retrieve return" }] };
    }

    return {
      content: [
        {
          type: "text",
          text: `Return Details:\n\n${this.formatReturn(response)}`,
        },
      ],
    };
  }

  // Combined Transfers
  private formatCombinedTransfer(ct: CombinedTransfer): string {
    return [
      `UID: ${ct.uid}`,
      `External UID: ${ct.external_uid}`,
      `Transfer UIDs: ${ct.transfer_uids.join(", ")}`,
      `Status: ${ct.status}`,
      `Total Amount: ${ct.total_amount} ${ct.currency}`,
      `Created At: ${ct.created_at}`,
      `Completed At: ${ct.completed_at || "Not completed"}`,
      "---",
    ].join("\n");
  }

  async listCombinedTransfers(): Promise<any> {
    const response = await fetchData<ListResponse<CombinedTransfer>>(
      `${this.baseUrl}/combined_transfers`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve combined transfers" },
        ],
      };
    }

    const transfers = response.data || [];
    if (transfers.length === 0) {
      return {
        content: [{ type: "text", text: "No combined transfers found" }],
      };
    }

    const formattedTransfers = transfers.map(this.formatCombinedTransfer);
    return {
      content: [
        {
          type: "text",
          text: `Combined Transfers (${response.count} of ${
            response.total_count
          }):\n\n${formattedTransfers.join("\n")}`,
        },
      ],
    };
  }

  async getCombinedTransfer(uid: string): Promise<any> {
    const response = await fetchData<CombinedTransfer>(
      `${this.baseUrl}/combined_transfers/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve combined transfer" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Combined Transfer Details:\n\n${this.formatCombinedTransfer(
            response,
          )}`,
        },
      ],
    };
  }

  // Customer Activities
  private formatCustomerActivity(activity: CustomerActivity): string {
    return [
      `UID: ${activity.uid}`,
      `Customer UID: ${activity.customer_uid}`,
      `Activity Type: ${activity.activity_type}`,
      `Description: ${activity.description}`,
      `IP Address: ${activity.ip_address || "Unknown"}`,
      `User Agent: ${activity.user_agent || "Unknown"}`,
      `Created At: ${activity.created_at}`,
      `Metadata: ${JSON.stringify(activity.metadata)}`,
      "---",
    ].join("\n");
  }

  async listCustomerActivities(): Promise<any> {
    const response = await fetchData<ListResponse<CustomerActivity>>(
      `${this.baseUrl}/customer_activities`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve customer activities" },
        ],
      };
    }

    const activities = response.data || [];
    if (activities.length === 0) {
      return {
        content: [{ type: "text", text: "No customer activities found" }],
      };
    }

    const formattedActivities = activities.map(this.formatCustomerActivity);
    return {
      content: [
        {
          type: "text",
          text: `Customer Activities (${response.count} of ${
            response.total_count
          }):\n\n${formattedActivities.join("\n")}`,
        },
      ],
    };
  }

  async getCustomerActivity(uid: string): Promise<any> {
    const response = await fetchData<CustomerActivity>(
      `${this.baseUrl}/customer_activities/${uid}`,
      this.authToken,
    );

    if (!response) {
      return {
        content: [
          { type: "text", text: "Failed to retrieve customer activity" },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Customer Activity Details:\n\n${this.formatCustomerActivity(
            response,
          )}`,
        },
      ],
    };
  }

  register(server: any) {
    // Transaction Events
    server.tool(
      "list-transaction-events",
      "Get a list of transaction events",
      {},
      async () => this.listTransactionEvents(),
    );

    server.tool(
      "get-transaction-event",
      "Get details for a specific transaction event",
      {
        uid: z.string().describe("The transaction event UID"),
      },
      async ({ uid }: { uid: string }) => this.getTransactionEvent(uid),
    );

    // Synthetic Line Items
    server.tool(
      "list-synthetic-line-items",
      "Get a list of synthetic line items",
      {},
      async () => this.listSyntheticLineItems(),
    );

    server.tool(
      "get-synthetic-line-item",
      "Get details for a specific synthetic line item",
      {
        uid: z.string().describe("The synthetic line item UID"),
      },
      async ({ uid }: { uid: string }) => this.getSyntheticLineItem(uid),
    );

    // Custodial Line Items
    server.tool(
      "list-custodial-line-items",
      "Get a list of custodial line items",
      {},
      async () => this.listCustodialLineItems(),
    );

    server.tool(
      "get-custodial-line-item",
      "Get details for a specific custodial line item",
      {
        uid: z.string().describe("The custodial line item UID"),
      },
      async ({ uid }: { uid: string }) => this.getCustodialLineItem(uid),
    );

    // Virtual Reference Numbers
    server.tool(
      "list-virtual-reference-numbers",
      "Get a list of virtual reference numbers",
      {},
      async () => this.listVirtualReferenceNumbers(),
    );

    server.tool(
      "get-virtual-reference-number",
      "Get details for a specific virtual reference number",
      {
        uid: z.string().describe("The virtual reference number UID"),
      },
      async ({ uid }: { uid: string }) => this.getVirtualReferenceNumber(uid),
    );

    // Returns
    server.tool("list-returns", "Get a list of returns", {}, async () =>
      this.listReturns(),
    );

    server.tool(
      "get-return",
      "Get details for a specific return",
      {
        uid: z.string().describe("The return UID"),
      },
      async ({ uid }: { uid: string }) => this.getReturn(uid),
    );

    // Combined Transfers
    server.tool(
      "list-combined-transfers",
      "Get a list of combined transfers",
      {},
      async () => this.listCombinedTransfers(),
    );

    server.tool(
      "get-combined-transfer",
      "Get details for a specific combined transfer",
      {
        uid: z.string().describe("The combined transfer UID"),
      },
      async ({ uid }: { uid: string }) => this.getCombinedTransfer(uid),
    );

    // Customer Activities
    server.tool(
      "list-customer-activities",
      "Get a list of customer activities",
      {},
      async () => this.listCustomerActivities(),
    );

    server.tool(
      "get-customer-activity",
      "Get details for a specific customer activity",
      {
        uid: z.string().describe("The customer activity UID"),
      },
      async ({ uid }: { uid: string }) => this.getCustomerActivity(uid),
    );
  }
}

export default NewlineExtendedService;
