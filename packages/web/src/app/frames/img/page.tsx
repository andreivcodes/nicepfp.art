"use client"

import { setup, draw } from "@/lib/sketch";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5"), { ssr: false });
const isServer = () => typeof window === "undefined";

export default function Home() {
  return <Sketch setup={setup} draw={draw} />
}
