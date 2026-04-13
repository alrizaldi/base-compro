import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";
import dbConnect from "@/lib/db/connect";
import Article from "@/lib/db/models/Article";
import * as XLSX from "xlsx";

// POST /api/articles/import - Import articles from Excel file
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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { error: "Only .xlsx files are allowed" },
        { status: 400 },
      );
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    });

    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: "Excel file is empty or has no data rows" },
        { status: 400 },
      );
    }

    // Skip header row, process data rows
    const dataRows = jsonData.slice(1);
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = i + 2; // 1-indexed + header row

      try {
        const id = String(row[0] || "").trim();
        const title = String(row[1] || "").trim();
        const author = String(row[2] || "").trim();
        const content = String(row[3] || "").trim();
        const image = String(row[4] || "").trim();
        const publishedStr = String(row[5] || "No")
          .trim()
          .toLowerCase();
        const published =
          publishedStr === "yes" ||
          publishedStr === "true" ||
          publishedStr === "1";

        // Validate required fields
        if (!title || !author || !content) {
          results.failed++;
          results.errors.push(
            `Row ${rowNum}: Missing required fields (title, author, or content)`,
          );
          continue;
        }

        // Check if article exists by ID (if provided and valid)
        let existing = null;
        if (id && id.length === 24) {
          existing = await Article.findById(id);
        }

        if (existing) {
          // Update existing
          await Article.updateOne(
            { _id: id },
            { title, content, author, image, published },
          );
          results.updated++;
        } else {
          // Create new
          await Article.create({
            title,
            content,
            author,
            image,
            published,
          });
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
    console.error("Import articles error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
