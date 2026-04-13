import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Article from "@/lib/db/models/Article";
import { checkAuth } from "@/lib/auth/middleware";

// GET /api/articles/[id] - Public
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article.toJSON());
  } catch (error) {
    console.error("Get article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/articles/[id] - Protected
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const article = await Article.findByIdAndUpdate(
      id,
      {
        title: body.title,
        content: body.content,
        author: body.author,
        image: body.image,
        published: body.published,
      },
      { new: true, runValidators: true },
    );

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article.toJSON());
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/articles/[id] - Protected
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const { id } = await params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
