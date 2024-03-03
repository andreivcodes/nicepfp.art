import { db } from "@nicepfp/db";
import { NextResponse } from "next/server";

export async function POST() {
  await db.deleteFrom('minters').execute();
  return NextResponse.json({ message: 'done' }, { status: 200 })
}
