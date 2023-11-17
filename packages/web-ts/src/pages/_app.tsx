import React from "react";
import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

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

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
      <Analytics />
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
