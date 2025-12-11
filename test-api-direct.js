#!/usr/bin/env node

// Direct API test script for Newline
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const HMAC_KEY = "1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF";
const PROGRAM_ID = "WihT33JxWbJHLnHy";
const BASE_URL = "https://sandbox.newline53.com/api/v1";

function generateSignedToken() {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const payload = {
    iat: currentTimestamp,
    sub: PROGRAM_ID,
  };

  const options = {
    algorithm: "HS512",
    header: {
      typ: "JWT",
      alg: "HS512",
    },
  };

  return jwt.sign(payload, HMAC_KEY, options);
}

async function getAuthToken() {
  const token = generateSignedToken();
  const url = `${BASE_URL}/auth`;

  console.log("🔐 Authenticating with Newline API...");

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Request-Id': 'test-' + Date.now(),
    },
  });

  if (!response.ok) {
    throw new Error(`Authentication failed! Status: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ Authentication successful!\n");
  return data.token;
}

async function getSyntheticAccounts(authToken) {
  const url = `${BASE_URL}/synthetic_accounts`;

  console.log("📋 Fetching synthetic accounts...");

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'X-Request-Id': 'test-' + Date.now(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function main() {
  try {
    console.log("=".repeat(60));
    console.log("Newline API Direct Test - Synthetic Accounts");
    console.log("=".repeat(60));
    console.log();

    const authToken = await getAuthToken();
    const accountsData = await getSyntheticAccounts(authToken);

    console.log("📊 Results:");
    console.log(`   Total Count: ${accountsData.total_count}`);
    console.log(`   Count: ${accountsData.count}`);
    console.log(`   Limit: ${accountsData.limit}`);
    console.log(`   Offset: ${accountsData.offset}`);
    console.log();

    if (accountsData.data && accountsData.data.length > 0) {
      console.log("✅ Synthetic Accounts Found:");
      console.log("=".repeat(60));

      accountsData.data.forEach((account, index) => {
        console.log(`\nAccount #${index + 1}:`);
        console.log(`  UID: ${account.uid}`);
        console.log(`  Name: ${account.name}`);
        console.log(`  Status: ${account.status}`);
        console.log(`  Category: ${account.synthetic_account_category}`);
        console.log(`  Routing Number: ${account.routing_number}`);
        console.log(`  Account Number: ${account.account_number || 'N/A'}`);
        console.log(`  Net USD Balance: ${account.net_usd_balance || 'N/A'}`);
        console.log(`  Available Balance: ${account.net_usd_available_balance || 'N/A'}`);
        console.log(`  Opened At: ${account.opened_at}`);
        console.log(`  Master Account: ${account.master_account}`);
      });

      console.log("\n" + "=".repeat(60));
      console.log(`\n✅ SUCCESS! Found ${accountsData.data.length} synthetic account(s)`);
    } else {
      console.log("ℹ️  No synthetic accounts found in your program.");
      console.log("   This is normal for a new sandbox account.");
      console.log("   You can create accounts using the MCP server tools.");
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 API connection test completed successfully!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

main();
