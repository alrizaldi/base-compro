import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";
import dbConnect from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import * as XLSX from "xlsx";

// GET /api/products/export - Export products as Excel file
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

    // Fetch all products
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    // Prepare data for Excel
    const headers = [
      "ID",
      "Name",
      "Description",
      "Price",
      "Images (comma separated)",
      "E-commerce Platform 1",
      "E-commerce URL 1",
      "E-commerce Platform 2",
      "E-commerce URL 2",
      "E-commerce Platform 3",
      "E-commerce URL 3",
      "Created At",
    ];

    const rows = products.map((product) => {
      const images = (product.images || []).join(", ");
      const links = product.ecommerceLinks || [];

      return [
        product._id.toString(),
        product.name,
        product.description,
        product.price,
        images,
        links[0]?.platform || "",
        links[0]?.url || "",
        links[1]?.platform || "",
        links[1]?.url || "",
        links[2]?.platform || "",
        links[2]?.url || "",
        new Date(product.createdAt).toISOString(),
      ];
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = [
      { wch: 26 }, // ID
      { wch: 25 }, // Name
      { wch: 40 }, // Description
      { wch: 15 }, // Price
      { wch: 40 }, // Images
      { wch: 20 }, // Platform 1
      { wch: 40 }, // URL 1
      { wch: 20 }, // Platform 2
      { wch: 40 }, // URL 2
      { wch: 20 }, // Platform 3
      { wch: 40 }, // URL 3
      { wch: 25 }, // Created At
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Generate Excel file buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="products.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
