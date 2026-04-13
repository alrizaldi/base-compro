import { NextRequest, NextResponse } from "next/server";
import {
  verifyToken,
  getAuthCookieOptions,
  AUTH_COOKIE_NAME,
} from "@/lib/auth/jwt";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

// Throw if JWT_SECRET is not set in production
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

/**
 * Middleware to protect API routes that require authentication.
 * Verifies the JWT cookie and attaches user info to the request.
 * Also implements sliding expiration by refreshing the cookie on each request.
 */
export async function requireAuth(request: NextRequest) {
  await dbConnect();

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    const response = NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      ...getAuthCookieOptions(),
      maxAge: 0,
    });
    return response;
  }

  // Check if user still exists and is active
  const user = await AdminAccount.findById(decoded.id);

  if (!user || user.status !== "active") {
    const response = NextResponse.json(
      { error: "Account not found or suspended" },
      { status: 401 },
    );
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      ...getAuthCookieOptions(),
      maxAge: 0,
    });
    return response;
  }

  // Sliding expiration: refresh the token on each valid request
  const jwt = await import("jsonwebtoken");
  const newToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: "6h" },
  );

  // Return success with refreshed cookie
  const response = NextResponse.next();
  response.cookies.set(AUTH_COOKIE_NAME, newToken, getAuthCookieOptions());

  // Attach user info to request headers for downstream access
  response.headers.set("X-User-Id", user.id);
  response.headers.set("X-User-Email", user.email);
  response.headers.set("X-User-Role", user.role);

  return response;
}

/**
 * Lightweight auth check for App Router route handlers.
 * Returns true if authenticated, false otherwise. Does NOT return responses.
 */
export async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const decoded = verifyToken(token) as { id: string };
    await dbConnect();
    const user = await AdminAccount.findById(decoded.id);
    return user && user.status === "active";
  } catch {
    return false;
  }
}

/**
 * Get current user from request cookies (for server components).
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  await dbConnect();
  const user = await AdminAccount.findById(decoded.id).lean();

  if (!user || user.status !== "active") return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
