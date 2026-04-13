import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Store from "@/lib/db/models/Store";
import { checkAuth } from "@/lib/auth/middleware";

// GET /api/stores - Public
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
        { city: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Store.countDocuments(query);
    const stores = await Store.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      data: stores.map((s) => s.toJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get stores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/stores - Protected
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

    const store = await Store.create({
      name: body.name,
      address: body.address,
      city: body.city,
      phone: body.phone,
      image: body.image,
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("Create store error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
