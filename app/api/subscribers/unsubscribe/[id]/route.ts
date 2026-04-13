import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Subscriber from "@/lib/db/models/Subscriber";

// GET /api/subscribers/unsubscribe/[id] - Unsubscribe via email link
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    const subscriber = await Subscriber.findByIdAndUpdate(
      id,
      { status: "unsubscribed" },
      { new: true },
    );

    if (!subscriber) {
      return new NextResponse(
        `
        <html>
          <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
            <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;">
              <div style="background:white;border-radius:8px;padding:40px;max-width:500px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color:#111827;margin:0 0 8px 0;">Invalid Link</h2>
                <p style="color:#6b7280;margin:0;">This unsubscribe link is no longer valid.</p>
              </div>
            </div>
          </body>
        </html>
        `,
        {
          status: 404,
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    return new NextResponse(
      `
      <html>
        <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
          <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;">
            <div style="background:white;border-radius:8px;padding:40px;max-width:500px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              <div style="width:64px;height:64px;border-radius:50%;background-color:#dcfce7;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#16a34a" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 style="color:#111827;margin:0 0 8px 0;">You've Been Unsubscribed</h2>
              <p style="color:#6b7280;margin:0 0 20px 0;">You will no longer receive newsletter emails from us.</p>
              <a href="/" style="display:inline-block;padding:10px 24px;background-color:#111827;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">Return to Website</a>
            </div>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(
      `
      <html>
        <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
          <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;">
            <div style="background:white;border-radius:8px;padding:40px;max-width:500px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color:#111827;margin:0 0 8px 0;">Something Went Wrong</h2>
              <p style="color:#6b7280;margin:0;">We couldn't process your unsubscribe request. Please try again later.</p>
            </div>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      },
    );
  }
}
