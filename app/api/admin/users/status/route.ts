import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mailer } from "@/lib/email/sendEmail";

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function PATCH(request: Request) {
  try {
    const { userId, status, reason } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Update Profile in DB
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .update({ status })
      .eq("id", userId)
      .select()
      .single();

    if (error || !profile) {
      console.error("Status update error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // 2. Trigger Email if Employer is approved/rejected
    if (profile.role === 'employer') {
      try {
        if (status === 'active' || status === 'approved') {
          await mailer.sendEmployerStatus(profile.email, profile.company_name || 'Employer', 'approved');
        } else if (status === 'inactive' || status === 'rejected') {
          await mailer.sendEmployerStatus(profile.email, profile.company_name || 'Employer', 'rejected', reason);
        }
      } catch (emailErr) {
        console.error("Failed to send status email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error("Status API crash:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
