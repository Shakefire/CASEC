"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Filter, MapPin, Briefcase, GraduationCap, Users, Trophy, Handshake, Globe, Star, MessageCircle, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

// Mock data for alumni
const alumniData = [
  {
    id: 1,
    name: "Sarah Johnson",
    graduationYear: 2020,
    course: "Computer Science",
    department: "Computing",
    currentRole: "Software Engineer",
    company: "Google",
    location: "San Francisco, USA",
    photo: "/images/alumni/sarah.jpg",
    industry: "Tech",
    verified: true,
    mentorshipStatus: "available",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    bio: "Passionate about AI and machine learning. Leading projects at Google.",
    achievements: ["Google Top Contributor 2023", "Published 5 research papers"]
  },
  {
    id: 2,
    name: "Michael Adebayo",
    graduationYear: 2019,
    course: "Business Administration",
    department: "Business",
    currentRole: "Investment Banker",
    company: "Goldman Sachs",
    location: "London, UK",
    photo: "/images/alumni/michael.jpg",
    industry: "Finance",
    verified: true,
    mentorshipStatus: "limited",
    linkedin: "https://linkedin.com/in/michaeladebayo",
    bio: "Specializing in emerging markets investment and financial advisory.",
    achievements: ["CFA Charterholder", "Led $500M deal"]
  },
  {
    id: 3,
    name: "Dr. Amara Nwosu",
    graduationYear: 2015,
    course: "Medicine",
    department: "Medical Sciences",
    currentRole: "Chief Medical Officer",
    company: "Lagos University Teaching Hospital",
    location: "Lagos, Nigeria",
    photo: "/images/alumni/amara.jpg",
    industry: "Healthcare",
    verified: true,
    mentorshipStatus: "available",
    linkedin: "https://linkedin.com/in/dramaranwosu",
    bio: "Dedicated to healthcare innovation and medical education in Nigeria.",
    achievements: ["Published 15+ papers", "WHO Consultant"]
  },
  {
    id: 4,
    name: "David Chen",
    graduationYear: 2021,
    course: "Entrepreneurship",
    department: "Business",
    currentRole: "CEO & Founder",
    company: "TechStart Nigeria",
    location: "Lagos, Nigeria",
    photo: "/images/alumni/david.jpg",
    industry: "Tech",
    verified: true,
    mentorshipStatus: "available",
    linkedin: "https://linkedin.com/in/davidchen",
    bio: "Building the next generation of African tech startups.",
    achievements: ["Raised $2M seed funding", "50+ employees"]
  },
  {
    id: 5,
    name: "Grace Okafor",
    graduationYear: 2018,
    course: "Law",
    department: "Law",
    currentRole: "Senior Associate",
    company: "Banwo & Ighodalo",
    location: "Lagos, Nigeria",
    photo: "/images/alumni/grace.jpg",
    industry: "Legal",
    verified: true,
    mentorshipStatus: "not_available",
    linkedin: "https://linkedin.com/in/graceokafor",
    bio: "Corporate law specialist with focus on energy and infrastructure.",
    achievements: ["Won landmark case", "LLM from Harvard"]
  }
];

const successStories = [
  {
    id: 1,
    title: "From NAUB to Google Software Engineer",
    author: "Sarah Johnson",
    category: "Tech",
    excerpt: "My journey from OnlineUniversity to becoming a software engineer at Google involved consistent learning, networking, and taking calculated risks.",
    fullStory: "Starting with a basic computer science degree, I taught myself advanced programming concepts through online courses and personal projects. The key was building a strong portfolio and networking with alumni who guided me through the interview process.",
    image: "/images/stories/sarah-google.jpg",
    achievements: ["Google L4 Engineer", "Published ML research", "Mentored 20+ students"],
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Building a $10M Healthcare Startup",
    author: "Dr. Amara Nwosu",
    category: "Entrepreneurship",
    excerpt: "Combining medical expertise with business acumen to create innovative healthcare solutions for underserved communities.",
    fullStory: "After completing my medical degree, I identified gaps in healthcare delivery in rural Nigeria. With a small team, we built a telemedicine platform that now serves over 50,000 patients across 15 states.",
    image: "/images/stories/amara-startup.jpg",
    achievements: ["$10M Series A funding", "50,000+ patients served", "Featured in Forbes Africa"],
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Investment Banking Career Journey",
    author: "Michael Adebayo",
    category: "Finance",
    excerpt: "How I transitioned from business administration to leading deals at Goldman Sachs.",
    fullStory: "My journey involved pursuing CFA certification while working, building relationships with mentors, and continuously expanding my network. The key was persistence and seeking opportunities to prove myself.",
    image: "/images/stories/michael-banking.jpg",
    achievements: ["CFA Charterholder", "Led $2B in deals", "Published finance articles"],
    readTime: "6 min read"
  }
];

