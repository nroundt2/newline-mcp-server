#!/usr/bin/env python3
"""
Direct API test for Newline Synthetic Accounts
"""
import json
import time
import hmac
import hashlib
import base64
import requests
from datetime import datetime

HMAC_KEY = "1m4vwvHErvMYgxC14GFNHiY6JSaFn3mDZND28TkSQCjMawvCtzHrGXhGcJRMGQ49C3oJenpHzkRguyYbHMMywm9tQk1RvwbdsiJSoGzWE2xsgua2k3A8fJNtfgUhZ3sF"
PROGRAM_ID = "WihT33JxWbJHLnHy"
BASE_URL = "https://sandbox.newline53.com/api/v1"

def create_jwt_token():
    """Create a JWT token using HS512 algorithm"""
    import jwt

    current_timestamp = int(time.time())
    payload = {
        "iat": current_timestamp,
        "sub": PROGRAM_ID
    }

    token = jwt.encode(
        payload,
        HMAC_KEY,
        algorithm="HS512",
        headers={"typ": "JWT", "alg": "HS512"}
    )

    return token

def get_auth_token():
    """Get authentication token from Newline API"""
    print("🔐 Authenticating with Newline API...")

    jwt_token = create_jwt_token()
    url = f"{BASE_URL}/auth"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {jwt_token}",
        "X-Request-Id": f"test-{int(time.time())}"
    }

    response = requests.post(url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Authentication failed! Status: {response.status_code}, Body: {response.text}")

    data = response.json()
    print("✅ Authentication successful!\n")
    return data["token"]

def get_synthetic_accounts(auth_token):
    """Get synthetic accounts from Newline API"""
    print("📋 Fetching synthetic accounts...")

    url = f"{BASE_URL}/synthetic_accounts"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}",
        "X-Request-Id": f"test-{int(time.time())}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch accounts! Status: {response.status_code}, Body: {response.text}")

    return response.json()

def main():
    print("=" * 60)
    print("Newline API Direct Test - Synthetic Accounts")
    print("=" * 60)
    print()

    try:
        auth_token = get_auth_token()
        accounts_data = get_synthetic_accounts(auth_token)

        print("📊 Results:")
        print(f"   Total Count: {accounts_data.get('total_count', 0)}")
        print(f"   Count: {accounts_data.get('count', 0)}")
        print(f"   Limit: {accounts_data.get('limit', 0)}")
        print(f"   Offset: {accounts_data.get('offset', 0)}")
        print()

        if accounts_data.get('data') and len(accounts_data['data']) > 0:
            print("✅ Synthetic Accounts Found:")
            print("=" * 60)

            for index, account in enumerate(accounts_data['data'], 1):
                print(f"\nAccount #{index}:")
                print(f"  UID: {account.get('uid', 'N/A')}")
                print(f"  Name: {account.get('name', 'N/A')}")
                print(f"  Status: {account.get('status', 'N/A')}")
                print(f"  Category: {account.get('synthetic_account_category', 'N/A')}")
                print(f"  Routing Number: {account.get('routing_number', 'N/A')}")
                print(f"  Account Number: {account.get('account_number', 'N/A')}")
                print(f"  Net USD Balance: {account.get('net_usd_balance', 'N/A')}")
                print(f"  Available Balance: {account.get('net_usd_available_balance', 'N/A')}")
                print(f"  Opened At: {account.get('opened_at', 'N/A')}")
                print(f"  Master Account: {account.get('master_account', 'N/A')}")

            print("\n" + "=" * 60)
            print(f"\n✅ SUCCESS! Found {len(accounts_data['data'])} synthetic account(s)")
        else:
            print("ℹ️  No synthetic accounts found in your program.")
            print("   This is normal for a new sandbox account.")
            print("   You can create accounts using the MCP server tools.")

        print("\n" + "=" * 60)
        print("🎉 API connection test completed successfully!")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == "__main__":
    main()
