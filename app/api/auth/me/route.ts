import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(null, { status: 200 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(null, { status: 200 });
    }

    const user = await AdminAccount.findById(decoded.id);

    if (!user || user.status !== "active") {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(user.toJSON());
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
