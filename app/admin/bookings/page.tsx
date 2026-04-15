"use client";

import { useState } from "react";
import { CheckCircle, Clock, XCircle, CalendarClock, Loader2, MapPin, Mail, Phone, Calendar, Video, FileText, Info } from "lucide-react";
import { Eye } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { useBookings, useBookingMutation, Booking } from "@/lib/hooks/useDashboard";

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading, refetch } = useBookings();
  const mutation = useBookingMutation();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject" | "reschedule" | "view" | null>(null);
  
  // Form states
  const [meetingLink, setMeetingLink] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !modalType) return;
    
    let body: any = {};

    if (modalType === "approve") {
      body = { meeting_link: meetingLink, admin_note: adminNote };
    } else if (modalType === "reject") {
      body = { reason: adminNote };
    } else if (modalType === "reschedule") {
      const start_time = new Date(`${newDate}T${newTime}:00`);
      const end_time = new Date(start_time.getTime() + 60 * 60 * 1000);
      body = { 
        start_time: start_time.toISOString(), 
        end_time: end_time.toISOString(), 
        reason: adminNote,
        meeting_link: meetingLink 
      };
    }

    mutation.mutate(
      { id: selectedBooking.id, type: modalType, body },
      {
        onSuccess: async () => {
          await refetch();
          closeModal();
        },
        onError: (err: any) => {
          alert("Error: " + err.message);
        },
      }
    );
  };

  const openModal = (booking: Booking, type: "approve" | "reject" | "reschedule" | "view") => {
    setSelectedBooking(booking);
    setModalType(type);
    setMeetingLink(booking.meeting_link || "");
    setAdminNote(type === "approve" ? "" : (booking.admin_note || ""));
    
    if (type === "reschedule") {
      const dateObj = new Date(booking.start_time);
      setNewDate(dateObj.toISOString().split("T")[0]);
      setNewTime(dateObj.toTimeString().slice(0, 5));
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalType(null);
    setMeetingLink("");
    setAdminNote("");
    setNewDate("");
    setNewTime("");
  };

  const filtered = filterStatus === "all" ? bookings : bookings.filter((b) => b.status === filterStatus);

  const columns: Column<Booking>[] = [
    {
      key: "name",
      header: "Guest / User",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{row.full_name}</span>
          <span className="text-xs text-gray-400">{row.email} {row.user_id ? '(User)' : '(Guest)'}</span>
        </div>
      ),
    },
    { key: "purpose", header: "Purpose", render: (row) => <span className="text-gray-600">{row.purpose}</span> },
    { 
      key: "start_time", 
      header: "Date & Time", 
      render: (row) => (
        <div className="flex flex-col text-sm text-gray-600">
          <span>{new Date(row.start_time).toLocaleDateString()}</span>
          <span className="text-xs text-gray-500">{new Date(row.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ) 
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal(row, "view")}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            title="View Details"
          >
            <Eye size={13} />
          </button>
          {row.status === "pending" || row.status === "rescheduled" ? (
            <>
              <button
                onClick={() => openModal(row, "approve")}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-green-300 rounded text-green-700 hover:bg-green-50 transition-colors"
                title="Approve"
              >
                <CheckCircle size={13} />
              </button>
              <button
                onClick={() => openModal(row, "reschedule")}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-blue-300 rounded text-blue-700 hover:bg-blue-50 transition-colors"
                title="Reschedule"
              >
                <CalendarClock size={13} />
              </button>
              <button
                onClick={() => openModal(row, "reject")}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-red-300 rounded text-red-700 hover:bg-red-50 transition-colors"
                title="Reject"
              >
                <XCircle size={13} />
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">No actions</span>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Booking Requests</h2>
          <p className="text-sm text-gray-500">Manage career counselling appointments.</p>
        </div>
        
        {pendingCount > 0 && !isLoading && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
            <Clock size={13} />
            {pendingCount} pending approval
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {["all", "pending", "approved", "rejected", "rescheduled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors capitalize ${
              filterStatus === s
                ? "bg-[#1a2e4a] text-white border-[#1a2e4a]"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "All Bookings" : s}
          </button>
        ))}
      </div>

      <Table<Booking>
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No booking requests found for the selected filter."
      />

      {/* Action Modal */}
      {modalType && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {modalType === "view" ? "Booking Details" : `${modalType} Booking`}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            
            {modalType === "view" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                      <Calendar className="text-[#1a2e4a]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Booked On</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(selectedBooking.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Information</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <span>{selectedBooking.email}</span>
                    </div>
                    {selectedBooking.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        <span>{selectedBooking.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Session Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Info size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.purpose}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedBooking.details || "No additional details provided."}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock size={16} className="text-gray-400" />
                      <span>
                        {new Date(selectedBooking.start_time).toLocaleString('en-US', { 
                          weekday: 'short', month: 'short', day: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAction} className="space-y-4">
                {modalType === "approve" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (Optional)</label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#1a2e4a] focus:border-[#1a2e4a]"
                        placeholder="https://meet.google.com/..."
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note (Optional)</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#1a2e4a] focus:border-[#1a2e4a]"
                        rows={3}
                        placeholder="Add a message for the user..."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {modalType === "reject" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#1a2e4a] focus:border-[#1a2e4a]"
                      rows={3}
                      placeholder="Why is this booking being rejected?"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                    />
                  </div>
                )}

                {modalType === "reschedule" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                        <input
                          required
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#1a2e4a] focus:border-[#1a2e4a]"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                        <input
                          required
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#1a2e4a] focus:border-[#1a2e4a]"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                  <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#1a2e4a] rounded-md hover:bg-[#2a3e5a] flex items-center gap-2">
                    {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
                    Confirm {modalType}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
