"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useContractWrite, useNetwork, usePrepareContractWrite, useSwitchNetwork } from "wagmi";
import { setup, draw, startDrawing, captureFrame } from "../lib/sketch";
import contractJson from "../abi/nicepfp.json";
import { Brush } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";
import { getIpfs } from "@/app/actions";
const Sketch = dynamic(() => import("react-p5"), { ssr: false });
const isServer = () => typeof window === "undefined";

export default function Container() {
  return (
    <Card className="p-1 md:min-h-[512px] md:min-w-[512px]">
      {!isServer() && (
        <CardContent className="flex flex-col gap-2 p-1">
          <div className="md:min-h-[512px] md:min-w-[512px]">
            <Sketch setup={setup} draw={draw} />
          </div>
          <Button
            className="h-12 w-12 self-end bg-purple-500 px-2 py-2 font-bold hover:bg-purple-700 active:bg-purple-600"
            onClick={() => {
              startDrawing();
            }}
          >
            <Brush color="white" />
          </Button>

          <MintButton />
        </CardContent>
      )}
    </Card>
  );
}

const MintButton = () => {
  const [ipfsData, setIpfsData] = useState({ path: "", signature: "" });
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: "0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34",
    abi: contractJson.abi,
    functionName: "safeMint",
    args: [address, ipfsData.path, ipfsData.signature],
    enabled: true,
    chainId: 137,
  });
  const contractWrite = useContractWrite(config);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contractWrite.isError || contractWrite.isSuccess) setLoading(false);
    if (ipfsData && ipfsData.path && contractWrite.isIdle && !contractWrite.isError) {
      contractWrite.write?.();
    }
  }, [config, contractWrite.isError, contractWrite.isSuccess, ipfsData.signature, ipfsData.path]);

  useEffect(() => {
    if (chain && chain.id !== 137 && switchNetwork) {
      switchNetwork(137);
    }
  }, [chain, switchNetwork]);

  useEffect(() => {
    console.log(ipfsData);
  }, [ipfsData]);

  const handleMintButtonClick = () => {
    setLoading(true);

    const run = async (img: string) => {
      let data = await getIpfs(img);
      setIpfsData(data);
    };

    const image = captureFrame();
    run(image);
  };

  if (!isConnected)
    return (
      <div className="w-full">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            className="w-full rounded bg-purple-500 py-2 font-bold text-white hover:bg-purple-700 active:bg-purple-600"
            disabled={!connector.ready}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
          </Button>
        ))}
        {error && <div>{error.message}</div>}
      </div>
    );

  return (
    <button
      className="w-full rounded bg-purple-500 py-2 font-bold text-white hover:bg-purple-700"
      disabled={loading}
      onClick={handleMintButtonClick}
    >
      {loading ? "Loading..." : "Mint"}
    </button>
  );
};
