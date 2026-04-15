#!/bin/bash
# Launch test characters on X Layer Testnet
# Usage: PRIVATE_KEY=0x... ./scripts/launch-characters.sh

set -e

# X Layer Testnet
RPC_URL="https://testrpc.xlayer.tech"
CHAIN_ID=195

# Deployed contracts
FACTORY="0x677e2CD672DdF0F0Cd8F744663FF6787bc0Cc7F7"
BONDING_CURVE="0xE0A417c8f3ade5007e5166D79B893307Ec2B0DCC"
REGISTRY="0x1c3964595EBFba18ED528626f1B144a9dC711D3c"

if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY environment variable not set"
    echo "Usage: PRIVATE_KEY=0x... ./scripts/launch-characters.sh"
    exit 1
fi

# Get wallet address and balance
WALLET=$(cast wallet address "$PRIVATE_KEY")
BALANCE=$(cast balance "$WALLET" --rpc-url "$RPC_URL" --ether)
echo "Wallet: $WALLET"
echo "Balance: $BALANCE OKB"

# Check if balance is sufficient
if (( $(echo "$BALANCE < 0.5" | bc -l) )); then
    echo "Error: Insufficient balance. Need at least 0.5 OKB"
    echo "Get testnet OKB from: https://www.okx.com/xlayer/faucet"
    exit 1
fi

# Launch fee is 1% = 0.01 OKB minimum + dev buy
LAUNCH_VALUE="0.15"  # 0.01 fee + 0.14 dev buy = ~$ALIVE tokens

echo ""
echo "Launching 3 test characters..."
echo "================================"

# Character 1: PEPE
echo "1. Launching PEPE..."
TX1=$(cast send "$FACTORY" \
    "launch((string,string,string,address[],uint256[],uint256))" \
    "(\"Pepe the Frog\",\"PEPE\",\"ipfs://pepe\",[$WALLET],[10000],100000000000000000)" \
    --value "${LAUNCH_VALUE}ether" \
    --private-key "$PRIVATE_KEY" \
    --rpc-url "$RPC_URL" \
    --json 2>/dev/null)
echo "TX: $(echo $TX1 | jq -r '.transactionHash')"

sleep 3

# Character 2: DOGE
echo "2. Launching DOGE..."
TX2=$(cast send "$FACTORY" \
    "launch((string,string,string,address[],uint256[],uint256))" \
    "(\"Doge Lord\",\"DOGE\",\"ipfs://doge\",[$WALLET],[10000],100000000000000000)" \
    --value "${LAUNCH_VALUE}ether" \
    --private-key "$PRIVATE_KEY" \
    --rpc-url "$RPC_URL" \
    --json 2>/dev/null)
echo "TX: $(echo $TX2 | jq -r '.transactionHash')"

sleep 3

# Character 3: WOJAK
echo "3. Launching WOJAK..."
TX3=$(cast send "$FACTORY" \
    "launch((string,string,string,address[],uint256[],uint256))" \
    "(\"Wojak Prime\",\"WOJAK\",\"ipfs://wojak\",[$WALLET],[10000],100000000000000000)" \
    --value "${LAUNCH_VALUE}ether" \
    --private-key "$PRIVATE_KEY" \
    --rpc-url "$RPC_URL" \
    --json 2>/dev/null)
echo "TX: $(echo $TX3 | jq -r '.transactionHash')"

echo ""
echo "================================"
echo "Done! Characters launched on testnet."
echo ""
echo "View on explorer:"
echo "https://www.okx.com/explorer/xlayer-test/address/$FACTORY"
