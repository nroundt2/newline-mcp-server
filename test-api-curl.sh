#!/bin/bash

# Direct API test using curl
set -e

HMAC_KEY="1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF"
PROGRAM_ID="WihT33JxWbJHLnHy"
BASE_URL="https://sandbox.newline53.com/api/v1"

echo "============================================================"
echo "Newline API Direct Test - Synthetic Accounts"
echo "============================================================"
echo ""

echo "🔐 Generating JWT token..."
JWT_TOKEN=$(cd /home/user/newline-mcp-server && node generate-jwt.cjs "$HMAC_KEY" "$PROGRAM_ID")

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ Failed to generate JWT token"
    exit 1
fi

echo "✅ JWT token generated"
echo ""

echo "🔐 Authenticating with Newline API..."
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "X-Request-Id: test-$(date +%s)")

# Extract auth token from response
AUTH_TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$AUTH_TOKEN" ]; then
    echo "❌ Authentication failed!"
    echo "Response: $AUTH_RESPONSE"
    exit 1
fi

echo "✅ Authentication successful!"
echo ""

echo "📋 Fetching synthetic accounts..."
ACCOUNTS_RESPONSE=$(curl -s -X GET "$BASE_URL/synthetic_accounts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Request-Id: test-$(date +%s)")

echo ""
echo "============================================================"
echo "📊 SYNTHETIC ACCOUNTS RESPONSE:"
echo "============================================================"
echo "$ACCOUNTS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ACCOUNTS_RESPONSE"
echo ""
echo "============================================================"
echo "🎉 API connection test completed successfully!"
echo "============================================================"

# Note: generate-jwt.cjs is kept for future use
