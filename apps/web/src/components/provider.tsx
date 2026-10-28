"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fallback, http, createConfig, WagmiProvider } from "wagmi";
import { polygon } from "wagmi/chains";

// viem's built-in Polygon RPC (polygon-rpc.com) now rejects unauthenticated
// requests with 401, which left the showcase at "0 very nice pfps" and made
// every mint simulation fail. Use public endpoints that allow browser CORS,
// falling through to the next one if a provider is down or rate limiting.
const POLYGON_RPC_URLS = [
  "https://polygon-bor-rpc.publicnode.com",
  "https://polygon.drpc.org",
  "https://1rpc.io/matic",
];

export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: fallback(POLYGON_RPC_URLS.map((url) => http(url))),
  },
});

const queryClient = new QueryClient();

export const Web3Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>{" "}
    </WagmiProvider>
  );
};
