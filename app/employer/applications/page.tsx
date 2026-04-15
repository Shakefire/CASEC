"use client";

import { useState } from "react";
import { 
  Download, Filter, ChevronDown, User, Mail, Phone, 
  GraduationCap, Briefcase, FileText, Link as LinkIcon, 
  Calendar, CheckCircle2, XCircle, Search, ExternalLink,
  MessageSquare, MoreVertical, Eye, MapPin, Building2,
  Trophy, Star, Award, BookOpen, Loader2
} from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useApplicationsManagement, useOpportunitiesManagement, useApplicationAnswers } from "@/lib/hooks/useDashboard";
import { useQueryClient } from "@tanstack/react-query";

interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status: string;
  applied_at: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  level: string;
  cgpa: number;
  graduation_year: number;
  resume_url: string;
  cover_letter: string;
  linked_in_url: string;
  portfolio_url: string;
  github_url: string;
  opportunities: {
    title: string;
    id: string;
  };
}

export default function EmployerApplicationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: applications = [], isLoading: loading, refetch } = useApplicationsManagement(user?.id);
  const { data: myOpps = [] } = useOpportunitiesManagement(user?.id);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterOpp, setFilterOpp] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Modal State for Answers
  const { data: answers = [], isLoading: loadingAnswers } = useApplicationAnswers(selectedApp?.id);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("job_applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    
    if (error) {
      alert("Error updating application: " + error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["applications-management"] });
      if (refetch) await refetch();
      if (selectedApp?.id === id) {
        setSelectedApp(prev => prev ? { ...prev, status } : null);
      }
    }
  }

  const filtered = (applications as Application[]).filter((a) => {
    const statusMatch = filterStatus === "all" || a.status === filterStatus;
    const oppMatch = filterOpp === "all" || a.job_id === filterOpp;
    const nameMatch = a.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && oppMatch && nameMatch;
  });

  const columns: Column<Application>[] = [
    {
      key: "applicantName",
      header: "Applicant",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-[#097969] border border-gray-100">
            {row.full_name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">{row.full_name}</span>
            <span className="text-xs text-gray-400 font-medium">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "opportunity",
      header: "Job Role",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-bold tracking-tight">{row.opportunities?.title}</span>
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{row.department}</span>
        </div>
      ),
    },
    {
      key: "academic",
      header: "Profile Score",
      render: (row) => (
        <div className="flex items-center gap-2">
           <div className="px-2 py-1 bg-green-50 text-[#097969] rounded-lg text-xs font-black border border-green-100">
              {row.cgpa ? row.cgpa.toFixed(2) : "N/A"} CGPA
           </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Applied On",
      render: (row) => (
        <span className="text-sm font-medium text-gray-500">
          {new Date(row.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => setSelectedApp(row)}
            className="p-2 text-gray-400 hover:text-[#097969] hover:bg-green-50 rounded-xl transition-all"
          >
            <Eye size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Manage Applications</h1>
          <p className="text-gray-500 font-medium">Review talent and manage your hiring pipeline efficiently.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
            <span className="text-2xl font-black text-[#097969]">{applications.length}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Applications</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
            <span className="text-2xl font-black text-blue-600">{applications.filter((a: any) => a.status === 'submitted').length}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New / Pending</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by applicant name..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#097969]/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-transparent hover:border-gray-200 transition-all">
             <Filter size={14} className="text-gray-400" />
             <select 
               value={filterOpp}
               onChange={(e) => setFilterOpp(e.target.value)}
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 min-w-[140px]"
             >
               <option value="all">All Jobs</option>
               {myOpps.map((opp: any) => (
                 <option key={opp.id} value={opp.id}>{opp.title}</option>
               ))}
             </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-transparent hover:border-gray-200 transition-all">
             <ChevronDown size={14} className="text-gray-400" />
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-700"
             >
               <option value="all">All Status</option>
               <option value="submitted">New</option>
               <option value="under_review">Under Review</option>
               <option value="shortlisted">Shortlisted</option>
               <option value="rejected">Rejected</option>
             </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <Table<Application>
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No talent found matching your criteria."
        />
      </div>

      {/* DETAIL MODAL */}
      <Modal 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        maxWidth="max-w-4xl"
      >
        {selectedApp && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Applicant Summary */}
            <div className="lg:w-1/3 flex flex-col gap-6">
              <div className="p-6 bg-gray-50 rounded-3xl text-center border border-gray-100">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl text-3xl font-black text-[#097969]">
                  {selectedApp.full_name.charAt(0)}
                </div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">{selectedApp.full_name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">{selectedApp.email}</p>
                <div className="flex justify-center gap-2">
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                   <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Professional Links</h4>
                   <div className="flex items-center gap-4">
                      {selectedApp.linked_in_url && (
                        <a href={selectedApp.linked_in_url} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:scale-110 transition-transform">
                          <LinkIcon size={18} />
                        </a>
                      )}
                      {selectedApp.portfolio_url && (
                        <a href={selectedApp.portfolio_url} target="_blank" className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:scale-110 transition-transform">
                          <LinkIcon size={18} />
                        </a>
                      )}
                      {selectedApp.github_url && (
                        <a href={selectedApp.github_url} target="_blank" className="p-2 bg-black text-white rounded-xl hover:scale-110 transition-transform">
                          <LinkIcon size={18} />
                        </a>
                      )}
                   </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                   <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Academic Info</h4>
                   <div className="flex items-center gap-3">
                      <GraduationCap className="text-[#097969]" size={16} />
                      <span className="text-sm font-bold text-gray-700">{selectedApp.department}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Award className="text-blue-600" size={16} />
                      <span className="text-sm font-bold text-gray-700">{selectedApp.cgpa ? selectedApp.cgpa.toFixed(2) : "N/A"} CGPA</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Calendar className="text-orange-500" size={16} />
                      <span className="text-sm font-bold text-gray-700">{selectedApp.level} Level (Class of {selectedApp.graduation_year})</span>
                   </div>
                </div>
              </div>

              <a 
                href={selectedApp.resume_url} 
                target="_blank"
                className="w-full flex items-center justify-center gap-2 bg-[#097969] text-white py-4 rounded-2xl font-bold hover:bg-[#076356] transition-all shadow-lg active:scale-95"
              >
                <Download size={20} /> Download CV
              </a>
            </div>

            {/* Right: Detailed Content */}
            <div className="lg:w-2/3 space-y-8">
              {/* Cover Letter */}
              <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-tight mb-4">
                  <FileText className="text-[#097969]" size={18} /> Message / Cover Letter
                </h4>
                <div className="p-6 bg-gray-50 rounded-2xl text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedApp.cover_letter || "No cover letter provided."}
                </div>
              </div>

              {/* Custom Answers */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-tight">
                  <Star className="text-orange-500" size={18} /> Employer Questions
                </h4>
                {loadingAnswers ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-[#097969]" />
                  </div>
                ) : answers.length > 0 ? (
                  <div className="space-y-4">
                    {answers.map((ans: any) => (
                      <div key={ans.id} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                        <p className="text-xs font-bold text-[#097969] uppercase tracking-widest mb-2">{ans.application_questions?.question}</p>
                        <p className="text-sm text-gray-700 font-medium">{ans.answer || "No answer provided."}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400">
                    No custom questions were asked for this role.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-3">
                <button 
                  onClick={() => updateStatus(selectedApp.id, 'shortlisted')}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                >
                  <CheckCircle2 size={18} /> Shortlist
                </button>
                <button 
                  onClick={() => updateStatus(selectedApp.id, 'under_review')}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  <Eye size={18} /> Mark Reviewing
                </button>
                <button 
                  onClick={() => updateStatus(selectedApp.id, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-red-600 border border-red-100 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-95"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

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
