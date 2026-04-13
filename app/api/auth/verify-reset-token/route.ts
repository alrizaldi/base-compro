import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 },
      );
    }

    // Find all users with non-null, non-expired reset tokens
    const usersWithTokens = await AdminAccount.find({
      resetToken: { $ne: null },
      resetTokenExpiry: { $gt: new Date() },
    });

    // Check if token matches any user
    let isValid = false;
    for (const user of usersWithTokens) {
      const tokenMatches = await bcrypt.compare(token, user.resetToken!);
      if (tokenMatches) {
        isValid = true;
        break;
      }
    }

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "Token is valid" : "Invalid or expired token",
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
