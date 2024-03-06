"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useContractRead } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import { ShowcaseItem } from "./showcase-item";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const ShowcaseList = () => {

  const [supply, setSupply] = useState(0);
  const [maxItems, setMaxItems] = useState(12);

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
          <CardTitle className="font-light text-md">
            {supply} very nice pfps -{" "}
            <Link
              className="underline"
              href="https://opensea.io/collection/nicepfp-art"
            >
              View OpenSea collection
            </Link>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => {
              if (maxItems < supply) setMaxItems(maxItems + 24);
            }}
            hasMore={true || false}
          >
            <div className="grid items-center justify-center gap-4 lg:grid-cols-4 2xl:grid-cols-6">
              {supply &&
                [...Array(supply)]
                  .slice(0, maxItems)
                  .map((x, i) => <ShowcaseItem key={supply - i - 1} id={supply - i - 1} />)}
            </div>
          </InfiniteScroll>
        </CardContent>
      </Card>
    </div>
  );
}
