import { NextResponse } from "next/server";
import { mailer } from "@/lib/email/sendEmail";

/**
 * API Route to send a welcome email after registration
 * Called from the client post-signup
 */
export async function POST(request: Request) {
  try {
    const { email, name, role } = await request.json();

    if (!email || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await mailer.sendWelcome(email, name, role);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Welcome email API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
