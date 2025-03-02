// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile"];

// Public routes that should redirect to dashboard if already authenticated
const publicAuthRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Check if the path is a public auth route
  const isPublicAuthRoute = publicAuthRoutes.some((route) => path === route);

  // Get the session token from cookies
  const authToken = request.cookies.get("auth_token")?.value;

  // If the route is protected and there's no token, redirect to login
  if (isProtectedRoute && !authToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // If the route is a public auth route and there's a token, redirect to dashboard
  if (isPublicAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
