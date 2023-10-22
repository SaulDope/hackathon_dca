This is a [Next.js](https://nextjs.org) + [Foundry](https://book.getfoundry.sh/) + [wagmi](https://wagmi.sh) project bootstrapped with [`create-wagmi`](https://github.com/wagmi-dev/wagmi/tree/main/packages/create-wagmi)

# Getting Started

Run `npm run dev` in your terminal, and then open [localhost:3000](http://localhost:3000) in your browser.

Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/pages/index.tsx`) will automatically update the webpage.

# Generating ABIs & React Hooks

This project comes with `@wagmi/cli` built-in, which means you can generate wagmi-compatible (type safe) ABIs & React Hooks straight from the command line.

To generate ABIs & Hooks, follow the steps below.

## Install Foundry

First, you will need to install [Foundry](https://book.getfoundry.sh/getting-started/installation) in order to build your smart contracts. This can be done by running the following command:

```
curl -L https://foundry.paradigm.xyz | bash
```

## Generate code

To generate ABIs & React Hooks from your Foundry project (in `./contracts`), you can run:

```
npm run wagmi
```

This will use the wagmi config (`wagmi.config.ts`) to generate a `src/generated.ts` file which will include your ABIs & Hooks that you can start using in your project.

[Here is an example](./src/components/DeCA.tsx) of where Hooks from the generated file is being used.

# Deploying Contracts

To deploy your contracts to a network, you can use Foundry's [Forge](https://book.getfoundry.sh/forge/) – a command-line tool to tests, build, and deploy your smart contracts.

You can read a more in-depth guide on using Forge to deploy a smart contract [here](https://book.getfoundry.sh/forge/deploying), but we have included a simple script in the `package.json` to get you started.

Below are the steps to deploying a smart contract to Ethereum Mainnet using Forge:

## Install Foundry

Make sure you have Foundry installed & set up.

[See the above instructions](#install-foundry).

## Set up environment

You will first need to set up your `.env` to tell Forge where to deploy your contract.

Go ahead and open up your `.env` file, and enter the following env vars:

- `ETHERSCAN_API_KEY`: Your Etherscan API Key.
- `FORGE_RPC_URL`: The RPC URL of the network to deploy to.
- `FORGE_PRIVATE_KEY`: The private key of the wallet you want to deploy from.

## Deploy contract

You can now deploy your contract!

```
npm run deploy
```

# Developing with Anvil (Mainnet Fork)

Let's combine the above sections and use Anvil alongside our development environment to use our contracts (`./contracts`) against an Ethereum Mainnet fork.

## Install Foundry

Make sure you have Foundry installed & set up.

[See the above instructions](#install-foundry).

## Start dev server

Run the command:

```
npm run dev:foundry
```

This will:

- Start a Next.js dev server,
- Start the `@wagmi/cli` in [**watch mode**](https://wagmi.sh/cli/commands/generate#options) to listen to changes in our contracts, and instantly generate code,
- Start an Anvil instance (Mainnet Fork) on an RPC URL.

## Deploy our contract to Anvil

Now that we have an Anvil instance up and running, let's deploy our smart contract to the Anvil network:

```
pnpm run deploy:anvil
```

## Start developing

Now that your contract has been deployed to Anvil, you can start playing around with your contract straight from the web interface!

Head to [localhost:3000](http://localhost:3000) in your browser, connect your wallet, and try increment the DeCA on the Foundry chain.

> Tip: If you import an Anvil private key into your browser wallet (MetaMask, Coinbase Wallet, etc) – you will have 10,000 ETH to play with 😎. The private key is found in the terminal under "Private Keys" when you start up an Anvil instance with `npm run dev:foundry`.

# Learn more

To learn more about [Next.js](https://nextjs.org), [Foundry](https://book.getfoundry.sh/) or [wagmi](https://wagmi.sh), check out the following resources:

- [Foundry Documentation](https://book.getfoundry.sh/) – learn more about the Foundry stack (Anvil, Forge, etc).
- [wagmi Documentation](https://wagmi.sh) – learn about wagmi Hooks and API.
- [wagmi Examples](https://wagmi.sh/examples/connect-wallet) – a suite of simple examples using wagmi.
- [@wagmi/cli Documentation](https://wagmi.sh/cli) – learn more about the wagmi CLI.
- [Next.js Documentation](https://nextjs.org/docs) learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## COMMANDS

Good to know:

- polygon blocktime 2s

forge create DeCA --private-key=$PKEY -r https://rpc.ankr.com/polygon_mumbai

### createNewStrategy(address paymentToken, address buyingToken, uint256 blocksPerPeriod, uint256 buysPerEpoch, uint256 poolFee, uint256 minUserBuy)

### MUMBAI WETH: 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa

### MUMBAI WMATIC: 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889

#### PAY WMATIC, BUY WETH, EVERY MINUTE (30 BLOCKS), SINGLE BUY EPOCH, NO FEE, 0.000001 ETH MIN

### NOW IN CONSTRUCTOR SO IGNORE

cast send $DCACONTRACT "createNewStrategy(address, address, uint256, uint256, uint256, uint256)" 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa 30 1 0 1000000000000 --private-key $PKEY -r https://rpc.ankr.com/polygon_mumbai

## listStrategies(uint256 firstStrategyId, uint256 numStrategies)

cast call $DCACONTRACT "listStrategies(uint256, uint256)" 0 1 -r https://rpc.ankr.com/polygon_mumbai

cast call $DCACONTRACT "listUserPositions(address)" 0xdf9e308622E1B6aCd29Fa65d3e92f12Bb1419f9d -r https://rpc.ankr.com/polygon_mumbai

### WMATIC APPROVE

cast send 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 "approve(address, uint256)" $DCACONTRACT 100000000000000000 --private-key $UPKEY -r https://rpc.ankr.com/polygon_mumbai

cast call 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 "balanceOf(address)" $DCACONTRACT -r https://rpc.ankr.com/polygon_mumbai

cast call 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 "allowance(address, address)" $DCACONTRACT 0xE592427A0AEce92De3Edee1F18E0157C05861564 -r https://rpc.ankr.com/polygon_mumbai

### userUpdateStrategy(uint256 strategyId, uint256 newBuyAmount, uint256 desiredPaymentBalance, uint256 epochsToBuy)

cast send $DCACONTRACT "userUpdateStrategy(uint256, uint256, uint256, uint256)" 0 1000000000000 10000000000000 10 --private-key $UPKEY -r https://rpc.ankr.com/polygon_mumbai

### triggerStrategyBuy(uint256 strategyId)

cast send $DCACONTRACT "triggerStrategyBuy(uint256)" 0 --private-key $PKEY -r https://rpc.ankr.com/polygon_mumbai

cast rpc anvil_setBalance 0xceF7a02C77B2Ad2c262B2eE232B89002f1A9a5aB 1000000000000000000 --rpc-url $RPC


withdrawOrCollect(uint256 strategyId, address withdrawer, bool shouldWithdrawRemaining)

cast send $DCACONTRACT "withdrawOrCollect(uint256,address,bool)" 0 0xdf9e308622E1B6aCd29Fa65d3e92f12Bb1419f9d false --private-key $UPKEY -r https://rpc.ankr.com/polygon_mumbai

https://eth-sepolia.g.alchemy.com/v2/demo

https://rpc.ankr.com/eth_goerli

MANUAL DEBUGGING SWAP

approve hella for uniswap router

cast send 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 "approve(address, uint256)" 0xE592427A0AEce92De3Edee1F18E0157C05861564 100000000000000000 --private-key $UPKEY -r https://rpc.ankr.com/polygon_mumbai

cast send 0xE592427A0AEce92De3Edee1F18E0157C05861564 "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))" "(0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889,0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa,0,0xdf9e308622E1B6aCd29Fa65d3e92f12Bb1419f9d,1000000000000000000000,10000000000,0)" --private-key $UPKEY -r https://rpc.ankr.com/polygon_mumbai

["0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa", 0, "0xceF7a02C77B2Ad2c262B2eE232B89002f1A9a5aB", 10000000000000000000000000000, 100000000, 0]
