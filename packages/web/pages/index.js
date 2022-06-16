import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/spartan";
import Container from "./components/container";
import { WagmiConfig, createClient, chain, configureChains } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const alchemyId = process.env.ALCHEMY_ID;

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon],
  [alchemyProvider({ alchemyId }), publicProvider()]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export default function Home() {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <Container />
      </ChakraProvider>
    </WagmiConfig>
  );
}
