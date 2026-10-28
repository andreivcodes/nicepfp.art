"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import { Card, CardContent } from "./ui/card";

// Token URIs and metadata point at https://ipfs.io/ipfs/<cid>, but ipfs.io was
// switched to a service-worker-only gateway on 2026-09-21 and answers every
// request with 429, so read the CIDs through a gateway that still serves them.
const IPFS_GATEWAY = (process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/").replace(/\/?$/, "/");

// Accepts ipfs://<cid>, https://<any gateway>/ipfs/<cid> or a bare CID.
const toGatewayUrl = (uri: string) => {
  const path = uri.replace(/^ipfs:\/\//, "").replace(/^https?:\/\/[^/]+\/ipfs\//, "");
  return `${IPFS_GATEWAY}${path}`;
};

const ignoreList = [302];
export const ShowcaseItem = (props: { id: number }) => {
  const getTokenUri = useReadContract({
    address: "0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34",
    abi: contractJson.abi,
    functionName: "tokenURI",
    args: [props.id],
    chainId: 137,
  });

  const [image, setImage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const tokenUri = getTokenUri.data as string | undefined;
  useEffect(() => {
    if (!tokenUri) return;
    let cancelled = false;
    fetch(toGatewayUrl(tokenUri))
      .then((response) => {
        if (!response.ok) throw new Error(`metadata request failed with ${response.status}`);
        return response.json();
      })
      .then((data: { image?: unknown }) => {
        if (typeof data.image !== "string") throw new Error("metadata has no image");
        if (!cancelled) setImage(toGatewayUrl(data.image));
      })
      .catch((e) => {
        console.warn(`Showcase token ${props.id}:`, e);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [tokenUri, props.id]);

  // Skip tokens whose metadata or image can't be loaded instead of showing a
  // broken image.
  if (ignoreList.includes(props.id) || failed || getTokenUri.isError || !image) return null;

  return (
    <Card className="m-2">
      <CardContent className="flex flex-col items-center justify-center">
        {/* Plain img: these are tiny PNGs straight from the gateway, there is
            nothing to gain from proxying them through /_next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          width={150}
          height={150}
          alt={`nicepfp #${props.id}`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </CardContent>
    </Card>
  );
};
