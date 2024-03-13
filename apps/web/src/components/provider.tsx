"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, createConfig, WagmiProvider } from "wagmi";
import { polygon } from "wagmi/chains";

export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
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
