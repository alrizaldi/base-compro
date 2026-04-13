import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import ContactSubmission from "@/lib/db/models/ContactSubmission";
import * as XLSX from "xlsx";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-this";
const AUTH_COOKIE_NAME = "admin_auth_token";

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await AdminAccount.findById(decoded.id);
    return user && user.status === "active";
  } catch {
    return false;
  }
}

// GET /api/contacts/export - Export contacts as Excel
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await dbConnect();
    const contacts = await ContactSubmission.find().sort({ createdAt: -1 }).lean();

    const headers = ["Name", "Email", "Subject", "Message", "Status", "Created At"];
    const rows = contacts.map((c) => [
      c.name,
      c.email,
      c.subject,
      c.message,
      c.status,
      new Date(c.createdAt).toISOString(),
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [{ wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 60 }, { wch: 12 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="contacts.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export contacts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
