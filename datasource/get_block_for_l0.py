#!/usr/bin/env python3

import os
import sys
import requests

HEADERS = {"Content-Type": "application/json"}
chain_urls = {
    "1": "https://kovan.infura.io/v3/" + infura_key
}

def get_block_by_number(url, block_number):
    r = requests.post(
        url,
        headers=HEADERS,
        json={
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": [hex(int(block_number)), False],
            "id": 1
        }
    )
    r.raise_for_status()

    return r.json()["result"]

def get_latest_block_number(url):
    r = requests.post(
        url,
        headers=HEADERS,
        json={"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1}
    )
    r.raise_for_status()

    return int(r.json()["result"][2:], 16)


def main(chain_id, block_confirmations, block_number):
    if chain_id in chain_urls:
        url = chain_urls[chain_id]
    else:
        raise ValueError(f"Fail: Unknown chain_id {chain_id}")

    block_data = get_block_by_number(url, block_number)
    latest_block_number = get_latest_block_number(url)
    current_confirmation = latest_block_number - int(block_number, 10)

    if current_confirmation < int(block_confirmations, 10):
        raise ValueError(f"Fail: current_confirmation({current_confirmation}) < block_confirmations{block_confirmations}")

    return f"{block_data['hash']} {str(current_confirmation)} {block_data['receiptsRoot']}"


if __name__ == "__main__":
    try:
        print(main(*sys.argv[1:]))
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
