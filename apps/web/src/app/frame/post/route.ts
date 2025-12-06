import { POST as framesPost } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return framesPost(req, NextResponse);
}
