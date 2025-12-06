"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";

const ignoreList = [302];
export const ShowcaseItem = (props: { id: number }) => {
  const getTokenUri = useReadContract({
    address: "0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34",
    abi: contractJson.abi,
    functionName: "tokenURI",
    args: [props.id],
    chainId: 137,
  });

  const [image, setImage] = useState(
    "https://ipfs.io/ipfs/QmXvGx7cxULKeFZmkRQXkPtb3HLxs1cyAg61zAMpbt3Zi7",
  );

  useEffect(() => {
    if (getTokenUri.data) {
      fetch(`https://ipfs.io/ipfs/${(getTokenUri.data as string).slice(21)}`)
        .then((response) => response.json())
        .then((data) => {
          setImage(`https://ipfs.io/ipfs/${(data.image as string).slice(21)}`);
        })
        .catch((e) => console.log(e));
    }
  }, [getTokenUri]);

  if (ignoreList.includes(props.id)) return <></>;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center">
        <Image src={image} width={150} height={150} alt={props.id.toString()} />
      </CardContent>
    </Card>
  );
};
