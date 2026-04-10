import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import {
  generateToken,
  getAuthCookieOptions,
  AUTH_COOKIE_NAME,
} from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await AdminAccount.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (user.status === "suspended") {
      return NextResponse.json(
        { error: "Account has been suspended" },
        { status: 403 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Update last active timestamp
    user.lastActiveAt = new Date();
    await user.save();

    const userJson = user.toJSON();

    const token = generateToken({
      id: userJson.id,
      email: userJson.email,
      role: userJson.role,
    });

    console.log("[Login] Generated token for:", userJson.email);
    console.log("[Login] Token:", token.substring(0, 50) + "...");

    const response = NextResponse.json({
      user: {
        id: userJson.id,
        name: userJson.name,
        email: userJson.email,
        role: userJson.role,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    console.log("[Login] Cookie set successfully");

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
