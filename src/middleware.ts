import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/cadastro", "/aguardando-ativacao"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/api"))) {
    return NextResponse.next();
  }

  // For protected routes, we rely on client-side auth check in DashboardLayout
  // (Firebase token validation server-side requires Admin SDK)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};