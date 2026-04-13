import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import { checkAuth } from "@/lib/auth/middleware";

// GET /api/testimonials/[id] - Public
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(testimonial.toJSON());
  } catch (error) {
    console.error("Get testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/testimonials/[id] - Protected
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(request))) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        name: body.name,
        role: body.role,
        content: body.content,
        avatar: body.avatar,
        rating: parseInt(body.rating),
      },
      { new: true, runValidators: true },
    );

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(testimonial.toJSON());
  } catch (error) {
    console.error("Update testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/testimonials/[id] - Protected
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(request))) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = await params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
