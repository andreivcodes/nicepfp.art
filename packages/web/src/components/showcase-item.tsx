import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import Image from "next/image"
import { Card, CardContent } from "./ui/card";

export const ShowcaseItem = (props: { id: number }) => {
  const getTokenUri = useContractRead({
    address: "0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34",
    abi: contractJson.abi,
    functionName: "tokenURI",
    args: [props.id],
    chainId: 137,
  });

  const [image, setImage] = useState(
    "https://cloudflare-ipfs.com/ipfs/QmXvGx7cxULKeFZmkRQXkPtb3HLxs1cyAg61zAMpbt3Zi7",
  );

  useEffect(() => {
    if (getTokenUri.data) {
      fetch(
        `https://cloudflare-ipfs.com/ipfs/${(getTokenUri.data as string).slice(
          21,
        )}`,
      )
        .then((response) => response.json())
        .then((data) => {
          setImage(
            `https://cloudflare-ipfs.com/ipfs/${(data.image as string).slice(
              21,
            )}`,
          );
        }).catch((e) => console.log(e));
    }
  }, [getTokenUri]);

  return (
    <Card>
      <CardContent className="flex flex-col justify-center items-center">
        <Image src={image} width={150} height={150} alt={""} />
      </CardContent>
    </Card>
  );
};
