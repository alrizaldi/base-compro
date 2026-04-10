import { NextResponse } from "next/server";
import { getAuthCookieOptions, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
  return response;
}
