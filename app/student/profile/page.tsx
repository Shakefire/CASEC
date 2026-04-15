"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useProfile, useCVUpload } from "@/lib/hooks/useProfile";
import { 
  User, Mail, BookOpen, GraduationCap, 
  FileText, Upload, Download, 
  CheckCircle2, AlertCircle, Loader2, Save, Link as LinkIcon, GitBranch, Plus, Globe
} from "lucide-react";

export default function StudentProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, isError, error, updateProfile, refetch } = useProfile(user?.id);
  const cvUpload = useCVUpload(user?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debugging logs (visible in dev console)
  useEffect(() => {
    if (user) console.log("👤 Current User:", user.id);
    if (profile) console.log("📄 Profile Loaded:", profile);
    if (isError) console.error("❌ Profile Fetch Error:", (error as any)?.message || error);
  }, [user, profile, isError, error]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    department: "",
    level: "",
    matric_number: "",
    bio: "",
    skills: "",
    career_interests: "",
    linkedin_url: "",
    github_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile && !hasInitialized) {
      setFormData({
        first_name: profile.profiles?.first_name || "",
        last_name: profile.profiles?.last_name || "",
        department: profile.department || "",
        level: profile.level || "",
        matric_number: profile.matric_number || "",
        bio: profile.bio || "",
        skills: profile.skills?.join(", ") || "",
        career_interests: profile.career_interests?.join(", ") || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
      });
      setHasInitialized(true);
    }
  }, [profile, hasInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const { first_name, last_name, ...studentUpdates } = formData;
    
    // Process tags
    const skillsArray = formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    const interestsArray = formData.career_interests.split(",").map((s: string) => s.trim()).filter(Boolean);

    updateProfile.mutate({
      profiles: { first_name, last_name, email: profile?.profiles.email || user?.email || "" },
      ...studentUpdates,
      skills: skillsArray,
      career_interests: interestsArray,
    } as any, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      cvUpload.mutate(file);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="animate-spin text-[#097969]" size={32} />
        <p className="text-gray-500 animate-pulse text-sm">Verifying your session...</p>
      </div>
    );
  }

  if (profileLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="animate-spin text-[#097969]" size={32} />
        <p className="text-gray-500 animate-pulse text-sm">Loading your profile data...</p>
      </div>
    );
  }

  if (isError || (!profileLoading && !profile)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-4 bg-white rounded-2xl border border-red-100 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Failed to Load Profile</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mt-1">
            {error instanceof Error ? error.message : "We couldn't find your student profile. Please ensure you are logged in as a student."}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => refetch()}
            className="px-6 py-2 bg-[#097969] text-white rounded-lg text-sm font-semibold hover:bg-[#076356] transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const completionScore = profile?.profile_completion_score || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header & Completion Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-[#097969]/10 text-[#097969] rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white shadow-sm">
              <span>{profile?.profiles.first_name?.[0]}{profile?.profiles.last_name?.[0]}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.profiles.first_name} {profile?.profiles.last_name}
              </h1>
              <p className="text-gray-500 flex items-center gap-1.5">
                <Mail size={14} /> {profile?.profiles.email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium uppercase tracking-wider">
                  Student
                </span>
                {profile?.department && (
                  <span className="px-2.5 py-1 rounded-md bg-[#097969]/10 text-[#097969] text-xs font-medium">
                    {profile.department}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 min-w-[240px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-[#097969]">{completionScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-[#097969] h-2 rounded-full transition-all duration-500" 
                style={{ width: `${completionScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {completionScore < 100 
                ? "Complete your profile to increase your visibility to employers." 
                : "Your profile is fully optimized! Keep it updated."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Personal & Academic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-[#097969]" />
                Personal & Academic Information
              </h3>
              {!isEditing && (
                <button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-semibold text-[#097969] hover:underline"
                >
                  Edit Details
                </button>
              )}
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                  <input 
                    disabled={!isEditing}
                    name="first_name"
                    value={formData?.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                  <input 
                    disabled={!isEditing}
                    name="last_name"
                    value={formData?.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label>
                  <input 
                    disabled={!isEditing}
                    name="department"
                    value={formData?.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level</label>
                  <select 
                    disabled={!isEditing}
                    name="level"
                    value={formData?.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 transition-all"
                  >
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Matric Number</label>
                  <input 
                    disabled={!isEditing}
                    name="matric_number"
                    value={formData?.matric_number}
                    onChange={handleInputChange}
                    placeholder="e.g. RUN/2021/1234"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Bio & Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={18} className="text-[#097969]" />
                Professional Summary & Skills
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bio / About You</label>
                <textarea 
                  disabled={!isEditing}
                  name="bio"
                  value={formData?.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your professional background, goals, and achievements..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 transition-all resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skills (Comma separated)</label>
                <input 
                  disabled={!isEditing}
                  name="skills"
                  value={formData?.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. React, Python, UI Design, Project Management"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.skills?.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-50 text-[#097969] text-[10px] font-bold uppercase rounded-md border border-green-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* CV Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-[#097969]" />
                Curriculum Vitae
              </h3>
            </div>
            <div className="p-6 text-center">
              {profile?.cv_url ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-dashed border-green-200 flex flex-col items-center">
                    <CheckCircle2 size={32} className="text-[#097969] mb-2" />
                    <p className="text-sm font-semibold text-[#097969]">CV Uploaded</p>
                    <p className="text-xs text-gray-500 mt-1">Ready for applications</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={profile.cv_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download size={16} /> View
                    </a>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-[#097969]/10 text-[#097969] text-sm font-semibold rounded-lg hover:bg-[#097969]/20 transition-colors"
                    >
                      <Upload size={16} /> Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center">
                    <Upload size={32} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No CV uploaded yet</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={cvUpload.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#097969] text-white text-sm font-semibold rounded-lg hover:bg-[#076356] transition-colors disabled:opacity-50"
                  >
                    {cvUpload.isPending ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18} /> Upload CV</>}
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx"
              />
              <p className="text-[10px] text-gray-400 mt-4">Accepted: PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Globe size={18} className="text-[#097969]" />
                Online Presence
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon size={14} className="text-[#0077b5]" /> LinkedIn URL
                </label>
                <input 
                  disabled={!isEditing}
                  name="linkedin_url"
                  value={formData?.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <GitBranch size={14} className="text-gray-900" /> GitHub URL (Optional)
                </label>
                <input 
                  disabled={!isEditing}
                  name="github_url"
                  value={formData?.github_url}
                  onChange={handleInputChange}
                  placeholder="github.com/username"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent outline-none disabled:opacity-60 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex flex-col gap-3 pt-4">
              <button 
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#097969] text-white font-bold rounded-xl hover:bg-[#076356] transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
              >
                {updateProfile.isPending ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
              </button>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full px-6 py-3 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
