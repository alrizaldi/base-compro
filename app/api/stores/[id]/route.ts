import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Store from "@/lib/db/models/Store";
import { requireAuth } from "@/lib/auth/middleware";

// GET /api/stores/[id] - Public
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const store = await Store.findById(id);

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(store.toJSON());
  } catch (error) {
    console.error("Get store error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/stores/[id] - Protected
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResponse = await requireAuth(request);
  if (authResponse.status !== 200 && authResponse.status !== 302) {
    return authResponse;
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const store = await Store.findByIdAndUpdate(
      id,
      {
        name: body.name,
        address: body.address,
        city: body.city,
        phone: body.phone,
        image: body.image,
      },
      { new: true, runValidators: true },
    );

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(store.toJSON());
  } catch (error) {
    console.error("Update store error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/stores/[id] - Protected
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResponse = await requireAuth(request);
  if (authResponse.status !== 200 && authResponse.status !== 302) {
    return authResponse;
  }

  try {
    await dbConnect();
    const { id } = await params;

    const store = await Store.findByIdAndDelete(id);

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Delete store error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
