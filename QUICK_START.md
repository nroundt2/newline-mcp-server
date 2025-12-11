# 🚀 Quick Start - Test Your Newline MCP Server

## ⚡ Fastest Way to Test (Claude Desktop)

1. **Open your Claude Desktop config file:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Add this configuration:**
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

3. **Restart Claude Desktop**

4. **Test with these prompts:**

### ✅ Test Prompt #1 - Authentication
```
Get my Newline authentication token
```
**What to expect:** A JWT token should be returned

### ✅ Test Prompt #2 - List Account Types
```
List all synthetic account types available in Newline
```
**What to expect:** List of account types (checking, savings, etc.)

### ✅ Test Prompt #3 - List Accounts
```
Show me all my synthetic accounts
```
**What to expect:** Array of accounts (may be empty)

### ✅ Test Prompt #4 - List Customers
```
List all customers in my Newline program
```
**What to expect:** Customer data or empty array

### ✅ Test Prompt #5 - List Transactions
```
List all transactions
```
**What to expect:** Transaction history or empty array

### ✅ Test Prompt #6 - List Transfers
```
List all transfers
```
**What to expect:** Transfer history or empty array

## 🎯 Success Indicators

You'll know it's working when:
- ✅ No error messages appear
- ✅ Tools execute and return JSON responses
- ✅ Authentication token is retrieved successfully
- ✅ List commands return arrays (even if empty)

## 🔧 Quick Troubleshooting

**Problem:** "Cannot connect to MCP server"
- Solution: Restart your MCP client after adding config

**Problem:** "Authentication failed"
- Solution: Double-check credentials have no extra spaces

**Problem:** "Tool not found"
- Solution: Wait a moment for server to initialize, then try again

## 📚 More Information

- Full testing guide: `MCP_TEST_GUIDE.md`
- Run connection test: `./test-connection.sh`
- Available tools: 35+ banking API tools
- API Documentation: https://developers.newline53.com

## 🎨 Example Conversational Prompts

Try natural language prompts like:

```
"What types of synthetic accounts can I create?"
"Show me a list of all my customers"
"Get details about my recent transactions"
"List all available products"
"What pools are available?"
"Show me all custodial accounts"
```

The MCP server will automatically use the appropriate tools to answer!

---

**Your Credentials:**
- Program: `WihT33JxWbJHLnHy`
- Environment: Sandbox (`https://sandbox.newline53.com/api/v1`)
- HMAC Key: Configured in MCP settings
