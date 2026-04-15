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
    const { meeting_link, admin_note } = body;

    // 1. Update Booking Status
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .update({
        status: "approved",
        meeting_link,
        admin_note,
      })
      .eq("id", id)
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Error approving booking:", bookingError);
      return NextResponse.json({ error: "Failed to approve booking" }, { status: 500 });
    }

    // 2. Create User Notification
    if (booking.user_id) {
      await supabaseAdmin.from("notifications").insert({
        user_id: booking.user_id,
        email: booking.email,
        message: `Your booking for ${new Date(booking.start_time).toLocaleDateString()} has been approved.`,
        type: "booking_update",
      });
    }

    // 3. Send Email to User via Central Mailer
    try {
      const dateStr = new Date(booking.start_time).toLocaleDateString();
      const timeStr = new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      await mailer.sendAppointmentUpdate(
        booking.email,
        booking.full_name,
        booking.purpose,
        dateStr,
        timeStr,
        "approved",
        admin_note || `Meeting Link: ${meeting_link}`
      );
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
    }

    return NextResponse.json({ success: true, booking }, { status: 200 });
  } catch (error: any) {
    console.error("Approve booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
