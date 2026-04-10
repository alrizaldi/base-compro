import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Article from "@/lib/db/models/Article";
import { requireAuth } from "@/lib/auth/middleware";

// GET /api/articles - Public (with pagination)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query: any = { published: true };
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
  const authResponse = await requireAuth(request);
  if (authResponse.status !== 200 && authResponse.status !== 302) {
    return authResponse;
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
