"use client";

import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import { ShowcaseItem } from "./showcase-item";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const ShowcaseList = () => {
  const [supply, setSupply] = useState(0);

  const totalSupply = useContractRead({
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

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: supply }, (_, id) => (
              <div key={id} className="p-2">
                <ShowcaseItem id={id} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
