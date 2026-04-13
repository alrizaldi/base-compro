import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import AboutContent from "@/lib/db/models/AboutContent";
import { checkAuth } from "@/lib/auth/middleware";

// GET /api/about - Public
export async function GET() {
  try {
    await dbConnect();

    const about = await AboutContent.findOne();

    if (!about) {
      return NextResponse.json(
        { error: "About content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(about.toJSON());
  } catch (error) {
    console.error("Get about error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/about - Protected
export async function PUT(request: NextRequest) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const body = await request.json();

    let about = await AboutContent.findOne();

    if (!about) {
      about = await AboutContent.create(body);
    } else {
      about = await AboutContent.findByIdAndUpdate(about._id, body, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json(about.toJSON());
  } catch (error) {
    console.error("Update about error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
