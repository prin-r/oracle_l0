#!/usr/bin/env python3

import sys
import requests

HEADERS = {"Content-Type": "application/json"}
infura_url = "https://kovan.infura.io/v3/8a0f2143b6444ee0a8d0f0414fd533d2"


def main(block_number):
    payload = {
        "jsonrpc": "2.0",
        "method": "eth_getBlockByNumber",
        "params": [hex(int(block_number)), False],
        "id": 1,
    }

    r = requests.post(infura_url, headers=HEADERS, json=payload)
    r.raise_for_status()
    block_data = r.json()["result"]
    block_hash = block_data["hash"]
    state_root = block_data["stateRoot"]
    transaction_root = block_data["transactionsRoot"]

    output = f"{block_hash} {state_root} {transaction_root}"
    return output


if __name__ == "__main__":
    try:
        print(main(sys.argv[1]))
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
