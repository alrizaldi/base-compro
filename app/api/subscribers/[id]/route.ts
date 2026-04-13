import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";
import dbConnect from "@/lib/db/connect";
import Subscriber from "@/lib/db/models/Subscriber";

// PATCH /api/subscribers/[id]/status - Toggle subscriber status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["active", "unsubscribed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const subscriber = await Subscriber.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: subscriber });
  } catch (error) {
    console.error("Update subscriber status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/subscribers/[id] - Delete subscriber
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { id } = await params;

    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Subscriber deleted" });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
