import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";
import dbConnect from "@/lib/db/connect";
import Store from "@/lib/db/models/Store";
import * as XLSX from "xlsx";

// GET /api/stores/export - Export stores as Excel
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await dbConnect();
    const stores = await Store.find().sort({ createdAt: -1 }).lean();

    const headers = [
      "ID",
      "Name",
      "Address",
      "City",
      "Phone",
      "Image URL",
      "Created At",
    ];
    const rows = stores.map((s) => [
      s._id.toString(),
      s.name,
      s.address,
      s.city,
      s.phone,
      s.image || "",
      new Date(s.createdAt).toISOString(),
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [
      { wch: 26 },
      { wch: 25 },
      { wch: 40 },
      { wch: 20 },
      { wch: 20 },
      { wch: 40 },
      { wch: 25 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Stores");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="stores.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export stores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/stores/import - Import stores from Excel
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth(request))) {
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
        const address = String(row[2] || "").trim();
        const city = String(row[3] || "").trim();
        const phone = String(row[4] || "").trim();
        const image = String(row[5] || "").trim();

        if (!name || !address || !city || !phone) {
          results.failed++;
          results.errors.push(`Row ${rowNum}: Missing required fields`);
          continue;
        }

        let existing = null;
        if (id && id.length === 24) existing = await Store.findById(id);

        if (existing) {
          await Store.updateOne(
            { _id: id },
            { name, address, city, phone, image },
          );
          results.updated++;
        } else {
          await Store.create({ name, address, city, phone, image });
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
    console.error("Import stores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
