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

    console.log(
      `[Broadcast] Found ${activeSubscribers.length} active subscribers`,
    );
    activeSubscribers.forEach((s, i) =>
      console.log(`  [${i + 1}] ${s.email} (${s.name || "no name"})`),
    );

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
        console.log(`[Broadcast] Sending to ${subscriber.email}...`);
        const emailResult = await sendAnnouncementEmail({
          to: subscriber.email,
          name: subscriber.name || "Subscriber",
          subject,
          body: emailBody,
          unsubscribeToken: subscriber._id.toString(),
        });

        if (emailResult.success) {
          results.sent++;
          console.log(
            `[Broadcast] ✓ Sent to ${subscriber.email} (msg: ${emailResult.messageId})`,
          );
        } else {
          results.failed++;
          console.error(
            `[Broadcast] ✗ Failed ${subscriber.email}:`,
            emailResult.error,
          );
          results.errors.push(
            `${subscriber.email}: ${emailResult.error || "Unknown error"}`,
          );
        }
      } catch (err) {
        results.failed++;
        console.error(`[Broadcast] ✗ Error ${subscriber.email}:`, err);
        results.errors.push(`${subscriber.email}: Failed to send`);
      }
    }

    console.log(
      `[Broadcast] Complete: ${results.sent} sent, ${results.failed} failed`,
    );

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
