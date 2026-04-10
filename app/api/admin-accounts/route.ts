import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import { requireAuth } from "@/lib/auth/middleware";

// GET /api/admin-accounts - Protected (super_admin only)
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
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await AdminAccount.countDocuments(query);
    const accounts = await AdminAccount.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    return NextResponse.json({
      data: accounts.map((a) => a.toJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get admin accounts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/admin-accounts - Protected (super_admin only)
export async function POST(request: NextRequest) {
  const authResponse = await requireAuth(request);
  if (authResponse.status !== 200 && authResponse.status !== 302) {
    return authResponse;
  }

  try {
    await dbConnect();
    const body = await request.json();

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const account = await AdminAccount.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role || "admin",
      status: body.status || "active",
    });

    // Return without password
    const result = account.toObject();
    delete (result as any).password;

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Create admin account error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
