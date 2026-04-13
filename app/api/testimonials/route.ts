import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import { checkAuth } from "@/lib/auth/middleware";

// GET /api/testimonials - Public
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Testimonial.countDocuments(query);
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      data: testimonials.map((t) => t.toJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get testimonials error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/testimonials - Protected
export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const body = await request.json();

    const testimonial = await Testimonial.create({
      name: body.name,
      role: body.role,
      content: body.content,
      avatar: body.avatar,
      rating: parseInt(body.rating),
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
