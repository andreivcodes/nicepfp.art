import React from "react";
import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { createClient, configureChains, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { chains, provider } = configureChains(
  [polygon],
  [infuraProvider({ apiKey: "d016860a553a488dbeef68617d54acdc" })]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
      <Analytics />
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
