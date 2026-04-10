import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import ContactSubmission from "@/lib/db/models/ContactSubmission";
import { requireAuth } from "@/lib/auth/middleware";

// POST /api/contacts - Public (submit contact form)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const contact = await ContactSubmission.create({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      status: "unread",
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Create contact error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/contacts - Protected (admin view)
export async function GET(request: NextRequest) {
  const authResponse = await requireAuth(request);
  if (authResponse.status !== 200 && authResponse.status !== 302) {
    return authResponse;
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await ContactSubmission.countDocuments(query);
    const contacts = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      data: contacts.map((c) => c.toJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
