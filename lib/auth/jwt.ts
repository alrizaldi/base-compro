import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const JWT_EXPIRATION_HOURS = 6;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

/**
 * Generate a JWT token for an authenticated user.
 * Token expires 6 hours from the time of issue.
 */
export function generateToken(payload: {
  id: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: `${JWT_EXPIRATION_HOURS}h`,
  });
}

/**
 * Verify and decode a JWT token.
 * Returns the decoded payload or null if invalid/expired.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Get cookie options for the auth token.
 * MaxAge is 6 hours in seconds — matches token expiration.
 * Sliding expiration: each request extends the cookie.
 */
export interface AuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
}

export function getAuthCookieOptions(): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: JWT_EXPIRATION_HOURS * 60 * 60, // 6 hours in seconds
  };
}

export const AUTH_COOKIE_NAME = "admin_auth_token";
