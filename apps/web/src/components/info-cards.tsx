import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const InfoCards = () => {
  return (
    <div className="flex w-fit grid-cols-3 flex-col items-center gap-4 lg:grid">
      <CardWhat />
      <CardWhy />
      <CardHowMuch />
      <CardHow />
      <CardSource />
      <CardThanks />
    </div>
  );
};

const CardWhat = () => {
  return (
    <Card className="h-[200px] w-[300px]">
      <CardHeader>
        <CardTitle className="text-md">What&apos;s this?</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        This site uses machine learning to craft unique doodles, mintable as NFTs for profile pics.
      </CardContent>
    </Card>
  );
};

const CardWhy = () => {
  return (
    <Card className="h-[200px] w-[300px]">
      <CardHeader>
        <CardTitle className="text-md">Why does it exist?</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        I&apos;m passionate about building stuff, web3, and needed a profile pic.
      </CardContent>
    </Card>
  );
};

const CardHowMuch = () => {
  return (
    <Card className="h-[200px] w-[300px]">
      <CardHeader>
        <CardTitle className="text-md">Cost?</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">Minting will always be free; you&apos;ll only cover the gas fee.</CardContent>
    </Card>
  );
};

const CardHow = () => {
  return (
    <Card className="h-[200px] w-[300px]">
      <CardHeader>
        <CardTitle className="text-md">How&apos;s it made?</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        The doodles are generated by a recurrent neural network model trained on millions of doodles collected from the{" "}
        <Link className="underline" href={"https://quickdraw.withgoogle.com/"}>
          Quick, Draw! game.
        </Link>
      </CardContent>
    </Card>
  );
};

const CardSource = () => {
  return (
    <Card className="h-[200px] w-[300px]">
      <CardHeader>
        <CardTitle className="text-md">Source code?</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        Find it on my{" "}
        <Link className="underline" href="https://github.com/andreivdev/nicepfp.art">
          Github page
        </Link>
        . The contract is{" "}
        <Link
          className="underline"
          href="https://polygonscan.com/address/0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34#code"
        >
          here
        </Link>
        .
      </CardContent>
    </Card>
  );
};

const CardThanks = () => {
  return (
    <Card className="h-[200px] w-[300px]">
      <CardHeader>
        <CardTitle className="text-md">Thanks to</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
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
      </CardContent>
    </Card>
  );
};
