import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mailer } from "@/lib/email/sendEmail";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, purpose, start_time, end_time, details, user_id } = body;
    if (!full_name || !email || !purpose || !start_time || !end_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        full_name,
        email,
        phone,
        purpose,
        start_time,
        end_time,
        details,
        user_id: user_id || null, 
        status: "pending",
      })
      .select()
      .single();
    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }
    const dateStr = new Date(start_time).toLocaleDateString();
    const timeStr = new Date(start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    mailer.sendAppointmentUpdate(email, full_name, purpose, dateStr, timeStr, "pending").catch(console.error);
    mailer.sendAdminAlert("New Booking Request", `${full_name} for ${purpose} on ${dateStr}`, "/admin/appointments").catch(console.error);
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
