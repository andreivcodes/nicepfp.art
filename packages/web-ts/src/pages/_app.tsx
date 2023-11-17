import React from "react";
import { type AppType } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";

const { publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [infuraProvider({ apiKey: "d016860a553a488dbeef68617d54acdc" })]
);
const config = createConfig({
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
