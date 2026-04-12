"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PrivateRoute from "@/components/PrivateRoute";
import Table from "@/components/tables/Table";
import Modal from "@/components/forms/Modal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Toast from "@/components/Toast";
import { bookingRequests } from "@/lib/data";

type BookingRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  purpose: string;
  status: "pending" | "approved" | "cancelled";
};

const initialBookings: BookingRecord[] = bookingRequests.map((booking) => ({
  id: booking.id,
  name: booking.name,
  email: booking.email,
  phone: booking.phone,
  service: booking.purpose,
  date: booking.date,
  purpose: booking.purpose,
  status: booking.status,
}));

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | BookingRecord["status"]>("all");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const filteredBookings = useMemo(
    () => (statusFilter === "all" ? bookings : bookings.filter((booking) => booking.status === statusFilter)),
    [bookings, statusFilter]
  );

  const handleApprove = (id: string) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status: "approved" } : booking)));
    setNotification({ message: "Booking approved successfully.", type: "success" });
  };

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status: "cancelled" } : booking)));
    setNotification({ message: "Booking cancelled successfully.", type: "success" });
  };

  const handleViewDetails = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns = useMemo(
    () => [
      { key: "name", header: "User Name", render: (row: BookingRecord) => <span className="font-medium text-slate-800">{row.name}</span> },
      { key: "service", header: "Service", render: (row: BookingRecord) => <span className="text-slate-600">{row.service}</span> },
      { key: "date", header: "Date", render: (row: BookingRecord) => <span>{row.date}</span> },
      {
        key: "status",
        header: "Status",
        render: (row: BookingRecord) => <StatusBadge status={row.status} />,
      },
      {
        key: "actions",
        header: "Actions",
        render: (row: BookingRecord) => (
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleViewDetails(row)} className="text-sm px-3 py-2 bg-slate-100 rounded text-slate-700 hover:bg-slate-200 transition-colors">
              View
            </button>
            {row.status !== "approved" && (
              <button onClick={() => handleApprove(row.id)} className="text-sm px-3 py-2 bg-emerald-50 rounded text-emerald-700 hover:bg-emerald-100 transition-colors">
                Approve
              </button>
            )}
            {row.status !== "cancelled" && (
              <button onClick={() => handleCancel(row.id)} className="text-sm px-3 py-2 bg-red-50 rounded text-red-700 hover:bg-red-100 transition-colors">
                Cancel
              </button>
            )}
          </div>
        ),
      },
    ],
    [bookings]
  );

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin" pageTitle="Manage Bookings" pageSubtitle="Review and update appointment requests" userName="Admin">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">{filteredBookings.length} bookings shown</p>
            <h2 className="text-2xl font-semibold text-slate-900">Booking Requests</h2>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Filter:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[#097969] focus:ring-1 focus:ring-[#097969] outline-none">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <Table columns={columns} data={filteredBookings} emptyMessage="No booking requests found." />

        <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Booking Details" size="md">
          {selectedBooking ? (
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold">Name</p>
                <p>{selectedBooking.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{selectedBooking.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <p>{selectedBooking.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Service</p>
                <p>{selectedBooking.service}</p>
              </div>
              <div>
                <p className="font-semibold">Date</p>
                <p>{selectedBooking.date}</p>
              </div>
              <div>
                <p className="font-semibold">Purpose</p>
                <p>{selectedBooking.purpose}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <StatusBadge status={selectedBooking.status} />
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No booking selected.</p>
          )}
        </Modal>

        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </DashboardLayout>
    </PrivateRoute>
  );
}
