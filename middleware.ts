import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const AUTH_COOKIE_NAME = "admin_auth_token";
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-this";

function verifyToken(
  token: string,
): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the auth token
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Verify token if it exists
  let isValidToken = false;
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      isValidToken = true;
    }
  }

  console.log(
    `[Middleware] ${pathname} - Token: ${!!token}, Valid: ${isValidToken}`,
  );

  // If on login page
  if (pathname === "/admin/login") {
    // If authenticated, redirect to admin dashboard
    if (isValidToken) {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
    // Not authenticated, allow access to login page
    return NextResponse.next();
  }

  // For all other admin routes, require authentication
  if (!isValidToken) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated and accessing admin routes - allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
