"use client"

import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [publicProvider()],
);

const config = createConfig({
  connectors: [new InjectedConnector({ chains })],
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});


export const Web3Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <WagmiConfig config={config}>
    {children}
  </WagmiConfig>
}