const stats = {
  totalAlumni: 2500,
  countries: 45,
  companies: 320,
  successStories: 89
};

export default function AlumniPage() {
  const [activeTab, setActiveTab] = useState("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    graduationYear: "",
    department: "",
    industry: "",
    location: "",
    company: ""
  });

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.currentRole.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = (
      (!selectedFilters.graduationYear || alumni.graduationYear.toString() === selectedFilters.graduationYear) &&
      (!selectedFilters.department || alumni.department === selectedFilters.department) &&
      (!selectedFilters.industry || alumni.industry === selectedFilters.industry) &&
      (!selectedFilters.location || alumni.location.toLowerCase().includes(selectedFilters.location.toLowerCase())) &&
      (!selectedFilters.company || alumni.company.toLowerCase().includes(selectedFilters.company.toLowerCase()))
    );

    return matchesSearch && matchesFilters;
  });

  const getMentorshipStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "limited": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "not_available": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getMentorshipStatusText = (status: string) => {
    switch (status) {
      case "available": return "Available to mentor";
      case "limited": return "Limited availability";
      case "not_available": return "Not available";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#097969] via-[#065f52] to-[#034a3f] py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] animate-float"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-emerald-100 mb-6 animate-fade-in-up">
              <Users className="h-4 w-4" />
              <span>Alumni Connect</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 animate-fade-in-up animation-delay-200">
              Connect with Graduates Building Careers Worldwide
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              Discover success stories, find mentors, and build your professional network with OnlineUniversity alumni.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Users className="h-8 w-8 text-[#097969] mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalAlumni.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Alumni Registered</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Globe className="h-8 w-8 text-[#097969] mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.countries}</div>
            <div className="text-sm text-gray-600">Countries Represented</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Briefcase className="h-8 w-8 text-[#097969] mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.companies}</div>
            <div className="text-sm text-gray-600">Companies Joined</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Trophy className="h-8 w-8 text-[#097969] mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.successStories}</div>
            <div className="text-sm text-gray-600">Success Stories</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alumni by name, company, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#097969] focus:ring-4 focus:ring-[#097969]/10 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#097969] text-white rounded-lg hover:bg-[#065f52] transition-colors">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {[
            { id: "directory", label: "Alumni Directory", icon: Users },
            { id: "stories", label: "Success Stories", icon: Trophy },
            { id: "mentorship", label: "Mentorship Hub", icon: Handshake }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#097969] text-white border-b-2 border-[#097969]"
                  : "text-gray-600 hover:text-[#097969] hover:bg-gray-50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Alumni</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <select
                  value={selectedFilters.graduationYear}
                  onChange={(e) => setSelectedFilters({...selectedFilters, graduationYear: e.target.value})}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#097969] focus:ring-2 focus:ring-[#097969]/20 outline-none"
                >
                  <option value="">All Years</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2015">2015</option>
                </select>
                <select
                  value={selectedFilters.department}
                  onChange={(e) => setSelectedFilters({...selectedFilters, department: e.target.value})}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#097969] focus:ring-2 focus:ring-[#097969]/20 outline-none"
                >
                  <option value="">All Departments</option>
                  <option value="Computing">Computing</option>
                  <option value="Business">Business</option>
                  <option value="Medical Sciences">Medical Sciences</option>
                  <option value="Law">Law</option>
                </select>
                <select
                  value={selectedFilters.industry}
                  onChange={(e) => setSelectedFilters({...selectedFilters, industry: e.target.value})}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#097969] focus:ring-2 focus:ring-[#097969]/20 outline-none"
                >
                  <option value="">All Industries</option>
                  <option value="Tech">Tech</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Legal">Legal</option>
                </select>
                <input
                  type="text"
                  placeholder="Location"
                  value={selectedFilters.location}
                  onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#097969] focus:ring-2 focus:ring-[#097969]/20 outline-none"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={selectedFilters.company}
                  onChange={(e) => setSelectedFilters({...selectedFilters, company: e.target.value})}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#097969] focus:ring-2 focus:ring-[#097969]/20 outline-none"
                />
              </div>
            </div>

            {/* Alumni Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((alumni) => (
                <div key={alumni.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{alumni.name}</h3>
                        {alumni.verified && <CheckCircle className="h-4 w-4 text-[#097969]" />}
                      </div>
                      <p className="text-sm text-gray-600">{alumni.currentRole}</p>
                      <p className="text-sm text-[#097969] font-medium">{alumni.company}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>{alumni.course} • {alumni.graduationYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{alumni.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getMentorshipStatusIcon(alumni.mentorshipStatus)}
                      <span>{getMentorshipStatusText(alumni.mentorshipStatus)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#097969] text-white px-4 py-2 rounded-lg hover:bg-[#065f52] transition-colors text-sm font-medium">
                      Connect
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Book an Appointment Section */}
            <div className="bg-gradient-to-br from-[#097969] to-[#065f52] rounded-xl p-8 text-white">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Calendar className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">Book an Appointment</h2>
                </div>
                <h3 className="text-xl font-semibold mb-4">Schedule a Career Counselling Session</h3>
                <p className="text-emerald-100 mb-8 leading-relaxed">
                  Book a one-on-one career counselling session with our advisors. We are here to help you map out your career path,
                  review your CV, prepare for interviews, or explore graduate opportunities.
                </p>

                <form className="space-y-6 text-left">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name <span className="text-red-300">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/30 outline-none backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address <span className="text-red-300">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Your email address"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/30 outline-none backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferred Date <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/30 outline-none backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Purpose <span className="text-red-300">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/30 outline-none backdrop-blur-sm"
                    >
                      <option value="" className="text-gray-900">Select a purpose</option>
                      <option value="career-path" className="text-gray-900">Career Path Planning</option>
                      <option value="cv-review" className="text-gray-900">CV Review</option>
                      <option value="interview-prep" className="text-gray-900">Interview Preparation</option>
                      <option value="job-search" className="text-gray-900">Job Search Strategy</option>
                      <option value="graduate-opportunities" className="text-gray-900">Graduate Opportunities</option>
                      <option value="mentorship" className="text-gray-900">Mentorship Guidance</option>
                      <option value="other" className="text-gray-900">Other</option>
                    </select>
                  </div>
                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="bg-white text-[#097969] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Book Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stories" && (
          <div className="space-y-8">
            {/* Featured Story Carousel */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-[#097969]" />
                <h2 className="text-2xl font-bold text-gray-900">Featured Success Story</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="text-sm text-[#097969] font-medium uppercase tracking-wide">Tech Success</div>
                  <h3 className="text-3xl font-bold text-gray-900">From NAUB to Google Software Engineer</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Sarah's journey from OnlineUniversity to becoming a software engineer at Google involved
                    consistent learning, networking, and taking calculated risks.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="bg-[#097969] text-white px-6 py-3 rounded-lg hover:bg-[#065f52] transition-colors font-medium">
                      Read Full Story
                    </button>
                    <span className="text-sm text-gray-500">5 min read</span>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <Trophy className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Story Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.slice(1).map((story) => (
                <div key={story.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-[#097969] font-medium uppercase tracking-wide mb-2">{story.category}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{story.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <button className="text-[#097969] font-medium hover:text-[#065f52] transition-colors">
                        Read Full Story →
                      </button>
                      <span className="text-sm text-gray-500">{story.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "mentorship" && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Handshake className="h-6 w-6 text-[#097969]" />
                <h2 className="text-2xl font-bold text-gray-900">Mentorship Hub</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Connect with experienced alumni who are ready to guide you in your career journey.
                Find mentors in your field of interest and get personalized advice.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#097969] to-[#065f52] rounded-xl p-6 text-white">
                  <MessageCircle className="h-8 w-8 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Request Mentorship</h3>
                  <p className="mb-4 opacity-90">
                    Send a personalized request to alumni mentors. Specify your goals and what you'd like to learn.
                  </p>
                  <button className="bg-white text-[#097969] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Find a Mentor
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <Calendar className="h-8 w-8 text-[#097969] mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mentorship Availability</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Available to mentor</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm">Limited availability</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Not available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Mentors */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Available Mentors</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {alumniData.filter(a => a.mentorshipStatus === "available").map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                        <p className="text-sm text-gray-600">{mentor.currentRole} at {mentor.company}</p>
                        <p className="text-sm text-[#097969]">{mentor.course} • {mentor.graduationYear}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{mentor.bio}</p>
                    <button className="w-full bg-[#097969] text-white px-4 py-2 rounded-lg hover:bg-[#065f52] transition-colors text-sm font-medium">
                      Request Mentorship
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}