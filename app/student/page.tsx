"use client";

import StatCard from "@/components/ui/StatCard";
import { Briefcase, CalendarDays, Inbox, Clock, Calendar, Video, User, GraduationCap, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Link as LinkIcon, FileText, MapPin, X, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/hooks/useProfile";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";
import { useState } from "react";
import { useBookings, useStudentDashboard, useStudentApplications, useResourcesManagement, useOpportunities } from "@/lib/hooks/useDashboard";
import JobCard from "@/components/ui/JobCard";
import Modal from "@/components/ui/Modal";
import ErrorState from "@/components/ui/ErrorState";

export default function StudentOverviewPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading: bookingsLoading, isError: bookingsError } = useBookings(user?.id);
  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile(user?.id);
  const { data: studentStats, isError: statsError } = useStudentDashboard(user?.id);
  const { data: applications = [], isLoading: appsLoading, isError: appsError } = useStudentApplications(user?.id);
  const { data: resources = [], isLoading: resourcesLoading, isError: resourcesError } = useResourcesManagement();
  const { data: opportunities = [], isLoading: oppsLoading, isError: oppsError } = useOpportunities("active", 4);

  if (bookingsError || profileError || statsError || oppsError) {
    return (
      <div className="p-12 min-h-screen bg-gray-50 flex items-center justify-center">
         <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  const completionScore = profile?.profile_completion_score || 0;
  const featuredResources = resources.filter((r: any) => r.featured).slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.profiles.first_name || "Student"}!</h2>
          <p className="text-gray-500">Your career journey is looking great. Here's what's happening.</p>
        </div>
        <Link 
          href="/student/profile" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#097969] text-white rounded-lg text-sm font-semibold hover:bg-[#076356] transition-colors shadow-sm"
        >
          View Profile <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Bookings */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="Available Jobs" value={studentStats?.availableJobs || 0} icon={<Briefcase size={20} />} />
            <StatCard label="Upcoming Events" value={studentStats?.upcomingEvents || 0} icon={<CalendarDays size={20} />} />
            <StatCard label="My Bookings" value={bookings.length} icon={<Calendar size={20} />} />
            <StatCard label="My Applications" value={studentStats?.myApplications || 0} icon={<Inbox size={20} />} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
              <Link href="/student/appointments" className="text-sm font-medium text-[#097969] hover:underline">
                View All
              </Link>
            </div>
            
            <div className="p-6">
              {bookingsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#097969]"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">You haven't booked any counselling sessions yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{booking.purpose}</h4>
                          <StatusBadge status={booking.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={14} />
                            {new Date(booking.start_time).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 text-right">
                        {booking.meeting_link && (
                          <a 
                            href={booking.meeting_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md"
                          >
                            <Video size={14} /> Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              <Link href="/student/applications" className="text-sm font-medium text-[#097969] hover:underline">
                View All
              </Link>
            </div>
            
            <div className="p-6">
              {appsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#097969]"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <Inbox className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">You haven't applied for any jobs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{app.opportunities?.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Opportunities Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recommended Opportunities</h3>
              <Link href="/student/jobs" className="text-sm font-medium text-[#097969] hover:underline">
                Explore All
              </Link>
            </div>
            
            <div className="p-6 bg-gray-50/50">
              {oppsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#097969]"></div>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">No active opportunities matching your profile right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.map((opp: any) => (
                    <JobCard 
                      key={opp.id} 
                      opportunity={opp} 
                      onClick={() => setSelectedOpp(opp)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Summary & Insights */}
        <div className="space-y-8">
          {/* Profile Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#097969]/10 text-[#097969] rounded-full flex items-center justify-center text-xl font-bold overflow-hidden">
                  <span>{profile?.profiles.first_name?.[0]}{profile?.profiles.last_name?.[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{profile?.profiles.first_name} {profile?.profiles.last_name}</h3>
                  <p className="text-xs text-gray-500">{profile?.department || "No department set"}</p>
                  <p className="text-xs text-gray-400">{profile?.level ? `${profile.level} Level` : "Level not set"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-500 uppercase">Profile Completion</span>
                    <span className="text-xs font-bold text-[#097969]">{completionScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="bg-[#097969] h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${completionScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" /> CV Status
                    </span>
                    {profile?.cv_url ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Uploaded
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> Missing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <LinkIcon size={14} className="text-gray-400" /> LinkedIn
                    </span>
                    {profile?.linkedin_url ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Linked
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </div>
                </div>
              </div>
              
              {completionScore < 100 && (
                <Link 
                  href="/student/profile"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-[#097969]/5 text-[#097969] text-sm font-bold rounded-xl hover:bg-[#097969]/10 transition-colors"
                >
                  Complete Profile
                </Link>
              )}
            </div>
          </div>

          {/* Career Insights Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Career Insights</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Skills Preview */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md border border-blue-100">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No skills listed yet.</p>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.career_interests && profile.career_interests.length > 0 ? (
                    profile.career_interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded-md border border-purple-100">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Add interests to get recommendations.</p>
                  )}
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="pt-4 border-t border-gray-50">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Next Steps</h4>
                <ul className="space-y-3">
                  {!profile?.cv_url && (
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></div>
                      <Link href="/student/profile" className="text-xs text-gray-600 hover:text-[#097969] transition-colors">
                        Upload your CV to apply for jobs
                      </Link>
                    </li>
                  )}
                  {(!profile?.skills || profile.skills.length === 0) && (
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <Link href="/student/profile" className="text-xs text-gray-600 hover:text-[#097969] transition-colors">
                        Add skills to your profile
                      </Link>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#097969] flex-shrink-0"></div>
                    <Link href="/student/jobs" className="text-xs text-gray-600 hover:text-[#097969] transition-colors">
                      Browse recent job opportunities
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Featured Resources Card */}
          {featuredResources.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Featured Resources</h3>
              </div>
              <div className="p-6 space-y-4">
                {featuredResources.map((res: any) => (
                  <div key={res.id} className="group cursor-pointer">
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#097969] transition-colors line-clamp-1">{res.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 uppercase">{res.category} · {res.file_size}</p>
                  </div>
                ))}
                <Link 
                  href="/student/resources"
                  className="mt-2 block text-center text-xs font-bold text-[#097969] hover:underline"
                >
                  Browse Library
                </Link>
              </div>
            </div>
          )}
        </div>
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
