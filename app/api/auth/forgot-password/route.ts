import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import { sendPasswordResetEmail } from "@/lib/email";

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Rate limiting: 3 requests per 10 minutes per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;
    
    if (now - lastRequest < 10 * 60 * 1000) {
      const remaining = 3 - 1;
      if (remaining <= 0) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 },
        );
      }
    }
    
    rateLimitMap.set(ip, now);

    // Clean up old entries (older than 10 minutes)
    for (const [key, timestamp] of rateLimitMap.entries()) {
      if (now - timestamp > 10 * 60 * 1000) {
        rateLimitMap.delete(key);
      }
    }

    // Find user by email
    const user = await AdminAccount.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you'll receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const resetTokenExpiry = new Date(now + 60 * 60 * 1000); // 1 hour

    // Save hashed token to database
    user.resetToken = hashedToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

    // Send email
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });

    if (!emailResult.success) {
      console.error("Failed to send reset email:", emailResult.error);
      // Still return success to user, but log the error
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you'll receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
