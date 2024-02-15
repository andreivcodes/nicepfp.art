import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";


export async function GET(req: NextRequest) {
  const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://browserless.nicepfp.art/' })

  const page = await browser.newPage();
  await page.goto("https://nicepfp.art/frames/img", { waitUntil: ["networkidle0"] });

  await sleep(1000)

  const data = await page.evaluate(() => {
    let data: string | undefined = "";
    const canvas = document.querySelector<HTMLCanvasElement>('#defaultCanvas0');
    if (canvas !== null)
      data = canvas.toDataURL();

    return data;
  });

  console.log({ data })

  return NextResponse.json({ data });
}

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));
