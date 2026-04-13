import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 },
      );
    }

    // Validate password strength (minimum 8 characters)
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Find all users with non-null reset tokens
    const usersWithTokens = await AdminAccount.find({
      resetToken: { $ne: null },
      resetTokenExpiry: { $gt: new Date() },
    });

    // Find the matching user by comparing the token with stored hashed tokens
    let matchedUser = null;
    for (const user of usersWithTokens) {
      const isValid = await bcrypt.compare(token, user.resetToken!);
      if (isValid) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    matchedUser.password = hashedPassword;
    matchedUser.resetToken = null;
    matchedUser.resetTokenExpiry = null;
    await matchedUser.save();

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
