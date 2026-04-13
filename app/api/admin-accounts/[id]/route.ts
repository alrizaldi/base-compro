import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import { checkAuth } from "@/lib/auth/middleware";

// PUT /api/admin-accounts/[id] - Protected
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {
      name: body.name,
      email: body.email,
      role: body.role,
      status: body.status,
    };

    // If password is provided, hash it
    if (body.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(body.password, saltRounds);
    }

    const account = await AdminAccount.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error: any) {
    console.error("Update admin account error:", error);
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

// DELETE /api/admin-accounts/[id] - Protected (super_admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = await params;

    // Get current user from checkAuth to prevent self-deletion
    if (id === user?.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    const account = await AdminAccount.findByIdAndDelete(id);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete admin account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
