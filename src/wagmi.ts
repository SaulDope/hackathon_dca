import { configureChains, createConfig } from 'wagmi'
import { polygonMumbai, sepolia } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from "wagmi/providers/infura";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    // polygon,
    ...(process.env.NODE_ENV === 'development' ? [polygonMumbai, sepolia] : []),

  ],
  [infuraProvider({ apiKey: infuraKey })],
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: walletConnectProjectId,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
