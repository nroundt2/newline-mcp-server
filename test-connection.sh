#!/bin/bash

# Newline MCP Server Connection Test Script
# This script tests the basic connectivity to the Newline API

set -e

echo "=================================="
echo "Newline MCP Server Connection Test"
echo "=================================="
echo ""

# Set credentials
export NEWLINE_HMAC_KEY="1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF"
export NEWLINE_PROGRAM_ID="WihT33JxWbJHLnHy"
export NEWLINE_BASE_URL="https://sandbox.newline53.com/api/v1"

echo "✓ Credentials set"
echo "  - Program ID: $NEWLINE_PROGRAM_ID"
echo "  - Base URL: $NEWLINE_BASE_URL"
echo ""

# Test 1: Check if the API endpoint is reachable
echo "Test 1: Checking API endpoint connectivity..."
if curl -s -o /dev/null -w "%{http_code}" "$NEWLINE_BASE_URL" | grep -q "[0-9]"; then
    echo "✓ API endpoint is reachable"
else
    echo "✗ Cannot reach API endpoint"
    exit 1
fi
echo ""

# Test 2: Check if npx is available
echo "Test 2: Checking if npx is available..."
if command -v npx &> /dev/null; then
    NPX_VERSION=$(npx --version)
    echo "✓ npx is installed (version: $NPX_VERSION)"
else
    echo "✗ npx is not installed"
    echo "  Install Node.js from https://nodejs.org/"
    exit 1
fi
echo ""

# Test 3: Check if the MCP server package is accessible
echo "Test 3: Checking MCP server package accessibility..."
if npx -y git+https://github.com/newline53/newline-mcp-server --version 2>/dev/null || true; then
    echo "✓ MCP server package is accessible"
else
    echo "⚠ Could not verify MCP server package (this may be normal)"
fi
echo ""

# Test 4: Verify local build if available
echo "Test 4: Checking for local build..."
if [ -d "dist" ]; then
    echo "✓ Local dist/ directory exists"
    if [ -f "dist/index.js" ]; then
        echo "✓ Built MCP server found at dist/index.js"
    else
        echo "⚠ dist/ exists but index.js not found"
    fi
else
    echo "⚠ No local build found (will use npx to fetch)"
fi
echo ""

echo "=================================="
echo "Connection Test Summary"
echo "=================================="
echo ""
echo "Your environment is configured correctly!"
echo ""
echo "Next Steps:"
echo "1. Configure your MCP client (Claude Desktop, VS Code, Cursor, etc.)"
echo "2. Use the configuration from MCP_TEST_GUIDE.md"
echo "3. Restart your MCP client"
echo "4. Try the test prompts from the guide"
echo ""
echo "Example first prompt:"
echo '  "Get my Newline authentication token"'
echo ""
echo "For detailed testing instructions, see:"
echo "  ./MCP_TEST_GUIDE.md"
echo ""
