import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import Subscriber from "@/lib/db/models/Subscriber";
import { sendAnnouncementEmail } from "@/lib/email";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-this";
const AUTH_COOKIE_NAME = "admin_auth_token";

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await AdminAccount.findById(decoded.id);
    return user && user.status === "active";
  } catch {
    return false;
  }
}

// POST /api/subscribers/send - Send announcement to all active subscribers
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();

    const body = await request.json();
    const { subject, body: emailBody } = body;

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 },
      );
    }

    // Get all active subscribers
    const activeSubscribers = await Subscriber.find({ status: "active" });

    if (activeSubscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers to send to" },
        { status: 400 },
      );
    }

    const results = { sent: 0, failed: 0, errors: [] as string[] };

    // Send emails one by one (batch sending)
    for (const subscriber of activeSubscribers) {
      try {
        const emailResult = await sendAnnouncementEmail({
          to: subscriber.email,
          name: subscriber.name || "Subscriber",
          subject,
          body: emailBody,
          unsubscribeToken: subscriber._id.toString(),
        });

        if (emailResult.success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(
            `${subscriber.email}: ${emailResult.error || "Unknown error"}`,
          );
        }
      } catch {
        results.failed++;
        results.errors.push(`${subscriber.email}: Failed to send`);
      }
    }

    return NextResponse.json({
      message: `Email sent: ${results.sent} succeeded, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Send announcement error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
