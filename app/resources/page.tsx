"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Download,
  Heart,
  Play,
  Eye,
  FileText,
  Video,
  FileUp,
  Filter,
  X,
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  category?: string;
  type?: string;
  description?: string;
  downloads?: number;
  featured?: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  speaker?: string;
  thumbnailUrl: string;
  videoUrl: string;
  uploadedAt: string;
  views?: number;
  featured?: boolean;
}

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  thumbnail?: string;
  previewUrl?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [cvTemplates, setCvTemplates] = useState<CVTemplate[]>([]);
  const [activeTab, setActiveTab] = useState("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch resources
        const { data: resData, error: resError } = await supabase
          .from("resources")
          .select("*")
          .order("uploaded_at", { ascending: false });
        
        if (resError) {
          console.error("ResourcesPage: Supabase resources error:", resError);
          setError("Failed to load documents.");
        } else if (resData) {
          setResources(resData.map((r: any) => ({
            id: r.id, title: r.title, fileName: r.file_name, fileSize: r.file_size,
            uploadedAt: r.uploaded_at, uploadedBy: r.uploaded_by, category: r.category,
            type: r.type, description: r.description, downloads: r.downloads, featured: r.featured,
          })));
        }

        // Fetch videos
        const { data: vidData, error: vidError } = await supabase
          .from("videos")
          .select("*")
          .order("uploaded_at", { ascending: false });
        
        if (vidError) {
          console.error("ResourcesPage: Supabase videos error:", vidError);
          setError("Failed to load videos.");
        } else if (vidData) {
          setVideos(vidData.map((v: any) => ({
            id: v.id, title: v.title, description: v.description, category: v.category,
            duration: v.duration, speaker: v.speaker, thumbnailUrl: v.thumbnail_url,
            videoUrl: v.video_url, uploadedAt: v.uploaded_at, views: v.views, featured: v.featured,
          })));
        }

        // Fetch CV templates
        const { data: tplData, error: tplError } = await supabase.from("cv_templates").select("*");
        
        if (tplError) {
          console.error("ResourcesPage: Supabase templates error:", tplError);
          setError("Failed to load templates.");
        } else if (tplData) {
          setCvTemplates(tplData.map((t: any) => ({
            id: t.id, name: t.name, description: t.description, style: t.style,
            thumbnail: t.thumbnail, previewUrl: t.preview_url,
          })));
          if (tplData.length > 0) setSelectedTemplateId(tplData[0].id);
        }
      } catch (err: any) {
        console.error("ResourcesPage: Data fetch crash:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const [cvFormData, setCvFormData] = useState({
    fullName: "Jane Doe",
    title: "Aspiring Data Analyst",
    location: "Lagos, Nigeria",
    email: "jane.doe@example.com",
    phone: "+234 801 234 5678",
    summary:
      "Motivated graduate with strong analytical skills and a passion for turning data into strategic insights.",
    skills: "Data analysis · Excel · SQL · Power BI · Team collaboration",
    experience:
      "Intern, Data Support | University, Nigeria Career Services\n• Managed student application tracking and created weekly performance dashboards.",
  });

  const sectionCopy = {
    documents: {
      title: "Documents",
      subtitle:
        "Download career-ready guides, templates, and checklists to support your application journey.",
    },
    videos: {
      title: "Videos",
      subtitle:
        "Watch expert-led tutorials and actionable career tips to improve your interview and resume skills.",
    },
    "cv-builder": {
      title: "CV Builder",
      subtitle:
        "Launch the resume builder experience with a modern ATS-friendly workflow and easy PDF export.",
    },
  };

  const activeHero = sectionCopy[activeTab as keyof typeof sectionCopy];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(resources.map((r) => r.category));
    return Array.from(cats).sort();
  }, [resources]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || resource.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, categoryFilter]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || video.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [videos, searchQuery, categoryFilter]);

  const selectedTemplate = useMemo(
    () => cvTemplates.find((template) => template.id === selectedTemplateId) ?? cvTemplates[0],
    [selectedTemplateId, cvTemplates]
  );

  const updateCvField = (field: keyof typeof cvFormData, value: string) => {
    setCvFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSaveResource = (id: string) => {
    setSavedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSaveVideo = (id: string) => {
    setSavedVideos((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#097969] py-14 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.24em] text-emerald-200">
            <span>Resources</span>
            <span className="inline-flex h-1 w-1 rounded-full bg-emerald-200" />
            <span>{activeHero.title}</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            {activeHero.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-emerald-100 leading-8">
            {activeHero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { id: "documents", label: "Documents" },
              { id: "videos", label: "Videos" },
              { id: "cv-builder", label: "CV Builder" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveTab(section.id);
                  setCategoryFilter("all");
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeTab === section.id
                    ? "border-white bg-white/10 text-white"
                    : "border-white/30 text-emerald-100 hover:border-white hover:bg-white/10 hover:text-white"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#097969]"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading resources...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <X className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources, videos, templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-transparent"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {[
            { id: "documents", label: "Documents", icon: FileText },
            { id: "videos", label: "Videos", icon: Video },
            { id: "cv-builder", label: "CV Builder", icon: FileUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCategoryFilter("all");
              }}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#097969] text-[#097969]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div>
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4 text-gray-500" />
                <span>Filter by category</span>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Documents Grid */}
            {filteredDocuments.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-3">
                {filteredDocuments.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Featured Badge */}
                      {resource.featured && (
                        <div className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          ⭐ Featured
                        </div>
                      )}

                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#097969] cursor-pointer">
                        {resource.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {resource.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {resource.category}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {resource.type}
                        </span>
                      </div>

                      {/* Downloads Count */}
                      {resource.downloads && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <Download className="h-4 w-4" />
                          <span>{resource.downloads.toLocaleString()} downloads</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedResource(resource)}
                          className="flex-1 bg-[#097969] text-white py-2 rounded-lg hover:bg-[#065f52] font-medium flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <button
                          onClick={() => toggleSaveResource(resource.id)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            savedResources.includes(resource.id)
                              ? "bg-pink-50 border-pink-300"
                              : "border-gray-300"
                          }`}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              savedResources.includes(resource.id)
                                ? "fill-pink-500 text-pink-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* File Info */}
                      <div className="text-xs text-gray-400 mt-4 pt-4 border-t">
                        {resource.fileSize} • Uploaded {resource.uploadedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No documents found matching your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div>
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969]"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(videos.map((v) => v.category)))
                  .sort()
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            {/* Videos Grid */}
            {filteredVideos.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-3">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative bg-gray-900 h-40">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setSelectedVideo(video)}
                          className="bg-white rounded-full p-4 hover:bg-gray-100 transition-colors"
                        >
                          <Play className="h-6 w-6 text-[#097969] fill-current" />
                        </button>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>

                      {/* Featured Badge */}
                      {video.featured && (
                        <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                          ⭐
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{video.speaker}</p>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {video.description}
                      </p>

                      {/* Category Badge */}
                      <div className="mb-4">
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          {video.category}
                        </span>
                      </div>

                      {/* View Count */}
                      {video.views && (
                        <div className="text-xs text-gray-500 mb-4">
                          👁️ {video.views.toLocaleString()} views
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedVideo(video)}
                          className="flex-1 bg-[#097969] text-white py-2 rounded-lg hover:bg-[#065f52] font-medium flex items-center justify-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Watch
                        </button>
                        <button
                          onClick={() => toggleSaveVideo(video.id)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            savedVideos.includes(video.id)
                              ? "bg-pink-50 border-pink-300"
                              : "border-gray-300"
                          }`}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              savedVideos.includes(video.id)
                                ? "fill-pink-500 text-pink-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No videos found matching your filters</p>
              </div>
            )}
          </div>
        )}

        {/* CV Builder Tab */}
        {activeTab === "cv-builder" && (
          <div className="space-y-10">
            <div className="bg-white rounded-[36px] border border-gray-200 p-8 shadow-[0_32px_80px_rgba(9,121,105,0.08)]">
              <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-[#065f52]">
                    Resume Builder
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                      CASEC Resume Builder
                    </h2>
                    <p className="mt-4 max-w-xl text-gray-600 leading-7">
                      Create a modern, professional, ATS-friendly resume in minutes — completely free, no sign-up required, and your data stays private in your browser.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://www.open-resume.com/resume-import"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#097969] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#097969]/15 hover:bg-[#065f52] transition"
                    >
                      Build My Resume
                    </a>
                    <a
                      href="https://www.open-resume.com/resume-import"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-[#097969] hover:text-[#097969] transition"
                    >
                      Import Existing Resume
                    </a>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <p className="text-3xl font-bold text-[#097969]">100%</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">Free to Use</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <p className="text-3xl font-bold text-[#097969]">0</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">Sign-ups Required</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <p className="text-3xl font-bold text-[#097969]">PDF</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">Instant Download</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[28px] border border-gray-200 bg-[#f7fdfb] p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Preview</h3>
                    <p className="text-gray-600 text-sm">See your resume update instantly as you type. No lag, no waiting — just a live preview of your final PDF.</p>
                  </div>
                  <div className="rounded-[28px] border border-gray-200 bg-[#f7fdfb] p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Professional Design</h3>
                    <p className="text-gray-600 text-sm">ATS-friendly resume design that adheres to best practices with clean spacing and polished sections.</p>
                  </div>
                  <div className="rounded-[28px] border border-gray-200 bg-[#f7fdfb] p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
                    <p className="text-gray-600 text-sm">Your resume data stays in your browser. No sign-up needed and no information is uploaded to a server.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Everything You Need</h3>
                <p className="text-gray-600 text-sm leading-7">CASEC Resume Builder is packed with features to help you land your dream job or internship.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Existing Resume</h3>
                <p className="text-gray-600 text-sm">Already have a resume? Import a PDF and update it to a modern professional design in seconds.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Download as PDF</h3>
                <p className="text-gray-600 text-sm">Download your polished resume as a professional PDF file ready to send to employers and job portals.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-3 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#097969] text-white">1</div>
                  <h4 className="text-lg font-semibold text-gray-900">Fill In Your Details</h4>
                  <p className="mt-2 text-sm text-gray-600">Enter your personal information, work experience, education, skills, and projects in the easy-to-use form.</p>
                </div>
                <div>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#097969] text-white">2</div>
                  <h4 className="text-lg font-semibold text-gray-900">Preview in Real Time</h4>
                  <p className="mt-2 text-sm text-gray-600">Watch your professional resume come to life as you type. Make edits and see results instantly.</p>
                </div>
                <div>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#097969] text-white">3</div>
                  <h4 className="text-lg font-semibold text-gray-900">Download & Apply</h4>
                  <p className="mt-2 text-sm text-gray-600">Download your resume as a PDF and start applying to your dream jobs, internships, and graduate programs.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ready to Build Your Resume?</h3>
                  <p className="text-sm text-gray-500">Join thousands of students from University, Nigeria who have built professional resumes with CASEC.</p>
                </div>
                <a
                  href="https://www.open-resume.com/resume-import"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#097969] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#097969]/15 hover:bg-[#065f52] transition"
                >
                  Get Started Now — It’s Free
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-[#097969] bg-[#effaf7] p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#065f52]">Your Privacy is Our Priority</h3>
                  <p className="mt-3 text-gray-700 text-sm leading-7">Unlike other resume builders, CASEC Resume Builder runs entirely in your browser. Your personal information, work history, and resume data are never uploaded to any server. No account needed. No data collection.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    "No sign-up",
                    "No data storage",
                    "Works offline",
                    "Open source",
                  ].map((label) => (
                    <div key={label} className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-[#065f52] shadow-sm">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab("videos")}
                className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-[#097969] hover:text-[#097969] transition"
              >
                Back to Videos
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className="rounded-full border border-[#097969] bg-[#097969] px-5 py-3 text-sm font-semibold text-white hover:bg-[#065f52] transition"
              >
                Back to Documents
              </button>
            </div>
          </div>
        )}
      </>
    )}
  </main>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedResource?.title}
              </h2>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">{selectedResource?.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">{selectedResource?.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">File Type</p>
                  <p className="font-semibold">{selectedResource?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">File Size</p>
                  <p className="font-semibold">{selectedResource?.fileSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Downloads</p>
                  <p className="font-semibold">
                    {selectedResource?.downloads?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-[#097969] text-white py-3 rounded-lg hover:bg-[#065f52] font-medium flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Now
                </button>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-96 overflow-y-auto">
            <div className="relative bg-black h-64 flex items-center justify-center">
              {/* Embed YouTube player or video thumbnail */}
              <iframe
                width="100%"
                height="256"
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-600">by {selectedVideo.speaker}</p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-4">{selectedVideo.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                <div>
                  <p className="text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{selectedVideo.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Views</p>
                  <p className="font-semibold text-gray-900">
                    {selectedVideo.views?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{selectedVideo.category}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => selectedVideo && toggleSaveVideo(selectedVideo.id)}
                  className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 border ${
                    selectedVideo && savedVideos.includes(selectedVideo.id)
                      ? "bg-pink-50 border-pink-300 text-pink-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      selectedVideo && savedVideos.includes(selectedVideo.id)
                        ? "fill-pink-500 text-pink-500"
                        : ""
                    }`}
                  />
                  {selectedVideo && savedVideos.includes(selectedVideo.id) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
