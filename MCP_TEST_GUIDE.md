# Newline MCP Server - Testing Guide

This guide will help you test your connection to the Newline MCP server and validate its functionality.

## Prerequisites

You have been provided with the following sandbox credentials:
- **HMAC Key**: `1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF`
- **Program UID**: `WihT33JxWbJHLnHy`
- **Base URL**: `https://sandbox.newline53.com/api/v1`

## Configuration Options

### Option 1: Claude Desktop (Recommended for Testing)

Add this configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "newline": {
      "command": "npx",
      "args": ["-y", "git+https://github.com/newline53/newline-mcp-server"],
      "env": {
        "NEWLINE_HMAC_KEY": "1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF",
        "NEWLINE_PROGRAM_ID": "WihT33JxWbJHLnHy",
        "NEWLINE_BASE_URL": "https://sandbox.newline53.com/api/v1"
      }
    }
  }
}
```

**Location of config file:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

### Option 2: VS Code

Add to `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "newline": {
      "command": "npx",
      "args": ["-y", "git+https://github.com/newline53/newline-mcp-server"],
      "env": {
        "NEWLINE_HMAC_KEY": "1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF",
        "NEWLINE_PROGRAM_ID": "WihT33JxWbJHLnHy",
        "NEWLINE_BASE_URL": "https://sandbox.newline53.com/api/v1"
      }
    }
  }
}
```

### Option 3: Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "newline": {
      "command": "npx",
      "args": ["-y", "git+https://github.com/newline53/newline-mcp-server"],
      "env": {
        "NEWLINE_HMAC_KEY": "1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF",
        "NEWLINE_PROGRAM_ID": "WihT33JxWbJHLnHy",
        "NEWLINE_BASE_URL": "https://sandbox.newline53.com/api/v1"
      }
    }
  }
}
```

### Option 4: Command Line Testing

Run the server directly:

```bash
NEWLINE_HMAC_KEY="1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF" \
NEWLINE_PROGRAM_ID="WihT33JxWbJHLnHy" \
NEWLINE_BASE_URL="https://sandbox.newline53.com/api/v1" \
npx -y git+https://github.com/newline53/newline-mcp-server
```

## Testing Checklist

### 1. Connection Test
After configuring your MCP client, restart it and verify:
- [ ] The MCP server appears in your available servers list
- [ ] No connection errors appear in logs
- [ ] Tools from the server are available

### 2. Basic Tool Tests

Try these prompts in order to test different tools:

#### Authentication Test
```
Get my current Newline authentication token
```
**Expected Result:** Returns a JWT token

#### Account Type Discovery
```
List all available synthetic account types
```
**Expected Result:** Shows all account types available in the sandbox

#### Account Listing
```
Show me all synthetic accounts
```
**Expected Result:** Lists all accounts or returns empty array if none exist

#### Customer Listing
```
List all customers in my Newline program
```
**Expected Result:** Shows customer data or empty array

#### Transaction Query
```
List all transactions
```
**Expected Result:** Shows transactions or empty array

### 3. Advanced Operations

Once basic tests pass, try:

#### Create Account (if supported)
```
Create a new synthetic checking account
```

#### Transfer Operations
```
List all transfers
```

#### Detailed Queries
```
Get details for customer with ID [customer_id]
```

## Available Tools Reference

The MCP server provides 35+ tools organized by resource:

### Core Resources
- **Authentication**: `get-newline-auth-token`
- **Synthetic Accounts**: `get-synthetic-account-types`, `get-synthetic-accounts`, `get-synthetic-account`, `create-synthetic-account`, `delete-synthetic-accounts`
- **Transfers**: `list-newline-transfers`, `get-newline-transfer`, `create-newline-transfer`
- **Customers**: `list-customers`, `get-customer`
- **Transactions**: `list-transactions`, `get-transaction`

### Additional Resources
- **Pools**: `list-pools`, `get-pool`
- **Products**: `list-products`, `get-product`
- **Customer Products**: `list-customer-products`, `get-customer-product`
- **Custodial Accounts**: `list-custodial-accounts`, `get-custodial-account`
- **Transaction Events**: `list-transaction-events`, `get-transaction-event`
- **Synthetic Line Items**: `list-synthetic-line-items`, `get-synthetic-line-item`
- **Custodial Line Items**: `list-custodial-line-items`, `get-custodial-line-item`
- **Virtual Reference Numbers**: `list-virtual-reference-numbers`, `get-virtual-reference-number`
- **Returns**: `list-returns`, `get-return`
- **Combined Transfers**: `list-combined-transfers`, `get-combined-transfer`
- **Customer Activities**: `list-customer-activities`, `get-customer-activity`

## Troubleshooting

### Connection Issues
- Verify your credentials are correctly entered (no extra spaces)
- Check that your network allows connections to `sandbox.newline53.com`
- Restart your MCP client after configuration changes

### Tool Not Found
- Ensure the MCP server started successfully
- Check client logs for initialization errors
- Verify `npx` is installed and working

### Authentication Errors
- Confirm `NEWLINE_HMAC_KEY` is correct
- Verify `NEWLINE_PROGRAM_ID` matches: `WihT33JxWbJHLnHy`
- Check the base URL is: `https://sandbox.newline53.com/api/v1`

### API Errors
- 401: Authentication failed - check HMAC key
- 403: Insufficient permissions - verify program access
- 404: Resource not found - check if resource exists
- 500: Server error - contact Newline support

## Example Workflow

Here's a complete test workflow:

```
1. "Get my Newline auth token"
   → Verifies authentication works

2. "List all synthetic account types"
   → Shows what types of accounts you can create

3. "Show me all synthetic accounts"
   → Lists existing accounts (may be empty)

4. "List all customers"
   → Shows customer data

5. "List all transactions"
   → Shows transaction history

6. "List all transfers"
   → Shows transfer history

7. "List all pools"
   → Shows available pools

8. "List all products"
   → Shows available products
```

## Success Criteria

Your MCP server connection is working correctly if:
- ✅ Authentication token is successfully retrieved
- ✅ Account types are listed without errors
- ✅ List operations return data or empty arrays (not errors)
- ✅ API responses are properly formatted JSON
- ✅ No authentication or connection errors appear

## Next Steps

After successful testing:
1. Explore creating accounts and transfers (if needed)
2. Integrate with your AI workflows
3. Review security considerations in production
4. Set up proper credential management for production use

## Support

If you encounter issues:
- Check the server logs in your MCP client
- Review the error messages for specific guidance
- Email: VulnerabilityManagement.Bancorp@53.com
- GitHub Issues: https://github.com/newline53/newline-mcp-server/issues
