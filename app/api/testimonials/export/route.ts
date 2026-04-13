import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";
import dbConnect from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import * as XLSX from "xlsx";

// GET /api/testimonials/export - Export testimonials as Excel
export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "ID",
      "Name",
      "Role",
      "Content",
      "Rating",
      "Avatar URL",
      "Created At",
    ];
    const rows = testimonials.map((t) => [
      t._id.toString(),
      t.name,
      t.role,
      t.content,
      t.rating,
      t.avatar || "",
      new Date(t.createdAt).toISOString(),
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [
      { wch: 26 },
      { wch: 20 },
      { wch: 20 },
      { wch: 60 },
      { wch: 10 },
      { wch: 40 },
      { wch: 25 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Testimonials");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="testimonials.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export testimonials error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/testimonials/import - Import testimonials from Excel
export async function POST(request: NextRequest) {
  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    });

    if (jsonData.length < 2)
      return NextResponse.json(
        { error: "Excel file is empty" },
        { status: 400 },
      );

    const dataRows = jsonData.slice(1);
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = i + 2;
      try {
        const id = String(row[0] || "").trim();
        const name = String(row[1] || "").trim();
        const role = String(row[2] || "").trim();
        const content = String(row[3] || "").trim();
        const rating = parseInt(row[4]);
        const avatar = String(row[5] || "").trim();

        if (!name || !role || !content || isNaN(rating)) {
          results.failed++;
          results.errors.push(`Row ${rowNum}: Missing required fields`);
          continue;
        }

        let existing = null;
        if (id && id.length === 24) existing = await Testimonial.findById(id);

        if (existing) {
          await Testimonial.updateOne(
            { _id: id },
            { name, role, content, rating, avatar },
          );
          results.updated++;
        } else {
          await Testimonial.create({ name, role, content, rating, avatar });
          results.created++;
        }
      } catch (err) {
        results.failed++;
        results.errors.push(
          `Row ${rowNum}: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    }

    return NextResponse.json({
      message: `Import complete: ${results.created} created, ${results.updated} updated, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Import testimonials error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
