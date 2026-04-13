"use client";

import { useEffect, useState } from "react";
import { Briefcase, CalendarDays, FolderOpen, Users, ClipboardList, CalendarCheck } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    opportunities: 0,
    activeOpportunities: 0,
    events: 0,
    resources: 0,
    users: 0,
    students: 0,
    employers: 0,
    runlas: 0,
    pendingRunlas: 0,
    bookings: 0,
    pendingBookings: 0,
  });

  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch Opportunities stats
        const { data: opps, error: oppsError } = await supabase.from("opportunities").select("status");
        if (oppsError) {
          console.error("❌ Stats: Opportunities Fetch Error:", oppsError.message || oppsError);
        }
        const totalOpps = opps?.length || 0;
        const activeOpps = opps?.filter(o => o.status === "active").length || 0;

        // Fetch User stats from profiles
        const { data: profiles, error: profilesError } = await supabase.from("profiles").select("role");
        if (profilesError) {
          console.error("❌ Stats: Profiles Fetch Error:", profilesError.message || profilesError);
        }
        const totalUsers = profiles?.length || 0;
        const students = profiles?.filter(p => p.role === "student").length || 0;
        const employers = profiles?.filter(p => p.role === "employer").length || 0;

        // Fetch bookings
        const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("status");
        if (bookingsError) {
          console.error("❌ Stats: Bookings Fetch Error:", bookingsError.message || bookingsError);
        }
        const totalBookings = bookings?.length || 0;
        const pendingBookings = bookings?.filter(b => b.status === "pending").length || 0;

        // Fetch events
        const { data: events, error: eventsError } = await supabase.from("events").select("status");
        if (eventsError) {
          console.error("❌ Stats: Events Fetch Error:", eventsError.message || eventsError);
        }
        const totalEvents = events?.length || 0;

        // Fetch resources
        const { data: resources, error: resourcesError } = await supabase.from("resources").select("id");
        if (resourcesError) {
          console.error("❌ Stats: Resources Fetch Error:", resourcesError.message || resourcesError);
        }
        const totalResources = resources?.length || 0;

        // Fetch RUN-LAS forms
        const { data: runlas, error: runlasError } = await supabase.from("runlas_forms").select("status");
        if (runlasError) {
          console.error("❌ Stats: RUN-LAS Fetch Error:", runlasError.message || runlasError);
        }
        const totalRunlas = runlas?.length || 0;
        const pendingRunlas = runlas?.filter(r => r.status === "pending").length || 0;

        // Fetch recent data
        const { data: recentOpps, error: recentOppsError } = await supabase
          .from("opportunities")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        if (recentOppsError) {
          console.error("Error fetching recent opportunities:", recentOppsError);
        }

        const { data: recentBkn, error: recentBknError } = await supabase
          .from("bookings")
          .select("*, profiles(first_name, last_name)")
          .order("created_at", { ascending: false })
          .limit(4);
        if (recentBknError) {
          console.error("Error fetching recent bookings:", recentBknError);
        }

        setStats({
          opportunities: totalOpps,
          activeOpportunities: activeOpps,
          events: totalEvents,
          resources: totalResources,
          users: totalUsers,
          students,
          employers,
          runlas: totalRunlas,
          pendingRunlas,
          bookings: totalBookings,
          pendingBookings,
        });

        setRecentOpportunities(recentOpps || []);
        setRecentBookings(recentBkn || []);
      } catch (error: any) {
        console.error("Error fetching admin stats:", {
          message: error?.message || error,
          details: error?.details,
          hint: error?.hint,
          code: error?.code
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Opportunities"
          value={stats.opportunities}
          icon={<Briefcase size={20} />}
          note={`${stats.activeOpportunities} currently active`}
        />
        <StatCard
          label="Upcoming Events"
          value={stats.events}
          icon={<CalendarDays size={20} />}
        />
        <StatCard
          label="Resources Uploaded"
          value={stats.resources}
          icon={<FolderOpen size={20} />}
        />
        <StatCard
          label="Registered Users"
          value={stats.users}
          icon={<Users size={20} />}
          note={`${stats.students} students · ${stats.employers} employers`}
        />
        <StatCard
          label="RUN-LAS Submissions"
          value={stats.runlas}
          icon={<ClipboardList size={20} />}
          note={`${stats.pendingRunlas} pending review`}
        />
        <StatCard
          label="Booking Requests"
          value={stats.bookings}
          icon={<CalendarCheck size={20} />}
          note={`${stats.pendingBookings} pending`}
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
              recentOpportunities.map((opp) => (
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
            {recentBookings.length > 0 ? (
              recentBookings.map((bkn) => (
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
