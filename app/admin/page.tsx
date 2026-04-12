"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { opportunities, events, resources, users, runLasSubmissions, bookingRequests } from "@/lib/data";
import PrivateRoute from "@/components/PrivateRoute";

export default function AdminOverviewPage() {
  const totalOpportunities = opportunities.length;
  const activeOpportunities = opportunities.filter((item) => item.status === "active").length;
  const totalEvents = events.length;
  const totalResources = resources.length;
  const totalUsers = users.length;
  const pendingRunLas = runLasSubmissions.filter((item) => item.status === "pending").length;
  const pendingBookings = bookingRequests.filter((item) => item.status === "pending").length;

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin" pageTitle="Dashboard Overview" pageSubtitle="Career Services Centre – OnlineUniversity" userName="Admin">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Opportunities" value={totalOpportunities} icon={<span className="text-[#1a2e4a]">📌</span>} note={`${activeOpportunities} currently active`} />
          <StatCard label="Upcoming Events" value={totalEvents} icon={<span className="text-[#1a2e4a]">📅</span>} />
          <StatCard label="Resources Uploaded" value={totalResources} icon={<span className="text-[#1a2e4a]">📁</span>} />
          <StatCard label="Registered Users" value={totalUsers} icon={<span className="text-[#1a2e4a]">👥</span>} note={`${users.filter((user) => user.role === "student").length} students · ${users.filter((user) => user.role === "employer").length} employers`} />
          <StatCard label="RUN-LAS Submissions" value={runLasSubmissions.length} icon={<span className="text-[#1a2e4a]">📝</span>} note={`${pendingRunLas} pending review`} />
          <StatCard label="Booking Requests" value={bookingRequests.length} icon={<span className="text-[#1a2e4a]">📌</span>} note={`${pendingBookings} pending`} />
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
