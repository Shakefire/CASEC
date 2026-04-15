import { NextResponse } from "next/server";
import { mailer } from "@/lib/email/sendEmail";

export async function POST(request: Request) {
  try {
    const { title, message, actionUrl } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await mailer.sendAdminAlert(title, message, actionUrl);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Admin Alert email API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
