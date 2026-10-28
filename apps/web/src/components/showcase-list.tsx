"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import { ShowcaseItem } from "./showcase-item";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// The public IPFS gateways (ipfs.io, dweb.link, Pinata's shared gateway) no
// longer serve this collection's metadata to browsers, so each tile's two
// requests only fail. Render the tiles only when a dedicated gateway is set.
const SHOW_TOKEN_IMAGES = Boolean(process.env.NEXT_PUBLIC_IPFS_GATEWAY);

export const ShowcaseList = () => {
  const [supply, setSupply] = useState(0);

  const totalSupply = useReadContract({
    address: "0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34",
    abi: contractJson.abi,
    functionName: "totalSupply",
  });

  useEffect(() => {
    if (totalSupply.isSuccess) setSupply(Number(totalSupply.data));
  }, [totalSupply]);

  return (
    <div className="w-full px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-light">
            {supply} very nice pfps -{" "}
            <a
              className="underline"
              href="https://opensea.io/collection/nicepfp-art"
              target="_blank"
              rel="noopener noreferrer"
            >
              View OpenSea collection
            </a>
          </CardTitle>
        </CardHeader>

        {SHOW_TOKEN_IMAGES && (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: supply }, (_, id) => (
                <ShowcaseItem key={id} id={id} />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
