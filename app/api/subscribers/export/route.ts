import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";
import dbConnect from "@/lib/db/connect";
import Subscriber from "@/lib/db/models/Subscriber";

// GET /api/subscribers/export - Export subscribers as CSV
export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();

    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });

    // Build CSV
    const headers = ["Email", "Name", "Status", "Subscribed At"];
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || "",
      sub.status,
      new Date(sub.subscribedAt || sub.createdAt).toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="subscribers.csv"',
      },
    });
  } catch (error) {
    console.error("Export subscribers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
