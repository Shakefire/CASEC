"use client";

import { useEffect, useState } from "react";
import { Briefcase, CheckCircle, Inbox } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EmployerOverviewPage() {
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    activeListings: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployerData() {
      setLoading(true);
      try {
        // In a real app, we'd get the user ID from the session
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        // Fetch employer's opportunities
        const { data: opps } = await supabase
          .from("opportunities")
          .select("*")
          .eq("posted_by", userId);
        
        const totalOpps = opps?.length || 0;
        const activeOpps = opps?.filter(o => o.status === "active").length || 0;
        const oppIds = opps?.map(o => o.id) || [];

        // Fetch applications for those opportunities
        let totalApps = 0;
        let pendingApps = 0;
        let recentApps: any[] = [];

        if (oppIds.length > 0) {
          const { data: apps } = await supabase
            .from("applications")
            .select("*, opportunities(title), profiles(first_name, last_name)")
            .in("opportunity_id", oppIds);

          totalApps = apps?.length || 0;
          pendingApps = apps?.filter(a => a.status === "pending").length || 0;
          recentApps = apps?.slice(0, 5) || [];
        }

        setStats({
          totalOpportunities: totalOpps,
          activeListings: activeOpps,
          totalApplications: totalApps,
          pendingApplications: pendingApps,
        });

        setRecentOpportunities(opps?.slice(0, 5) || []);
        setRecentApplications(recentApps);
      } catch (error) {
        console.error("Error fetching employer overview:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployerData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading employer data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Posted Opportunities"
          value={stats.totalOpportunities}
          icon={<Briefcase size={20} />}
        />
        <StatCard
          label="Active Listings"
          value={stats.activeListings}
          icon={<CheckCircle size={20} />}
        />
        <StatCard
          label="Applications Received"
          value={stats.totalApplications}
          icon={<Inbox size={20} />}
          note={`${stats.pendingApplications} pending review`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Opportunities Summary */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">My Opportunities</h2>
            <Link href="/employer/opportunities" className="text-xs text-[#1a2e4a] hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentOpportunities.length === 0 ? (
            <p className="px-4 py-8 text-xs text-gray-400 text-center">
              No opportunities posted yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOpportunities.map((opp) => (
                <li key={opp.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{opp.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {opp.type} · Deadline: {opp.deadline}
                    </p>
                  </div>
                  <StatusBadge status={opp.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Recent Applications</h2>
            <Link href="/employer/applications" className="text-xs text-[#1a2e4a] hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <p className="px-4 py-8 text-xs text-gray-400 text-center">
              No applications received yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentApplications.map((app) => (
                <li key={app.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {app.profiles?.first_name} {app.profiles?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {app.opportunities?.title}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
