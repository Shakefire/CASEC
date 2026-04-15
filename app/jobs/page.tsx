"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Search, MapPin, Filter, X, Heart, Check, Clock, AlertCircle, Zap } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: "job" | "internship" | "scholarship";
  deadline: string;
  postedByName: string;
  status: "active" | "closed";
  createdAt: string;
  location?: string;
  requirements?: string[];
  eligibility?: string[];
  verified?: boolean;
}

const getDeadlineStatus = (deadline: string) => {
  if (!deadline) return { status: "open", label: "Ongoing", color: "green" };
  const today = new Date();
  const deadlineDate = new Date(deadline);
  
  if (isNaN(deadlineDate.getTime())) {
    return { status: "open", label: "Ongoing", color: "green" };
  }
  
  const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return { status: "closed", label: "Closed", color: "red" };
  if (daysUntil <= 3) return { status: "urgent", label: `Closes in ${daysUntil} days`, color: "red" };
  if (daysUntil <= 7) return { status: "soon", label: `Closes soon`, color: "yellow" };
  return { status: "open", label: "Open", color: "green" };
};

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  job: { bg: "#dbeafe", text: "#0284c7", label: "Job" },
  internship: { bg: "#dcfce7", text: "#16a34a", label: "Internship" },
  scholarship: { bg: "#f3e8ff", text: "#a855f7", label: "Scholarship" },
};

