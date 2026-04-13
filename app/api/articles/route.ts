import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Article from "@/lib/db/models/Article";
import { checkAuth } from "@/lib/auth/middleware";

// GET /api/articles - Public (published only) or Admin (all)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Check if authenticated (admin) — return all, otherwise only published
    const isAdmin = await checkAuth(request);

    const query: any = isAdmin ? {} : { published: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      data: articles.map((a) => a.toJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get articles error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/articles - Protected
export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const body = await request.json();

    const article = await Article.create({
      title: body.title,
      content: body.content,
      author: body.author,
      image: body.image,
      published: body.published ?? false,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
