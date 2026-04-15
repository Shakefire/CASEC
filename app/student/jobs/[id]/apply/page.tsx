"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, 
  User, GraduationCap, Briefcase, FileText, HelpCircle, 
  Send, Loader2, UploadCloud, Link as LinkIcon, Building2,
  MapPin, Calendar, DollarSign, AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useOpportunities } from "@/lib/hooks/useDashboard";
import { useProfile } from "@/lib/hooks/useProfile";
import Link from "next/link";
import { FormField, Input, Textarea, Select } from "@/components/ui/FormField";

const STEPS = [
  { id: 1, name: "Personal", icon: User },
  { id: 2, name: "Academic", icon: GraduationCap },
  { id: 3, name: "Professional", icon: Briefcase },
  { id: 4, name: "Documents", icon: FileText },
  { id: 5, name: "Questions", icon: HelpCircle },
  { id: 6, name: "Review", icon: Send },
];

export default function JobApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = params.id as string;

  const { data: opportunities = [] } = useOpportunities("active");
  const job = opportunities.find(o => o.id === jobId);
  const { data: profile } = useProfile(user?.id);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Personal
    full_name: "",
    email: "",
    phone: "",
    // Academic
    student_id_num: "",
    department: "",
    level: "",
    cgpa: "",
    graduation_year: "",
    // Professional
    linked_in_url: "",
    portfolio_url: "",
    github_url: "",
    // Documents (URLs after upload)
    resume_url: "",
    cover_letter: "",
    transcript_url: "",
    // Answers for dynamic questions
    answers: {} as Record<string, any>
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: `${profile.profiles.first_name || ""} ${profile.profiles.last_name || ""}`.trim(),
        email: profile.profiles.email || "",
        phone: (profile as any).phone || "",
        student_id_num: profile.matric_number || "",
        department: profile.department || "",
        level: profile.level || "",
        cgpa: profile.profile_completion_score ? (profile.profile_completion_score / 20).toFixed(2) : "", // mock cgpa
        graduation_year: "2024",
        resume_url: profile.cv_url || ""
      }));
    }
  }, [profile]);

  // Load custom questions
  useEffect(() => {
    async function fetchQuestions() {
      const { data } = await supabase
        .from("application_questions")
        .select("*")
        .eq("job_id", jobId);
      if (data) setQuestions(data);
    }
    if (jobId) fetchQuestions();
  }, [jobId]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `applications/${fileName}`;

      // 1. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("CV")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("CV")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, [field]: publicUrl }));
      
    } catch (err: any) {
      console.error("Upload Error:", err);
      setUploadError(err.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, STEPS.length));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Submit Main Application
      const { data: application, error: appError } = await supabase
        .from("job_applications")
        .insert([{
          student_id: user?.id,
          job_id: jobId,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          student_id_num: formData.student_id_num,
          department: formData.department,
          level: formData.level,
          cgpa: parseFloat(formData.cgpa) || null,
          graduation_year: parseInt(formData.graduation_year) || null,
          linked_in_url: formData.linked_in_url,
          portfolio_url: formData.portfolio_url,
          github_url: formData.github_url,
          resume_url: formData.resume_url,
          cover_letter: formData.cover_letter,
          transcript_url: formData.transcript_url,
          status: "submitted"
        }])
        .select()
        .single();

      if (appError) throw appError;

      // 2. Submit Answers
      if (questions.length > 0 && application) {
        const answersPayload = questions.map(q => ({
          application_id: application.id,
          question_id: q.id,
          answer: String(formData.answers[q.id] || "")
        }));

        const { error: ansError } = await supabase
          .from("application_answers")
          .insert(answersPayload);
        
        if (ansError) throw ansError;
      }

      // 3. Trigger Application Notification (Non-blocking)
      fetch("/api/emails/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: formData.email,
          studentName: formData.full_name,
          employerEmail: (job as any)?.postedByEmail,
          employerName: job?.postedByName || "Employer",
          jobTitle: job?.title || "Opportunity"
        })
      }).catch(err => console.error("Failed to send application email:", err));

      setIsSuccess(true);
    } catch (err: any) {
      alert("Submission failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-[#097969]" size={40} />
      <p className="text-gray-500 font-medium">Loading opportunity details...</p>
    </div>
  );

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-8">
            Your application for <span className="font-bold">"{job.title}"</span> has been received. You can track its status in your dashboard.
          </p>
          <div className="space-y-4">
            <Link 
              href="/student" 
              className="block w-full py-4 bg-[#097969] text-white rounded-2xl font-bold hover:bg-[#076356] transition-all shadow-lg active:scale-95"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/student/applications" 
              className="block w-full py-4 text-[#097969] bg-green-50 rounded-2xl font-bold hover:bg-green-100 transition-all"
            >
              View My Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Applying for</h2>
              <h1 className="text-xl font-black text-gray-900">{job.title}</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? "bg-[#097969] text-white shadow-lg" : 
                    isPast ? "bg-green-50 text-[#097969]" : "bg-gray-50 text-gray-300"
                  }`}>
                    {isPast ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isActive ? "text-[#097969]" : "text-gray-300"
                  }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Progress bar for mobile */}
        <div className="h-1 bg-gray-100 w-full overflow-hidden">
          <div 
            className="h-full bg-[#097969] transition-all duration-500 ease-out" 
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Form Section */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[600px] flex flex-col">
              
              {/* Step Content */}
              <div className="flex-1">
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-green-50 text-[#097969] rounded-2xl flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Personal Information</h3>
                        <p className="text-gray-500">Confirm your contact details for the recruiter.</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField label="Full Name">
                        <Input 
                          value={formData.full_name} 
                          onChange={e => setFormData({...formData, full_name: e.target.value})}
                          placeholder="Your full legal name"
                        />
                      </FormField>
                      <FormField label="Email Address">
                        <Input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="professional.email@example.com"
                        />
                      </FormField>
                      <FormField label="Phone Number">
                        <Input 
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          placeholder="+234 ..."
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Academic Background</h3>
                        <p className="text-gray-500">Share your educational achievements.</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField label="Department / Major">
                        <Input 
                          value={formData.department} 
                          onChange={e => setFormData({...formData, department: e.target.value})}
                          placeholder="e.g. Computer Science"
                        />
                      </FormField>
                      <FormField label="Student ID Number">
                        <Input 
                          value={formData.student_id_num} 
                          onChange={e => setFormData({...formData, student_id_num: e.target.value})}
                          placeholder="NAUB/000/000"
                        />
                      </FormField>
                      <FormField label="Current Level">
                        <Select 
                          value={formData.level} 
                          onChange={e => setFormData({...formData, level: e.target.value})}
                        >
                          <option value="">Select Level</option>
                          <option value="100">100 Level</option>
                          <option value="200">200 Level</option>
                          <option value="300">300 Level</option>
                          <option value="400">400 Level</option>
                          <option value="500">500 Level</option>
                        </Select>
                      </FormField>
                      <FormField label="Current CGPA">
                        <Input 
                          type="number" step="0.01"
                          value={formData.cgpa} 
                          onChange={e => setFormData({...formData, cgpa: e.target.value})}
                          placeholder="0.00 - 5.00"
                        />
                      </FormField>
                      <FormField label="Graduation Year">
                        <Input 
                          type="number"
                          value={formData.graduation_year} 
                          onChange={e => setFormData({...formData, graduation_year: e.target.value})}
                          placeholder="e.g. 2024"
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Professional Profile</h3>
                        <p className="text-gray-500">Help the recruiter find you online.</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <FormField label="LinkedIn URL">
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            className="pl-12"
                            value={formData.linked_in_url} 
                            onChange={e => setFormData({...formData, linked_in_url: e.target.value})}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                      </FormField>
                      <FormField label="Portfolio URL (Optional)">
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            className="pl-12"
                            value={formData.portfolio_url} 
                            onChange={e => setFormData({...formData, portfolio_url: e.target.value})}
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                      </FormField>
                      <FormField label="GitHub URL (Optional)">
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            className="pl-12"
                            value={formData.github_url} 
                            onChange={e => setFormData({...formData, github_url: e.target.value})}
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                      </FormField>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Supporting Documents</h3>
                        <p className="text-gray-500">Upload your CV and other necessary files.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50 flex flex-col items-center justify-center text-center transition-all duration-300">
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-4 py-4">
                            <Loader2 className="animate-spin text-[#097969]" size={48} />
                            <p className="text-[#097969] font-black uppercase tracking-widest text-xs">Uploading Resume...</p>
                          </div>
                        ) : formData.resume_url ? (
                          <div className="flex flex-col items-center gap-4 py-2">
                             <div className="w-16 h-16 bg-green-50 text-[#097969] rounded-full flex items-center justify-center shadow-inner">
                                <CheckCircle2 size={32} />
                             </div>
                             <div>
                                <h4 className="font-black text-gray-900 mb-1">Successfully Uploaded!</h4>
                                <p className="text-xs text-green-600 font-bold tracking-tight">Your CV has been attached to the application.</p>
                             </div>
                             <label className="mt-4 text-[10px] font-black uppercase text-gray-400 cursor-pointer hover:text-[#097969] transition-colors underline">
                                Change Document
                                <input type="file" className="hidden" onChange={e => handleFileUpload(e, "resume_url")} accept=".pdf,.doc,.docx" />
                             </label>
                          </div>
                        ) : (
                          <>
                            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                               <UploadCloud size={40} className="text-[#097969] opacity-40" />
                            </div>
                            <h4 className="font-black text-gray-900 mb-2">Upload Resume / CV</h4>
                            <p className="text-sm text-gray-400 mb-8 max-w-[200px] leading-relaxed">Please attach your most recent CV (PDF or DOCX max 5MB)</p>
                            
                            {uploadError && (
                              <div className="mb-6 px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-100 uppercase tracking-tight flex items-center gap-2">
                                 <AlertCircle size={10} /> {uploadError}
                              </div>
                            )}

                            <label className="inline-flex items-center gap-2 bg-white px-10 py-4 rounded-2xl shadow-xl shadow-green-900/5 border border-gray-100 text-[#097969] font-black text-sm cursor-pointer hover:bg-[#097969] hover:text-white transition-all active:scale-95">
                              Select File
                              <input type="file" className="hidden" onChange={e => handleFileUpload(e, "resume_url")} accept=".pdf,.doc,.docx" />
                            </label>
                          </>
                        )}
                      </div>

                      <FormField label="Cover Letter (Optional)">
                        <Textarea 
                          rows={6} 
                          value={formData.cover_letter}
                          onChange={e => setFormData({...formData, cover_letter: e.target.value})}
                          placeholder="Introduce yourself and explain why you are the best fit for this role..."
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <HelpCircle size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Employer Questions</h3>
                        <p className="text-gray-500">Please answer the specific questions from {job.postedByName}.</p>
                      </div>
                    </div>
                    
                    {questions.length > 0 ? (
                      <div className="space-y-6">
                        {questions.map((q) => (
                          <FormField key={q.id} label={q.question} required={q.required}>
                            {q.type === "text" && (
                              <Input 
                                value={formData.answers[q.id] || ""}
                                onChange={e => setFormData({
                                  ...formData, 
                                  answers: { ...formData.answers, [q.id]: e.target.value }
                                })}
                              />
                            )}
                            {q.type === "long_text" && (
                              <Textarea 
                                rows={4}
                                value={formData.answers[q.id] || ""}
                                onChange={e => setFormData({
                                  ...formData, 
                                  answers: { ...formData.answers, [q.id]: e.target.value }
                                })}
                              />
                            )}
                            {q.type === "yes_no" && (
                              <Select
                                value={formData.answers[q.id] || ""}
                                onChange={e => setFormData({
                                  ...formData, 
                                  answers: { ...formData.answers, [q.id]: e.target.value }
                                })}
                              >
                                <option value="">Identify Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Select>
                            )}
                            {q.type === "dropdown" && q.options && (
                              <Select
                                value={formData.answers[q.id] || ""}
                                onChange={e => setFormData({
                                  ...formData, 
                                  answers: { ...formData.answers, [q.id]: e.target.value }
                                })}
                              >
                                <option value="">Select option</option>
                                {q.options.map((opt: string) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </Select>
                            )}
                          </FormField>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-100">
                        <CheckCircle2 className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-400 font-medium">No custom questions for this role.</p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                        <Send size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Review & Submit</h3>
                        <p className="text-gray-500">Double check your application before sending.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Info</h4>
                          <p className="font-black text-gray-900">{formData.full_name}</p>
                          <p className="text-sm text-gray-500">{formData.email}</p>
                          <p className="text-sm text-gray-500">{formData.phone}</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Academic</h4>
                          <p className="font-black text-gray-900">{formData.department}</p>
                          <p className="text-sm text-gray-500">Level: {formData.level} | CGPA: {formData.cgpa}</p>
                        </div>
                      </div>

                      <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="text-[#097969]" />
                          <div>
                            <p className="font-bold text-green-900">Resume Attached</p>
                            <p className="text-xs text-green-700 opacity-70">Ready for submission</p>
                          </div>
                        </div>
                        <CheckCircle2 className="text-[#097969]" />
                      </div>

                      <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-900/50 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Building2 size={12}/> Role Details
                        </h4>
                        <p className="text-sm text-blue-900">Applying for <span className="font-black uppercase tracking-tight">{job.title}</span> position.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="pt-12 border-t border-gray-100 mt-12 flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-0"
                >
                  <ChevronLeft size={20} /> Previous
                </button>

                {currentStep === STEPS.length ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.resume_url}
                    className="flex items-center gap-2 px-10 py-3 bg-[#097969] text-white rounded-xl font-bold hover:bg-[#076356] transition-all shadow-xl shadow-green-900/20 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="animate-spin" size={20} /> Submitting...</>
                    ) : (
                      <><Send size={20} /> Submit Application</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-10 py-3 bg-[#097969] text-white rounded-xl font-bold hover:bg-[#076356] transition-all shadow-xl shadow-green-900/20 active:scale-95"
                  >
                    Next Step <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-28">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Job Summary</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 size={18} className="text-gray-400"/>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-300">Company</label>
                    <p className="text-sm font-bold text-gray-700">{job.postedByName}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-gray-400"/>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-300">Location</label>
                    <p className="text-sm font-bold text-gray-700">{job.location}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign size={18} className="text-gray-400"/>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-300">Salary</label>
                    <p className="text-sm font-bold text-green-600">₦{job.salary || "Not Specified"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-gray-400"/>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-300">Deadline</label>
                    <p className="text-sm font-bold text-red-500">{new Date(job.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  By submitting your application, you agree to CASEC's terms of service and allow the employer to review your professional data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
