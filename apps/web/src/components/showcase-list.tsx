"use client";

import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import { ShowcaseItem } from "./showcase-item";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const ShowcaseList = () => {
  const [supply, setSupply] = useState(0);
  const [columnCount, setColumnCount] = useState(4); // Default column count

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
          <div
            className="w-full"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
              gap: "16px", // Adjust gap as needed
            }}
          >
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
