import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import Article from "@/lib/db/models/Article";
import * as XLSX from "xlsx";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-this";
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

// GET /api/articles/export - Export articles as Excel file
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();

    // Fetch all articles
    const articles = await Article.find().sort({ createdAt: -1 }).lean();

    // Prepare data for Excel
    const headers = [
      "ID",
      "Title",
      "Author",
      "Content",
      "Image URL",
      "Published",
      "Created At",
    ];

    const rows = articles.map((article) => [
      article._id.toString(),
      article.title,
      article.author,
      article.content,
      article.image || "",
      article.published ? "Yes" : "No",
      new Date(article.createdAt).toISOString(),
    ]);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = [
      { wch: 26 }, // ID
      { wch: 30 }, // Title
      { wch: 20 }, // Author
      { wch: 60 }, // Content
      { wch: 50 }, // Image URL
      { wch: 12 }, // Published
      { wch: 25 }, // Created At
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Articles");

    // Generate Excel file buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="articles.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export articles error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
