import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import { requireAuth } from "@/lib/auth/middleware";

// GET /api/products - Public (with pagination)
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
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Convert to JSON to apply the _id -> id transform
    const productsJson = products.map((p) => p.toJSON());

    return NextResponse.json({
      data: productsJson,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/products - Protected
export async function POST(request: NextRequest) {
  const authResponse = await requireAuth(request);
  if (authResponse.status !== 200 && authResponse.status !== 302) {
    return authResponse;
  }

  try {
    await dbConnect();
    const body = await request.json();

    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      images: body.images || [],
      ecommerceLinks: body.ecommerceLinks || [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
