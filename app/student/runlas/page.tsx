"use client";

import React, { useState } from "react";
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  User, 
  Hash, 
  Bookmark, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ArrowRight,
  X,
  FileText
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/hooks/useProfile";
import { useRunlasSubmissions, useRunlasMutation } from "@/lib/hooks/useDashboard";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import { mailer } from "@/lib/email/sendEmail";

export default function StudentRunlasPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: submissions = [], isLoading, isError, refetch } = useRunlasSubmissions(user?.id);
  const mutation = useRunlasMutation();

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    student_name: "",
    student_id_number: "",
    department: "",
    supervisor: "",
    organization: "",
    start_date: "",
    end_date: "",
    remarks: "",
  });

  // Pre-fill form when it opens
  const openForm = () => {
    if (profile) {
      setFormData({
        ...formData,
        student_name: `${profile.profiles.first_name} ${profile.profiles.last_name}`,
        student_id_number: profile.matric_number || "",
        department: profile.department || "",
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await mutation.mutateAsync({
        ...formData,
        user_id: user?.id,
        status: "pending",
      });

      // Send email notification to admin asynchronously
      mailer.sendRunlasSubmission(
        formData.student_name,
        formData.organization
      ).catch(console.error);

      if (refetch) {
        await refetch();
      }

      setSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
        setIsSubmitting(false);
        setFormData({
          student_name: "",
          student_id_number: "",
          department: "",
          supervisor: "",
          organization: "",
          start_date: "",
          end_date: "",
          remarks: "",
        });
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      setIsSubmitting(false);
    }
  };

  if (isError) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">RUN-LAS Forms</h1>
            <p className="text-gray-500 font-medium">Research and Laboratory Academic Submission portal</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={openForm}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#097969] text-white rounded-xl font-semibold hover:bg-[#076356] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-900/10"
          >
            <Plus size={20} /> New Submission
          </button>
        )}
      </div>

      {showForm ? (
        <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" />
          
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="text-emerald-600" size={24} />
              Placement Submission Form
            </h2>
            <button 
              onClick={() => setShowForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-10">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in scale-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500">
                  <CheckCircle2 size={48} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h3>
                <p className="text-gray-500 max-w-xs">Your RUN-LAS form has been sent for review. You'll be notified of the outcome.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-emerald-600" />
                    Student Details
                  </h3>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.student_name}
                        onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                        placeholder="Enter your registered name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Matric Number</label>
                        <input
                          required
                          type="text"
                          value={formData.student_id_number}
                          onChange={(e) => setFormData({...formData, student_id_number: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          placeholder="e.g. CMS/2021/001"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Department</label>
                        <input
                          required
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          placeholder="Industrial Chemistry"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placement Information */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={14} className="text-emerald-600" />
                    Placement Info
                  </h3>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Organization Name</label>
                      <input
                        required
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="e.g. Shell Nigeria"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Assigned Supervisor</label>
                      <input
                        required
                        type="text"
                        value={formData.supervisor}
                        onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Name of your industrial supervisor"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration & Remarks */}
                <div className="space-y-6 md:col-span-2 pt-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-600" />
                    Duration & Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Start Date</label>
                      <input
                        required
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Expected End Date</label>
                      <input
                        required
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Extra Remarks (Optional)</label>
                      <textarea
                        rows={3}
                        value={formData.remarks}
                        onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                        placeholder="Any additional information for the coordinator"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 flex items-center justify-end gap-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex items-center gap-2 px-10 py-3 bg-[#097969] text-white rounded-xl font-bold hover:bg-[#076356] transition-all disabled:opacity-50 disabled:shadow-none shadow-lg shadow-emerald-900/10"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Submit for Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Submissions List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Submission History</h3>
            </div>

            <div className="divide-y divide-gray-50">
              {isLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Bookmark size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">No Submissions Found</h4>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">You haven't submitted any RUN-LAS placement forms yet. Click the button above to start your first submission.</p>
                  <button
                    onClick={openForm}
                    className="text-[#097969] font-bold flex items-center gap-2 mx-auto hover:underline"
                  >
                    Start your submission <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                submissions.map((sub: any) => (
                  <div 
                    key={sub.id} 
                    className="group p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50/50 transition-all"
                  >
                    <div className="flex items-start gap-5">
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0
                        ${sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : sub.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}
                      `}>
                         <Building2 size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-gray-900">{sub.organization}</h4>
                          <StatusBadge status={sub.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Hash size={14} className="text-emerald-600" /> {sub.student_id_number}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-emerald-600" /> 
                            {new Date(sub.submitted_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={14} className="text-emerald-600" /> {sub.supervisor}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pl-19 lg:pl-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Period</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-emerald-900 text-white rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/20 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0 animate-pulse">
                <AlertCircle size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">RUN-LAS Process Support</h3>
                <p className="text-emerald-100/80 mb-6 leading-relaxed">
                  Need help with your laboratory or research placement? Our career services coordinators are available to guide you through the submission and approval process.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <Link 
                    href="/student/appointments" 
                    className="px-6 py-3 bg-white text-emerald-900 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all"
                  >
                    Book Counselling
                  </Link>
                  <a 
                    href="mailto:support@utrust.com.ng"
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10"
                  >
                   Contact Coordinator
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal Components used
import { } from "lucide-react";
import Link from "next/link";
