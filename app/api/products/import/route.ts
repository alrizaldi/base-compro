import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/connect";
import AdminAccount from "@/lib/db/models/AdminAccount";
import Product from "@/lib/db/models/Product";
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

// POST /api/products/import - Import products from Excel file
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

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      );
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
    const results = { created: 0, updated: 0, failed: 0, errors: [] as string[] };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = i + 2; // 1-indexed + header row

      try {
        const name = String(row[0] || "").trim();
        const description = String(row[1] || "").trim();
        const price = parseFloat(row[2]);
        const imagesStr = String(row[3] || "").trim();
        const platform1 = String(row[4] || "").trim();
        const url1 = String(row[5] || "").trim();
        const platform2 = String(row[6] || "").trim();
        const url2 = String(row[7] || "").trim();
        const platform3 = String(row[8] || "").trim();
        const url3 = String(row[9] || "").trim();

        // Validate required fields
        if (!name || !description || isNaN(price)) {
          results.failed++;
          results.errors.push(
            `Row ${rowNum}: Missing required fields (name, description, or price)`,
          );
          continue;
        }

        // Build ecommerce links array
        const ecommerceLinks: { platform: string; url: string }[] = [];
        if (platform1 && url1) ecommerceLinks.push({ platform: platform1, url: url1 });
        if (platform2 && url2) ecommerceLinks.push({ platform: platform2, url: url2 });
        if (platform3 && url3) ecommerceLinks.push({ platform: platform3, url: url3 });

        // Build images array
        const images = imagesStr
          ? imagesStr
              .split(",")
              .map((url: string) => url.trim())
              .filter((url: string) => url.length > 0)
          : [];

        // Check if product exists by name
        const existing = await Product.findOne({ name });

        if (existing) {
          // Update existing
          await Product.updateOne(
            { name },
            {
              name,
              description,
              price,
              images,
              ecommerceLinks,
            },
          );
          results.updated++;
        } else {
          // Create new
          await Product.create({
            name,
            description,
            price,
            images,
            ecommerceLinks,
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
    console.error("Import products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
