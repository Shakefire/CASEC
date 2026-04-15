"use client";

import { Briefcase, CalendarDays, FolderOpen, Users, ClipboardList, CalendarCheck } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";
import { useAdminStats, useOpportunities, useBookings } from "@/lib/hooks/useDashboard";

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentOpportunities = [], isLoading: oppsLoading } = useOpportunities("active", 5);
  const { data: recentBookings = [], isLoading: bookingsLoading } = useBookings();

  if (statsLoading || oppsLoading || bookingsLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  // Slice bookings for recent display
  const limitedBookings = recentBookings.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Opportunities"
          value={stats?.opportunities || 0}
          icon={<Briefcase size={20} />}
          note={`${stats?.activeOpportunities || 0} currently active`}
        />
        <StatCard
          label="Upcoming Events"
          value={stats?.events || 0}
          icon={<CalendarDays size={20} />}
        />
        <StatCard
          label="Resources Uploaded"
          value={stats?.resources || 0}
          icon={<FolderOpen size={20} />}
        />
        <StatCard
          label="Registered Users"
          value={stats?.users || 0}
          icon={<Users size={20} />}
          note={`${stats?.students || 0} students · ${stats?.employers || 0} employers`}
        />
        <StatCard
          label="RUN-LAS Submissions"
          value={stats?.runlas || 0}
          icon={<ClipboardList size={20} />}
          note={`${stats?.pendingRunlas || 0} pending review`}
        />
        <StatCard
          label="Booking Requests"
          value={stats?.bookings || 0}
          icon={<CalendarCheck size={20} />}
          note={`${stats?.pendingBookings || 0} pending`}
        />
      </div>

      {/* Recent Data Tabs/Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Recent Opportunities</h2>
            <Link href="/admin/opportunities" className="text-xs text-[#1a2e4a] hover:underline font-medium">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentOpportunities.length > 0 ? (
              recentOpportunities.map((opp: any) => (
                <li key={opp.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{opp.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{opp.type} · Deadline: {opp.deadline}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      opp.status === "active"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {opp.status}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-gray-400">No recent opportunities</li>
            )}
          </ul>
        </div>

        {/* Booking Requests */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Booking Requests</h2>
            <Link href="/admin/bookings" className="text-xs text-[#1a2e4a] hover:underline font-medium">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {limitedBookings.length > 0 ? (
              limitedBookings.map((bkn: any) => (
                <li key={bkn.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {bkn.profiles?.first_name} {bkn.profiles?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{bkn.type} · {new Date(bkn.created_at).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      bkn.status === "approved"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {bkn.status}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-gray-400">No pending bookings</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
