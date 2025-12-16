import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken");

  const pathname = req.nextUrl.pathname;

  const protectedRoutes = ["/admin", "/store"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}
