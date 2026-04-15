"use client";

import { Briefcase, Search, Filter, Loader2, Building2, MapPin, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/FormField";
import { useOpportunities } from "@/lib/hooks/useDashboard";
import JobCard from "@/components/ui/JobCard";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { useState } from "react";

export default function StudentJobsPage() {
  const { data: opportunities = [], isLoading } = useOpportunities("active", 50);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  const filtered = (opportunities as any[]).filter(opp => 
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Career Opportunities</h2>
          <p className="text-sm text-gray-500">Explore jobs, internships, and scholarships tailored for you.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search roles, companies, or keywords..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#097969]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <Briefcase size={24} className="text-gray-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">No listings found</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                {searchQuery ? "Try adjusting your search filters." : "Opportunities posted by employers will appear here once available."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((opp) => (
              <JobCard 
                key={opp.id} 
                opportunity={opp} 
                onClick={() => setSelectedOpp(opp)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Opportunity Detail Modal */}
      <Modal
        isOpen={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
        title={selectedOpp?.title || "Opportunity Details"}
        size="lg"
      >
        {selectedOpp && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[#097969]">
                <Building2 size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedOpp.title}</h4>
                <p className="text-[#097969] font-semibold">{selectedOpp.postedByName}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-100"><MapPin size={12}/> {selectedOpp.location}</span>
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-100"><Briefcase size={12}/> {selectedOpp.type}</span>
                  {selectedOpp.salary && <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 italic">₦ {selectedOpp.salary}</span>}
                  <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> Deadline: {new Date(selectedOpp.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About This Opportunity</h5>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedOpp.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedOpp.requirements && selectedOpp.requirements.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Requirements</h5>
                    <ul className="space-y-2">
                      {selectedOpp.requirements.map((req: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={16} className="text-[#097969] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedOpp.skills && selectedOpp.skills.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills Needed</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpp.skills.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedOpp.eligibility && selectedOpp.eligibility.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Who Can Apply</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpp.eligibility.map((el: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-100">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedOpp.application_instructions && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> How To Apply
                  </h5>
                  <p className="text-amber-800 text-sm whitespace-pre-wrap">{selectedOpp.application_instructions}</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedOpp(null)}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Close
              </button>
              <Link 
                href={`/student/jobs/${selectedOpp.id}/apply`}
                className="px-8 py-2.5 bg-[#097969] text-white text-sm font-bold rounded-xl hover:bg-[#076356] transition-all shadow-md active:scale-95"
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
