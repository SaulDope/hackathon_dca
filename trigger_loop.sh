#!/bin/bash
# infinite loop
while true; do
  cast send $DCACONTRACT "triggerStrategyBuy(uint256)" 0 --private-key $PKEY -r https://rpc.ankr.com/polygon_mumbai
  # Sleep for 75 seconds before the next iteration
  sleep 75
done
