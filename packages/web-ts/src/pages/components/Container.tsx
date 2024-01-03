import React, { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { setup, draw, startDrawing, captureFrame } from "../../utils/sketch";
import dynamic from "next/dynamic";
import contractJson from "../../abi/nicepfp.json";
import { MdOutlineDraw } from "react-icons/md";

const Sketch = dynamic(() => import("react-p5"), { ssr: false });
const isServer = () => typeof window === "undefined";

export default function Container() {
  if (!isServer())
    return (
      <div className="items-center w-fit p-4 lg:p-0 flex flex-col gap-4">
        <div className="relative h-[350px] w-[350px] lg:h-[540px] lg:w-[540px] rounded-md border border-gray-100 bg-white drop-shadow-sm">
          <Sketch setup={setup} draw={draw} />
          <button
            className="text-whiteactive:bg-violet-700 absolute bottom-4 right-4 rounded bg-purple-500 px-2 py-2 font-bold hover:bg-purple-700 active:bg-purple-600"
            onClick={() => {
              startDrawing();
            }}
          >
            <MdOutlineDraw size={30} color="white" />
          </button>
        </div>
        <MintButton />
      </div>
    );
  else return <></>;
}

const MintButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const [path, setPath] = useState("");
  const [signature, setSignature] = useState("");
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: "0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34",
    abi: contractJson.abi,
    functionName: "safeMint",
    args: [address, path, signature],
    enabled: true,
    chainId: 137,
  });
  const contractWrite = useContractWrite(config);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contractWrite.isError) setLoading(false);
    if (contractWrite.isSuccess) setLoading(false);
    if (
      signature.length &&
      path.length &&
      contractWrite.isIdle &&
      !contractWrite.isError
    ) {
      contractWrite.write?.();
    }
  }, [config]);

  useEffect(() => {
    if (chain && chain.id != 137 && switchNetwork) {
      switchNetwork(137);
    }
  }, [chain]);

  if (!isConnected)
    return (
      <div className="w-full">
        {connectors.map((connector) => (
          <button
            className="w-full rounded bg-purple-500 py-2 font-bold text-white hover:bg-purple-700 active:bg-purple-600 w-full"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}

        {error && <div>{error.message}</div>}
      </div>
    );

  return (
    <button
      className="rounded bg-purple-500 py-2 font-bold text-white hover:bg-purple-700 w-full"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        const file = dataURLtoFile(captureFrame(), "file.png");
        const body = new FormData();
        if (file) body.append("file", file);
        fetch("/api/getipfs", {
          method: "POST",
          headers: new Headers({
            Authorization: process.env.NEXT_PUBLIC_AUTH_ROLE ?? "",
          }),
          body,
        })
          .then((response) => response.json())
          .then(async (data) => {
            setPath(data.path);
            setSignature(data.signature);
          });
      }}
    >
      {loading ? "Loading..." : "Mint"}
    </button>
  );
};

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",");
  let u8arr = new Uint8Array(0);

  if (!arr) return;
  if (!arr[0]) return;

  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1] as string);
  let n = bstr.length;
  u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
