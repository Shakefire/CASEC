"use client";

import { Inbox, Calendar, ExternalLink, Loader2, Briefcase, Clock, Building2, MapPin, Search, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStudentApplications } from "@/lib/hooks/useDashboard";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";
import { useState } from "react";

export default function StudentApplicationsPage() {
  const { user } = useAuth();
  const { data: applications = [], isLoading } = useStudentApplications(user?.id);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = applications.filter((app: any) => 
    app.opportunities?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Applications</h1>
          <p className="text-gray-500 font-medium">Tracking {applications.length} active application{applications.length !== 1 ? 's' : ''}</p>
        </div>
        <Link 
          href="/student/jobs" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#097969] text-white rounded-2xl font-bold hover:bg-[#076356] transition-all shadow-lg active:scale-95"
        >
          <Briefcase size={18} /> Find More Jobs
        </Link>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by job title..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#097969]/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="px-4 py-2 bg-green-50 text-[#097969] rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
            All Status
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#097969]" size={40} />
            <p className="text-gray-400 font-medium tracking-tight">Fetching your application history...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <Inbox size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">No applications found</h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">
                {searchTerm ? "Try searching for something else." : "Start applying for jobs and internships to track them here."}
              </p>
            </div>
            {!searchTerm && (
              <Link href="/student/jobs" className="text-[#097969] font-bold hover:underline">
                Explore Job Board &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((app: any) => (
              <div 
                key={app.id} 
                className="group bg-white border border-gray-100 rounded-[1.5rem] p-6 hover:shadow-xl hover:shadow-[#097969]/5 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                      <Building2 size={24} className="text-gray-400 group-hover:text-[#097969] transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-start md:items-center gap-3 flex-col md:flex-row">
                          <h3 className="text-xl font-black text-gray-900 leading-tight">{app.opportunities?.title}</h3>
                          <StatusBadge status={app.status} />
                       </div>
                       <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                             <Building2 size={14} />
                             <span>{app.opportunities?.posted_by_name || "Unknown Company"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                             <MapPin size={14} />
                             <span>{app.opportunities?.location || "Remote"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#097969] font-bold">
                             <Clock size={14} />
                             <span>Applied: {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end lg:self-center">
                    <Link 
                      href={`/student/jobs`}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      View Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
