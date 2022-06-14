import { NextRequest, NextResponse } from "next/server";

export async function middleware(req) {
  const role = req.headers.get("authorization");

  if (role !== process.env.AUTH_ROLE) {
    return new Response(JSON.stringify({ message: "Not authenticated." }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.next();
}
