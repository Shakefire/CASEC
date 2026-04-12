"use client";

import Link from "next/link";
import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivateRoute from "@/components/PrivateRoute";
import { opportunities, events, resources, applications } from "@/lib/data";
import JobCard from "@/components/ui/JobCard";
import EventCard from "@/components/ui/EventCard";

export default function StudentDashboardPage() {
  const summary = useMemo(
    () => [
      { label: "Available Opportunities", value: opportunities.length },
      { label: "Upcoming Events", value: events.length },
      { label: "Resources", value: resources.length },
      { label: "Applications Submitted", value: applications.length },
    ],
    []
  );

  return (
    <PrivateRoute allowedRoles={["student"]}>
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-[#097969]">Student Dashboard</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Welcome back, student</h1>
            <p className="mt-2 text-sm text-slate-500">Your current career resources and applications in one place.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-12">
            {summary.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
          <section className="mb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Recommended Opportunities</h2>
                <p className="text-sm text-slate-500">Browse roles and programs curated for students.</p>
              </div>
              <Link href="/jobs" className="text-sm text-[#097969] font-semibold hover:underline">
                Browse jobs
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {opportunities.slice(0, 2).map((opp) => (
                <JobCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </section>
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Upcoming Events</h2>
                <p className="text-sm text-slate-500">Keep your schedule aligned with career workshops.</p>
              </div>
              <Link href="/events" className="text-sm text-[#097969] font-semibold hover:underline">
                View all events
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {events.slice(0, 2).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
}