export default function JobsPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "closing">("newest");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunities() {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("opportunities")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching opportunities:", fetchError);
          setError("Failed to load opportunities. Please try again later.");
          return;
        }

        const mapped: Opportunity[] = (data || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          type: row.type,
          deadline: row.deadline,
          postedByName: row.posted_by_name || "Unknown",
          status: row.status,
          createdAt: row.created_at,
          location: row.location,
          requirements: row.requirements,
          eligibility: row.eligibility,
          verified: row.verified,
        }));

        setOpportunities(mapped);
      } catch (err: any) {
        console.error("JobsPage: Unexpected crash:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOpportunities();
  }, []);

  // Get unique values for filters
  const locations = Array.from(new Set(opportunities.map((opp) => opp.location).filter(Boolean))) as string[];
  const companies = Array.from(new Set(opportunities.map((opp) => opp.postedByName)));

  // Filter and sort
  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities.filter((opp) => {
      const matchesSearch =
        searchQuery === "" ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.postedByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === null || opp.type === selectedType;
      const matchesLocation = selectedLocation === null || (opp.location && opp.location.includes(selectedLocation));
      const matchesCompany = selectedCompany === null || opp.postedByName === selectedCompany;

      return matchesSearch && matchesType && matchesLocation && matchesCompany;
    });

    // Sort
    if (sortBy === "closing") {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [opportunities, searchQuery, selectedType, selectedLocation, selectedCompany, sortBy]);


  const toggleSaveJob = (jobId: string) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
    setSavedJobs(newSaved);
  };

  const selectedJobData = opportunities.find((opp) => opp.id === selectedJob);
  const deadlineInfo = selectedJobData ? getDeadlineStatus(selectedJobData.deadline) : null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#097969] py-10 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Career Opportunities</h1>
          <p className="mt-2 text-sm text-emerald-100">Home &rsaquo; Career Opportunities</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#097969]"></div>
            <p className="mt-4 text-gray-600 font-medium font-outfit">Finding the best opportunities for you...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p className="font-outfit">{error}</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs, companies, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#097969] focus:ring-1 focus:ring-[#097969]"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Expanded Filter Row */}
          {filterOpen && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Type</label>
                <select
                  value={selectedType || ""}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                >
                  <option value="">All Types</option>
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                  <option value="scholarship">Scholarship</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Location</label>
                <select
                  value={selectedLocation || ""}
                  onChange={(e) => setSelectedLocation(e.target.value || null)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Company</label>
                <select
                  value={selectedCompany || ""}
                  onChange={(e) => setSelectedCompany(e.target.value || null)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                >
                  <option value="">All Companies</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "closing")}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                >
                  <option value="newest">Newest First</option>
                  <option value="closing">Closing Soon</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(selectedType || selectedLocation || selectedCompany) && (
            <div className="flex flex-wrap gap-2">
              {selectedType && (
                <button
                  onClick={() => setSelectedType(null)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                >
                  {selectedType}
                  <X size={16} />
                </button>
              )}
              {selectedLocation && (
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                >
                  {selectedLocation}
                  <X size={16} />
                </button>
              )}
              {selectedCompany && (
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                >
                  {selectedCompany}
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#097969] mb-1">
              {filteredOpportunities.length} OF {opportunities.length}
            </p>
            <h2 className="text-xl font-bold text-slate-900">
              {filteredOpportunities.length === 0 ? "No opportunities found" : "Career Listings"}
            </h2>
          </div>
          <Link href="/cv-builder" className="text-sm text-[#097969] font-semibold hover:underline">
            Need help with CV? &rsaquo;
          </Link>
        </div>

        {/* Opportunities List */}
        {filteredOpportunities.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No opportunities found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType(null);
                setSelectedLocation(null);
                setSelectedCompany(null);
              }}
              className="px-4 py-2 bg-[#097969] text-white rounded-lg hover:bg-[#065f52] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOpportunities.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No opportunities found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms to see more results.</p>
              </div>
            )}
            {filteredOpportunities.map((opp) => {
              const deadline = getDeadlineStatus(opp.deadline);
              const isSaved = savedJobs.has(opp.id);
              const typeColor = typeColors[opp.type];

              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedJob(opp.id)}
                  className="group cursor-pointer border border-slate-200 rounded-xl p-6 hover:border-[#097969] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* Type Badge & Company Logo */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-2xl"
                        style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                      >
                        {opp.postedByName.charAt(0)}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#097969] transition-colors">
                            {opp.title}
                          </h3>
                          <p className="text-sm font-semibold text-[#097969] mb-2 flex items-center gap-1">
                            {opp.verified && <Check size={16} />}
                            {opp.postedByName}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(opp.id);
                          }}
                          className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Heart
                            size={20}
                            className={isSaved ? "fill-red-500 text-red-500" : "text-slate-400"}
                          />
                        </button>
                      </div>

                      {/* Location & Description */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                        <MapPin size={14} />
                        {opp.location || "Remote"}
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{opp.description}</p>

                      {/* Eligibility Snapshot */}
                      {opp.eligibility && opp.eligibility.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {opp.eligibility.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="text-xs bg-[#e6f4f1] text-[#097969] px-2 py-1 rounded">
                              ✔ {item}
                            </span>
                          ))}
                          {opp.eligibility.length > 2 && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              +{opp.eligibility.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer: Deadline, Type Badge, CTA */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Deadline Badge */}
                          <div
                            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                              deadline.status === "open"
                                ? "bg-green-100 text-green-700"
                                : deadline.status === "soon"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {deadline.status === "open" && <Check size={14} />}
                            {deadline.status === "soon" && <Clock size={14} />}
                            {deadline.status === "urgent" && <AlertCircle size={14} />}
                            {deadline.label}
                          </div>

                          {/* Type Tag */}
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                          >
                            {typeColor.label}
                          </span>
                        </div>

                        {/* Apply Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(opp.id);
                          }}
                          className="px-4 py-2 bg-[#097969] text-white text-sm font-semibold rounded-lg hover:bg-[#065f52] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </>
        )}
      </main>

      {/* Job Detail Modal */}
      {selectedJobData && (
        <div className="fixed inset-0 z-[1000] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSelectedJob(null)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-200">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedJobData.title}</h2>
                  <p className="text-base font-semibold text-[#097969] flex items-center gap-2">
                    {selectedJobData.verified && <Check size={18} />}
                    {selectedJobData.postedByName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">LOCATION</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      <MapPin size={16} />
                      {selectedJobData.location || "Remote"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">DEADLINE</p>
                    <p
                      className={`text-sm font-semibold flex items-center gap-1 ${
                        deadlineInfo?.status === "open"
                          ? "text-green-700"
                          : deadlineInfo?.status === "soon"
                            ? "text-yellow-700"
                            : "text-red-700"
                      }`}
                    >
                      {deadlineInfo?.status === "open" && <Check size={16} />}
                      {deadlineInfo?.status === "soon" && <Clock size={16} />}
                      {deadlineInfo?.status === "urgent" && <Zap size={16} />}
                      {deadlineInfo?.label}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">ABOUT THIS OPPORTUNITY</h3>
                  <p className="text-sm leading-6 text-slate-700">{selectedJobData.description}</p>
                </div>

                {/* Requirements */}
                {selectedJobData.requirements && selectedJobData.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">REQUIREMENTS</h3>
                    <ul className="space-y-2">
                      {selectedJobData.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <Check size={16} className="flex-shrink-0 mt-0.5 text-[#097969]" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Eligibility */}
                {selectedJobData.eligibility && selectedJobData.eligibility.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">WHO CAN APPLY</h3>
                    <ul className="space-y-2">
                      {selectedJobData.eligibility.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <Check size={16} className="flex-shrink-0 mt-0.5 text-[#097969]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toggleSaveJob(selectedJobData.id);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    savedJobs.has(selectedJobData.id)
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Heart size={18} fill={savedJobs.has(selectedJobData.id) ? "currentColor" : "none"} />
                  {savedJobs.has(selectedJobData.id) ? "Saved" : "Save"}
                </button>
                <Link
                  href="/cv-builder"
                  className="flex-1 px-4 py-3 bg-[#097969] text-white rounded-lg font-semibold hover:bg-[#065f52] transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

