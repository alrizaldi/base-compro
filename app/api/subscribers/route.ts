import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";
import dbConnect from "@/lib/db/connect";
import Subscriber from "@/lib/db/models/Subscriber";

// GET /api/subscribers - Admin list (paginated, searchable)
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [subscribers, total] = await Promise.all([
      Subscriber.find(query).sort({ subscribedAt: -1 }).skip(skip).limit(limit),
      Subscriber.countDocuments(query),
    ]);

    return NextResponse.json({
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/subscribers - Public subscribe
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.status === "unsubscribed") {
        // Reactivate
        existing.status = "active";
        if (name) existing.name = name;
        await existing.save();
        return NextResponse.json({
          message: "Successfully resubscribed",
          data: existing,
        });
      }
      return NextResponse.json({
        message: "Already subscribed",
        data: existing,
      });
    }

    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      name: name || "",
      status: "active",
    });

    return NextResponse.json(
      { message: "Successfully subscribed", data: subscriber },
      { status: 201 },
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
