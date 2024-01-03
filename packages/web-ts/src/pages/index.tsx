import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import Image from "next/image";
import dynamic from "next/dynamic";
import InfiniteScroll from "react-infinite-scroller";

const DrawSheet = dynamic(() => import("./components/Container"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>nicepfp.art</title>
        <meta name="description" content="Simple. Free. Unlimited. Forever." />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="flex w-full flex-col items-center gap-2 lg:w-fit lg:flex-row lg:items-start lg:gap-4 lg:p-10">
          <DrawSheet />
          <Welcome />
        </div>
        <div className="flex w-fit grid-cols-3 flex-col items-center gap-4 lg:grid">
          <CardWhat />
          <CardWhy />
          <CardHowMuch />
          <CardHow />
          <CardSource />
          <CardThanks />
        </div>
        <Showcase />
        <MadeBy />
      </main>
    </>
  );
};

export default Home;

const Welcome = () => {
  return (
    <div className="flex flex-col items-center lg:items-end">
      <div className="flex flex-col items-center lg:items-end">
        <p className="text-[36px] font-extrabold text-gray-800 lg:text-[96px]">
          Welcome to{" "}
        </p>
        <p className="bg-purple-200 text-[36px] font-extralight text-purple-800 lg:text-[96px]">
          nicepfp.art
        </p>
      </div>
      <p className="mt-8 w-4/5 text-xl font-light text-gray-700 lg:w-full">
        I needed a nice profile picture for my Twitter, so I made this.
      </p>
      <p className="w-4/5 text-xl font-light text-gray-700 lg:w-full">
        Simple. Free. Unlimited. Forever.
      </p>
    </div>
  );
};

const CardWhat = () => {
  return (
    <div className="flex h-[200px] w-[300px] flex-col gap-4 rounded-md border border-gray-100 bg-white p-4 drop-shadow-sm">
      <p className="font-bold text-gray-800">What is this thing?</p>
      <p className="font-light text-gray-700">
        This website uses machine learning to generate a unique doodle. It can
        be minted as NFT and be used as a profile picture.
      </p>
    </div>
  );
};

const CardWhy = () => {
  return (
    <div className="flex h-[200px] w-[300px] flex-col gap-4 rounded-md border border-gray-100 bg-white p-4 drop-shadow-sm">
      <p className="font-bold text-gray-800">Why does it exist?</p>
      <p className="font-light text-gray-700">
        Because I like web3, building things and I needed a profile pic.
      </p>
    </div>
  );
};

const CardHowMuch = () => {
  return (
    <div className="flex h-[200px] w-[300px] flex-col gap-4 rounded-md border border-gray-100 bg-white p-4 drop-shadow-sm">
      <p className="font-bold text-gray-800">How much does it cost?</p>
      <p className="font-light text-gray-700">
        Minting is and will always remain free. The only thing you are paying is
        the gas fee.
      </p>
    </div>
  );
};

const CardHow = () => {
  return (
    <div className="flex h-[200px] w-[300px] flex-col  gap-4 rounded-md border border-gray-100 bg-white p-4 drop-shadow-sm">
      <p className="font-bold text-gray-800">How is it generated?</p>
      <p className="font-light text-gray-700">
        The doodles are generated by a recurrent neural network model trained on
        millions of doodles collected from the{" "}
        <Link className="underline" href={"https://quickdraw.withgoogle.com/"}>
          Quick, Draw! game.
        </Link>
      </p>
    </div>
  );
};

const CardSource = () => {
  return (
    <div className="flex h-[200px] w-[300px] flex-col gap-4 rounded-md border border-gray-100 bg-white p-4 drop-shadow-sm">
      <p className="font-bold text-gray-800">
        Where can I find the source code?
      </p>
      <p className="font-light text-gray-700">
        The code is available on my{" "}
        <Link
          className="underline"
          href="https://github.com/andreivdev/nicepfp.art"
        >
          Github page
        </Link>
        . The contract is available{" "}
        <Link
          className="underline"
          href="https://polygonscan.com/address/0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34#code"
        >
          here
        </Link>
        .
      </p>
    </div>
  );
};

const CardThanks = () => {
  return (
    <div className="flex h-[200px] w-[300px] flex-col gap-4 rounded-md border border-gray-100 bg-white p-4 drop-shadow-sm">
      <p className="font-bold text-gray-800">Thanks to</p>
      <p className="font-light text-gray-700">
        <Link className="underline" href={"https://nextjs.org/"}>
          next.js
        </Link>
        ,{" "}
        <Link className="underline" href={"https://reactjs.org/"}>
          react
        </Link>
        ,{" "}
        <Link className="underline" href={"https://p5js.org/"}>
          p5
        </Link>
        ,{" "}
        <Link className="underline" href={"https://ml5js.org/"}>
          ml5
        </Link>
        ,{" "}
        <Link className="underline" href={"https://quickdraw.withgoogle.com/"}>
          Quick, draw
        </Link>
        ,{" "}
        <Link className="underline" href={"https://docs.ethers.io/v5/"}>
          ethers
        </Link>
        ,{" "}
        <Link className="underline" href={"https://wagmi.sh"}>
          wagmi
        </Link>{" "}
        and{" "}
        <Link className="underline" href={"https://hardhat.org/"}>
          hardhat
        </Link>
      </p>
    </div>
  );
};

const Showcase = () => {
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
    <div className="flex w-8/12 flex-col gap-4 rounded-md border border-gray-100 bg-white p-4 font-light drop-shadow-sm">
      <span>
        {supply} very nice pfps -{" "}
        <Link
          className="underline"
          href="https://opensea.io/collection/nicepfp-art"
        >
          View OpenSea collection
        </Link>
      </span>

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
              .map((x, i) => <Mint key={supply - i - 1} id={supply - i - 1} />)}
        </div>
      </InfiniteScroll>
    </div>
  );
};

const Mint = (props: { id: number }) => {
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
        });
    }
  }, [getTokenUri]);

  return (
    <div className="w-fit rounded-sm border shadow-md">
      <Image src={image} width={150} height={150} alt={""} />
    </div>
  );
};

const MadeBy = () => {
  return (
    <div className="p-6 font-light text-gray-400">
      with 💖 by{" "}
      <span className="bg-purple-200 text-purple-800">andreiv.eth</span>
    </div>
  );
};
