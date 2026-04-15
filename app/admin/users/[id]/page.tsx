"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { 
  User, Mail, Phone, BookOpen, GraduationCap, 
  FileText, Download, 
  CheckCircle2, ArrowLeft, Calendar, ExternalLink,
  Briefcase, Clock, Info, Link as LinkIcon, GitBranch
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ["admin-user-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, student_profiles(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: bookings = [], isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({
    queryKey: ["admin-user-bookings", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", id)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleStatusUpdate = async (status: string) => {
    try {
      const res = await fetch('/api/admin/users/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, status })
      });
      if (res.ok) {
        await refetchProfile();
        alert(`User status updated to ${status}`);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (profileLoading) {
    return <div className="p-8 text-center text-gray-500">Loading user profile...</div>;
  }

  if (!userProfile) {
    return <div className="p-8 text-center text-red-500">User not found.</div>;
  }

  const student = userProfile.student_profiles;
  const isStudent = userProfile.role === "student";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Navigation */}
      <Link 
        href="/admin/users" 
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a2e4a] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Users
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl font-bold border border-gray-200">
                {userProfile.role === 'employer' ? userProfile.company_name?.[0] : `${userProfile.first_name?.[0]}${userProfile.last_name?.[0]}`}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userProfile.role === "employer" && userProfile.company_name 
                    ? userProfile.company_name 
                    : `${userProfile.first_name || ''} ${userProfile.last_name || ''}`}
                </h1>
                <p className="text-gray-500 flex items-center gap-1.5">
                  <Mail size={14} /> {userProfile.email}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={userProfile.role} />
                  <StatusBadge status={userProfile.status || 'active'} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {userProfile.role === "employer" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('active')}
                    className="px-4 py-2 bg-[#097969] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#076356] transition-all shadow-lg shadow-green-900/10"
                  >
                    Approve Employer
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('inactive')}
                    className="px-4 py-2 bg-white text-red-600 border border-red-100 text-xs font-bold uppercase rounded-xl hover:bg-red-50 transition-all"
                  >
                    Deactivate
                  </button>
                </>
              )}
            </div>
          </div>

          {isStudent && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 min-w-[240px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-[#097969]">{student?.profile_completion_score || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-[#097969] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${student?.profile_completion_score || 0}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Student Profile System</p>
            </div>
          )}
        </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-8">
          {isStudent ? (
            <>
              {/* Student Career Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap size={18} className="text-[#097969]" />
                    Academic & Career Details
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Bio / About</label>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {student?.bio || "No bio provided."}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Matric Number</label>
                        <p className="text-sm font-medium text-gray-900">{student?.matric_number || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Level</label>
                        <p className="text-sm font-medium text-gray-900">{student?.level ? `${student.level} Level` : "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {student?.skills && student.skills.length > 0 ? (
                            student.skills.map((skill: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-green-50 text-[#097969] text-[10px] font-bold uppercase rounded border border-green-100">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">No skills listed.</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Career Interests</label>
                        <div className="flex flex-wrap gap-2">
                          {student?.career_interests && student.career_interests.length > 0 ? (
                            student.career_interests.map((interest: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded border border-blue-100">
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">No interests listed.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Calendar size={18} className="text-[#097969]" />
                    Booking History
                  </h3>
                  <span className="text-xs font-bold text-gray-400">{bookings.length} total</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {bookingsLoading ? (
                    <div className="p-8 text-center text-xs text-gray-400">Loading bookings...</div>
                  ) : bookings.length === 0 ? (
                    <div className="p-12 text-center">
                      <Clock size={32} className="mx-auto text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400">No booking records found for this user.</p>
                    </div>
                  ) : (
                    bookings.map((booking: any) => (
                      <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            booking.status === 'approved' ? 'bg-green-50 text-green-600' :
                            booking.status === 'rejected' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{booking.purpose}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                              {new Date(booking.start_time).toLocaleDateString()} · {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Briefcase size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Employer Profile</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Detailed employer profile management is coming soon. You can currently manage their opportunities in the Opportunities section.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* CV Card */}
          {isStudent && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-[#097969]" />
                  Student CV
                </h3>
              </div>
              <div className="p-6 text-center">
                {student?.cv_url ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-dashed border-green-200">
                      <CheckCircle2 size={32} className="text-[#097969] mx-auto mb-2" />
                      <p className="text-xs font-bold text-[#097969] uppercase tracking-wider">CV Document Available</p>
                    </div>
                    <a 
                      href={student.cv_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a2e4a] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#2a3e5a] transition-all"
                    >
                      <Download size={14} /> Download CV
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <FileText size={32} className="mx-auto text-gray-200 mb-2" />
                      <p className="text-xs text-gray-400 font-medium">No CV Uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social / Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <Info size={16} className="text-[#097969]" />
                Online Presence
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <LinkIcon size={14} className="text-[#0077b5]" /> LinkedIn
                </span>
                {student?.linkedin_url ? (
                  <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    Visit <ExternalLink size={12} />
                  </a>
                ) : <span className="text-gray-300">N/A</span>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <GitBranch size={14} className="text-gray-900" /> GitHub
                </span>
                {student?.github_url ? (
                  <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    Visit <ExternalLink size={12} />
                  </a>
                ) : <span className="text-gray-300">N/A</span>}
              </div>
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} /> {userProfile.phone || "No phone number"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} /> Joined {new Date(userProfile.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
