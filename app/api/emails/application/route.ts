import { NextResponse } from "next/server";
import { mailer } from "@/lib/email/sendEmail";

/**
 * API Route to send job application notifications
 * Replaces hardcoded logic for both student and employer
 */
export async function POST(request: Request) {
  try {
    const { 
      studentEmail, 
      studentName, 
      employerEmail, 
      employerName, 
      jobTitle 
    } = await request.json();

    if (!studentEmail || !employerEmail || !jobTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Send emails in parallel
    await Promise.all([
      // 1. Confirm to Student
      mailer.sendApplicationSubmitted(studentEmail, studentName, jobTitle, employerName),
      // 2. Alert Employer
      mailer.sendApplicationReceived(employerEmail, employerName, studentName, jobTitle)
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Application email API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
