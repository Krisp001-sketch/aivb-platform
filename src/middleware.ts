// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Updated import path

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const authHeader = req.headers.get("authorization");

    // Secret Key Check (Set ADMIN_SECRET_KEY in your .env.local file)
    const adminSecret = process.env.ADMIN_SECRET_KEY || "aivb-admin-secret-2026";
    const querySecret = req.nextUrl.searchParams.get("secret");

    if (querySecret !== adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return new NextResponse("Unauthorized Access to Admin Panel", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};