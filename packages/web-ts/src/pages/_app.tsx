import React from "react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { createClient, configureChains, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { chains, provider } = configureChains(
  [polygon],
  [infuraProvider({ apiKey: "af33f32b580f4c4485f51a82ad8ba578" })]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
      <Analytics />
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
