"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useBookings, Booking } from "@/lib/hooks/useDashboard";
import StatusBadge from "@/components/ui/StatusBadge";
import { CalendarDays, Clock, Video, FileText, Info, Plus, X, CheckCircle2 } from "lucide-react";
import { Eye } from "lucide-react";
import BookingForm from "@/components/forms/BookingForm";

export default function StudentAppointmentsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, refetch } = useBookings(user?.id);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredBookings = bookings.filter(b => 
    ["approved", "rescheduled", "rejected"].includes(b.status)
  );

  const pendingBookings = bookings.filter(b => b.status === "pending");

  const handleBookingSuccess = async () => {
    setShowBookingForm(false);
    setSuccessMessage("Your appointment request has been submitted successfully!");
    // Auto-hide success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
    if (refetch) {
      await refetch();
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm">View and manage your career counselling sessions.</p>
        </div>
        <button
          onClick={() => {
            setShowBookingForm(!showBookingForm);
            setSuccessMessage(null);
          }}
          className="inline-flex items-center gap-2 bg-[#097969] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#076356] transition-colors"
        >
          {showBookingForm ? "Back to List" : <><Plus size={18} /> Book New Session</>}
        </button>
      </div>

      {showBookingForm ? (
        <div className="max-w-4xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <BookingForm onSuccess={handleBookingSuccess} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Requests Section */}
          {pendingBookings.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-amber-500" />
                Pending Requests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingBookings.map((booking) => (
                  <AppointmentCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {/* History Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays size={20} className="text-[#097969]" />
              Appointment History
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#097969]"></div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments yet</h3>
                <p className="text-gray-500 text-sm mb-6">Your confirmed, rescheduled and rejected appointments will appear here.</p>
                {!pendingBookings.length && (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="text-[#097969] font-semibold hover:underline"
                  >
                    Book your first session
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <AppointmentCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ booking }: { booking: Booking }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const startTime = new Date(booking.start_time);
  
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${booking.status === 'rejected' ? 'opacity-75' : ''}`}>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              booking.status === 'approved' ? 'bg-green-50 text-green-600' :
              booking.status === 'rejected' ? 'bg-red-50 text-red-600' :
              booking.status === 'rescheduled' ? 'bg-blue-50 text-blue-600' :
              'bg-amber-50 text-amber-600'
            }`}>
              <CalendarDays size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">{booking.purpose}</h4>
              <p className="text-xs text-gray-500">Booked on {new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title={isExpanded ? "Hide Details" : "View Details"}
            >
              <Eye size={18} className={isExpanded ? "text-[#097969]" : ""} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gray-400" />
            <span>{startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3 mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
            {booking.meeting_link && booking.status === 'approved' && (
              <div className="flex items-start gap-2">
                <Video size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">Meeting Link</p>
                  <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                    {booking.meeting_link}
                  </a>
                </div>
              </div>
            )}
            
            {booking.admin_note && (
              <div className="flex items-start gap-2">
                <Info size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">Admin Note</p>
                  <p className="text-sm text-gray-600 italic">"{booking.admin_note}"</p>
                </div>
              </div>
            )}

            {booking.details && (
              <div className="flex items-start gap-2">
                <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">Your Notes</p>
                  <p className="text-sm text-gray-600">{booking.details}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
