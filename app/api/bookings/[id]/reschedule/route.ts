import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mailer } from "@/lib/email/sendEmail";

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { start_time, end_time, reason, meeting_link } = body;

    if (!start_time || !end_time) {
      return NextResponse.json({ error: "Missing start_time or end_time" }, { status: 400 });
    }

    // 1. Update Booking Status and Time
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .update({
        status: "rescheduled",
        start_time,
        end_time,
        admin_note: reason,
        meeting_link: meeting_link || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Error rescheduling booking:", bookingError);
      return NextResponse.json({ error: "Failed to reschedule booking" }, { status: 500 });
    }

    // 2. Create User Notification
    if (booking.user_id) {
      await supabaseAdmin.from("notifications").insert({
        user_id: booking.user_id,
        email: booking.email,
        message: `Your booking has been rescheduled to ${new Date(start_time).toLocaleDateString()}.`,
        type: "booking_update",
      });
    }

    // 3. Send Email to User via Central Mailer
    try {
      const dateStr = new Date(start_time).toLocaleDateString();
      const timeStr = new Date(start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      await mailer.sendAppointmentUpdate(
        booking.email,
        booking.full_name,
        booking.purpose,
        dateStr,
        timeStr,
        "rescheduled",
        reason
      );
    } catch (emailError) {
      console.error("Error sending reschedule email:", emailError);
    }

    return NextResponse.json({ success: true, booking }, { status: 200 });
  } catch (error: any) {
    console.error("Reschedule booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
