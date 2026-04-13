import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import ContactSubmission from "@/lib/db/models/ContactSubmission";
import { checkAuth } from "@/lib/auth/middleware";

// PUT /api/contacts/[id] - Protected (update status)
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

    const contact = await ContactSubmission.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true, runValidators: true },
    );

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/contacts/[id] - Protected
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

    const contact = await ContactSubmission.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
