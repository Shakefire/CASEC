export type OpportunityType = "job" | "scholarship" | "internship";
export type StatusType = "pending" | "approved" | "shortlisted" | "rejected" | "active" | "closed";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  deadline: string;
  postedBy: string;
  postedByName: string;
  status: "active" | "closed";
  createdAt: string;
  location?: string;
  requirements?: string[];
  eligibility?: string[];
  verified?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  createdAt: string;
  category?: string;
  eventType?: "full-day" | "half-day" | "evening" | "webinar";
  capacity?: number;
  registered?: number;
  organizer?: string;
  highlights?: string[];
  // Past event fields
  isPast?: boolean;
  actualAttendance?: number;
  recordingUrl?: string;
  summary?: string;
  feedbackRating?: number;
  speakers?: string[];
  topics?: string[];
  outcomes?: string[];
  photoGallery?: string[];
}

export interface Resource {
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

export interface Video {
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

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  style: "modern" | "minimal" | "academic" | "corporate";
  thumbnail?: string;
  previewUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "employer" | "admin";
  status: "active" | "inactive";
  joinedAt: string;
  department?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  applicantName: string;
  applicantEmail: string;
  cvFileName: string;
  status: "pending" | "shortlisted" | "rejected";
  appliedAt: string;
}

export interface RunLasSubmission {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  supervisor: string;
  organization: string;
  startDate: string;
  endDate: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  remarks?: string;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  purpose: string;
  status: "pending" | "approved" | "cancelled";
}

export const opportunities: Opportunity[] = [
  {
    id: "opp-001",
    title: "Graduate Software Engineer",
    description:
      "Join our engineering team as a graduate software engineer. You will work on scalable systems and contribute to product development.",
    type: "job",
    deadline: "2025-08-15",
    postedBy: "emp-001",
    postedByName: "Andela",
    location: "Lagos",
    status: "active",
    createdAt: "2025-06-01",
    verified: true,
    requirements: ["Bachelor's in Computer Science", "2+ years experience", "Proficiency in Python/Java"],
    eligibility: ["All graduates", "Recent graduates preferred"],
  },
  {
    id: "opp-002",
    title: "MTN Nigeria Scholarship 2025",
    description:
      "Full scholarship covering tuition and stipend for final-year students in STEM disciplines.",
    type: "scholarship",
    deadline: "2025-07-30",
    postedBy: "emp-002",
    postedByName: "MTN Nigeria",
    location: "Nigeria",
    status: "active",
    createdAt: "2025-05-20",
    verified: true,
    requirements: ["Final year students", "STEM disciplines only", "Minimum 3.5 CGPA"],
    eligibility: ["Final year students", "STEM fields", "Nigerian citizens"],
  },
  {
    id: "opp-003",
    title: "Summer Internship – Finance Analyst",
    description:
      "3-month summer internship at a leading Lagos investment bank. Open to 300-level and above.",
    type: "internship",
    deadline: "2025-07-01",
    postedBy: "emp-003",
    postedByName: "Zenith Bank",
    location: "Lagos",
    status: "active",
    createdAt: "2025-05-15",
    verified: true,
    requirements: ["Strong analytical skills", "Excel proficiency", "Finance background"],
    eligibility: ["300-level and above", "All disciplines", "Nigerian students"],
  },
  {
    id: "opp-004",
    title: "Marketing Associate",
    description:
      "Full-time marketing associate role for a consumer goods company in Ibadan.",
    type: "job",
    deadline: "2025-06-30",
    postedBy: "emp-001",
    postedByName: "Nestlé Nigeria",
    location: "Ibadan",
    status: "closed",
    createdAt: "2025-04-10",
    verified: true,
    requirements: ["Marketing background", "Digital marketing skills", "Strong communication"],
    eligibility: ["All graduates", "Must be in Nigeria"],
  },
  {
    id: "opp-005",
    title: "Access Bank Graduate Trainee Programme",
    description:
      "Competitive graduate trainee programme for fresh graduates across all disciplines.",
    type: "job",
    deadline: "2025-09-01",
    postedBy: "emp-004",
    postedByName: "Access Bank",
    location: "Lagos, Abuja, Remote",
    status: "active",
    createdAt: "2025-06-10",
    verified: true,
    requirements: ["Any undergraduate degree", "Excellent academic record", "Leadership potential"],
    eligibility: ["Fresh graduates only", "Must be under 28 years", "All disciplines"],
  },
  {
    id: "opp-006",
    title: "Shell Nigeria STEM Scholarship",
    description:
      "Scholarship for exceptional students in Engineering and Sciences.",
    type: "scholarship",
    deadline: "2025-08-01",
    postedBy: "emp-005",
    postedByName: "Shell Nigeria",
    location: "Nigeria",
    status: "active",
    createdAt: "2025-06-05",
    verified: true,
    requirements: ["STEM disciplines only", "Minimum 3.7 CGPA", "Leadership experience"],
    eligibility: ["All year students", "Physics, Chemistry, Engineering", "Nigerian students"],
  },
];

export const events: Event[] = [
  // UPCOMING EVENTS
  {
    id: "evt-001",
    title: "Career Fair 2025",
    date: "2025-07-20",
    description:
      "Annual career fair bringing together top employers and graduating students across departments. Network with leading companies, explore career paths, and make meaningful professional connections.",
    location: "RUN Main Hall, Ede",
    createdAt: "2025-05-01",
    category: "Networking",
    eventType: "full-day",
    capacity: 500,
    registered: 287,
    organizer: "Career Services Centre",
    highlights: ["50+ top employers", "Live recruitment", "Free refreshments", "Career counseling booths"],
    isPast: false,
  },
  {
    id: "evt-002",
    title: "CV Writing & Interview Skills Workshop",
    date: "2025-07-05",
    description:
      "Hands-on workshop to help students craft compelling CVs and ace job interviews. Learn industry best practices, get personalized feedback, and practice answering tough interview questions.",
    location: "Senate Building, Room 101",
    createdAt: "2025-05-15",
    category: "Workshop",
    eventType: "half-day",
    capacity: 80,
    registered: 72,
    organizer: "Career Services Centre",
    highlights: ["Expert facilitators", "One-on-one feedback", "Mock interviews", "Free CV review"],
    isPast: false,
  },
  {
    id: "evt-003",
    title: "Entrepreneurship Bootcamp",
    date: "2025-08-10",
    description:
      "Three-day bootcamp on business ideation, pitching, and startup fundamentals. Develop your business idea from concept to pitch-ready stage with mentorship from successful entrepreneurs.",
    location: "Business School Annex",
    createdAt: "2025-06-01",
    category: "Training",
    eventType: "full-day",
    capacity: 100,
    registered: 64,
    organizer: "Business School & CASEC",
    highlights: ["Mentorship sessions", "Pitch competition", "Networking", "Startup resources"],
    isPast: false,
  },
  {
    id: "evt-004",
    title: "Networking Night – Alumni Connect",
    date: "2025-08-22",
    description:
      "Evening networking event connecting current students with RUN alumni in various industries. Hear career stories, get insider tips, and build relationships with professionals in your field.",
    location: "RUN Guest House Hall",
    createdAt: "2025-06-08",
    category: "Networking",
    eventType: "evening",
    capacity: 200,
    registered: 143,
    organizer: "Career Services Centre & Alumni Relations",
    highlights: ["Alumni as mentors", "B2B connections", "Career advice", "Social networking"],
    isPast: false,
  },
  
  // PAST EVENTS
  {
    id: "evt-past-001",
    title: "Career Fair 2024",
    date: "2024-07-18",
    description:
      "Annual career fair bringing together top employers and graduating students across departments. Hosted record-breaking attendance with live on-site recruitment.",
    location: "RUN Main Hall, Ede",
    createdAt: "2024-05-01",
    category: "Networking",
    eventType: "full-day",
    capacity: 450,
    registered: 428,
    actualAttendance: 412,
    organizer: "Career Services Centre",
    highlights: ["45+ employers", "350+ job offers", "15 instant hires"],
    isPast: true,
    feedbackRating: 4.7,
    speakers: ["Prof. Ade Okunowo (CASEC)", "Mr. Tunde Okeremi (Andela)", "Ms. Chioma Ojiako (MTN Nigeria)"],
    topics: ["Career pathways", "Industry trends", "Recruitment best practices", "Entrepreneurship"],
    outcomes: ["412 attendees", "350+ job offers extended", "15 instant employment offers", "Partnerships with 45+ companies"],
    photoGallery: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80",
    ],
    recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    summary:
      "The 2024 Career Fair was our most successful yet, attracting over 400 students and 45 leading companies. The event featured interactive booth sessions, speed networking, and live recruitment drives.",
  },
  {
    id: "evt-past-002",
    title: "LinkedIn Masterclass Workshop",
    date: "2024-06-15",
    description:
      "Interactive workshop on optimizing LinkedIn profiles and leveraging the platform for career growth.",
    location: "ICT Building, Room 205",
    createdAt: "2024-04-20",
    category: "Workshop",
    eventType: "half-day",
    capacity: 60,
    registered: 58,
    actualAttendance: 54,
    organizer: "Career Services Centre",
    highlights: ["LinkedIn experts", "Profile optimization", "Networking strategies"],
    isPast: true,
    feedbackRating: 4.5,
    speakers: ["Ms. Omotoke Abadi (LinkedIn Nigeria)", "Mr. Oluwaseun Adeyemi (Tech Recruiter)"],
    topics: ["Profile optimization", "Personal branding", "Network building", "Job search strategies"],
    outcomes: ["54 participants graduated", "100+ profile improvements", "Networking connections made"],
    recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    summary:
      "An insightful session teaching students how to create compelling LinkedIn profiles, leverage recruiter searches, and build meaningful professional networks.",
  },
  {
    id: "evt-past-003",
    title: "Mock Interview Series 2024",
    date: "2024-05-22",
    description:
      "Comprehensive mock interview program with feedback from experienced HR professionals.",
    location: "Conference Room A & B",
    createdAt: "2024-03-15",
    category: "Training",
    eventType: "half-day",
    capacity: 120,
    registered: 112,
    actualAttendance: 108,
    organizer: "CASEC & HR Partners",
    highlights: ["1:1 interviews", "Expert feedback", "Industry recruiters"],
    isPast: true,
    feedbackRating: 4.8,
    speakers: ["10+ Senior HR Professionals"],
    topics: ["Interview techniques", "Behavioral questions", "Technical interviews", "Q&A strategies"],
    outcomes: ["108 mock interviews conducted", "98% felt more confident", "42 advanced to real interviews"],
    recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    summary:
      "Intensive mock interview program where students practiced with real HR professionals from top companies and received detailed feedback on their performance.",
  },
  {
    id: "evt-past-004",
    title: "Tech Career Roadmap Seminar",
    date: "2024-04-30",
    description:
      "Career development seminar for technology professionals and students interested in tech careers.",
    location: "Engineering Building, Auditorium",
    createdAt: "2024-02-20",
    category: "Networking",
    eventType: "full-day",
    capacity: 200,
    registered: 187,
    actualAttendance: 175,
    organizer: "Tech Club & CASEC",
    highlights: ["Tech industry leaders", "Career paths", "Skill development"],
    isPast: true,
    feedbackRating: 4.6,
    speakers: ["Mr. Chinedu Nwafor (Google)", "Ms. Ada Okafor (Microsoft)", "Mr. Emeka Uche (Paystack)"],
    topics: ["Tech career pathways", "In-demand skills", "Remote work trends", "Startup ecosystem"],
    outcomes: ["175 attendees", "50+ internship referrals", "15 job prospects"],
    recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    summary:
      "A comprehensive seminar featuring tech industry leaders who shared insights on emerging career paths, skills development, and opportunities in the rapidly growing tech sector.",
  },
];

export const resources: Resource[] = [
  {
    id: "res-001",
    title: "CV Writing Guide 2025",
    description: "Comprehensive guide on crafting an effective CV that stands out to employers",
    fileName: "cv-writing-guide-2025.pdf",
    fileSize: "1.2 MB",
    uploadedAt: "2025-05-10",
    uploadedBy: "admin",
    category: "CV",
    type: "PDF",
    downloads: 2341,
    featured: true,
  },
  {
    id: "res-002",
    title: "Interview Preparation Handbook",
    description: "Master interview techniques with real examples and practice questions",
    fileName: "interview-prep-handbook.pdf",
    fileSize: "2.4 MB",
    uploadedAt: "2025-05-12",
    uploadedBy: "admin",
    category: "Interview",
    type: "PDF",
    downloads: 1856,
    featured: true,
  },
  {
    id: "res-003",
    title: "SIWES Student Guide",
    description: "Complete guide for industrial training students - requirements, procedures, and tips",
    fileName: "siwes-student-guide.pdf",
    fileSize: "890 KB",
    uploadedAt: "2025-04-25",
    uploadedBy: "admin",
    category: "Internship",
    type: "PDF",
    downloads: 1543,
  },
  {
    id: "res-004",
    title: "Graduate Job Search Strategies",
    description: "Strategic approaches to finding and landing your first graduate role",
    fileName: "grad-job-search-strategies.pdf",
    fileSize: "1.7 MB",
    uploadedAt: "2025-06-01",
    uploadedBy: "admin",
    category: "Career",
    type: "PDF",
    downloads: 1127,
    featured: true,
  },
  {
    id: "res-005",
    title: "Professional Email & Communication Guide",
    description: "How to write professional emails and communicate effectively in the workplace",
    fileName: "professional-communication-guide.pdf",
    fileSize: "560 KB",
    uploadedAt: "2025-06-05",
    uploadedBy: "admin",
    category: "Soft Skills",
    type: "PDF",
    downloads: 892,
  },
  {
    id: "res-006",
    title: "Cover Letter Templates & Examples",
    description: "Ready-to-use cover letter templates for different job types and industries",
    fileName: "cover-letter-templates.pdf",
    fileSize: "1.1 MB",
    uploadedAt: "2025-05-20",
    uploadedBy: "admin",
    category: "CV",
    type: "PDF",
    downloads: 1634,
  },
  {
    id: "res-007",
    title: "Scholarship Application Guide",
    description: "Step-by-step guide to applying for scholarships and maximizing your chances",
    fileName: "scholarship-guide.pdf",
    fileSize: "1.5 MB",
    uploadedAt: "2025-04-30",
    uploadedBy: "admin",
    category: "Scholarship",
    type: "PDF",
    downloads: 2103,
    featured: true,
  },
  {
    id: "res-008",
    title: "Time Management for Students",
    description: "Practical time management techniques to balance studies and career prep",
    fileName: "time-management.pdf",
    fileSize: "845 KB",
    uploadedAt: "2025-05-15",
    uploadedBy: "admin",
    category: "Soft Skills",
    type: "PDF",
    downloads: 743,
  },
];

export const videos: Video[] = [
  {
    id: "vid-001",
    title: "How to Write a Compelling CV in 2025",
    description: "Expert tips on creating a CV that gets you interviews. Learn what employers really want to see.",
    category: "CV",
    duration: "12:34",
    speaker: "Ms. Omotoke Abadi",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedAt: "2025-06-01",
    views: 3421,
    featured: true,
  },
  {
    id: "vid-002",
    title: "Mastering the Job Interview - Complete Guide",
    description: "Learn interview strategies, how to answer tough questions, and impress hiring managers.",
    category: "Interview",
    duration: "18:45",
    speaker: "Mr. Chinedu Okafor",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedAt: "2025-05-28",
    views: 2834,
    featured: true,
  },
  {
    id: "vid-003",
    title: "LinkedIn Profile Optimization Tutorial",
    description: "Turn your LinkedIn into a job search powerhouse. Get discovered by recruiters.",
    category: "LinkedIn",
    duration: "15:20",
    speaker: "Ms. Ada Okafor",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedAt: "2025-05-15",
    views: 4156,
    featured: true,
  },
  {
    id: "vid-004",
    title: "Scholarship Application Tips & Tricks",
    description: "Insider tips on how to stand out in scholarship competitive applications.",
    category: "Scholarship",
    duration: "9:50",
    speaker: "Prof. Ade Okunowo",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedAt: "2025-06-05",
    views: 1523,
  },
  {
    id: "vid-005",
    title: "Salary Negotiation 101",
    description: "How to negotiate your first salary and get what you deserve.",
    category: "Career Skills",
    duration: "11:30",
    speaker: "Mr. Emeka Uche",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedAt: "2025-04-20",
    views: 2341,
  },
  {
    id: "vid-006",
    title: "Tech Interview Prep - Coding Challenges",
    description: "Prepare for technical interviews in software development roles.",
    category: "Interview",
    duration: "22:15",
    speaker: "Mr. David Chen",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedAt: "2025-05-10",
    views: 1876,
  },
];

export const cvTemplates: CVTemplate[] = [
  {
    id: "tpl-001",
    name: "Modern CV",
    description: "Clean, contemporary design perfect for tech and creative industries",
    style: "modern",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "tpl-002",
    name: "Minimal CV",
    description: "Elegant and simple design that focuses on content",
    style: "minimal",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "tpl-003",
    name: "Academic CV",
    description: "Traditional design ideal for academic and research positions",
    style: "academic",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=300&fit=crop&q=80",
  },
  {
    id: "tpl-004",
    name: "Corporate CV",
    description: "Professional design for corporate and financial roles",
    style: "corporate",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=300&fit=crop&q=80",
  },
];

export const users: User[] = [
  {
    id: "usr-001",
    name: "Adaeze Okonkwo",
    email: "adaeze.okonkwo@run.edu.ng",
    role: "student",
    status: "active",
    joinedAt: "2024-09-01",
    department: "Computer Science",
  },
  {
    id: "usr-000",
    name: "Admin User",
    email: "admin@mail.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-08-01",
  },
  {
    id: "usr-002",
    name: "Emeka Nwosu",
    email: "emeka.nwosu@run.edu.ng",
    role: "student",
    status: "active",
    joinedAt: "2024-09-01",
    department: "Accounting",
  },
  {
    id: "usr-003",
    name: "Fatima Yusuf",
    email: "fatima.yusuf@run.edu.ng",
    role: "student",
    status: "inactive",
    joinedAt: "2024-09-01",
    department: "Law",
  },
  {
    id: "emp-001",
    name: "Tunde Afolabi",
    email: "tunde@techbridge.ng",
    role: "employer",
    status: "active",
    joinedAt: "2025-01-15",
  },
  {
    id: "emp-002",
    name: "Ngozi Eze",
    email: "ngozi@mtnfoundation.ng",
    role: "employer",
    status: "active",
    joinedAt: "2025-02-10",
  },
  {
    id: "emp-003",
    name: "Samuel Okafor",
    email: "s.okafor@firstbanknigeria.com",
    role: "employer",
    status: "active",
    joinedAt: "2025-03-01",
  },
  {
    id: "usr-004",
    name: "Chioma Obiora",
    email: "chioma.obiora@run.edu.ng",
    role: "student",
    status: "active",
    joinedAt: "2024-09-01",
    department: "Biochemistry",
  },
  {
    id: "emp-004",
    name: "Rotimi Bankole",
    email: "r.bankole@accessbank.com",
    role: "employer",
    status: "inactive",
    joinedAt: "2025-04-05",
  },
];

export const applications: Application[] = [
  {
    id: "app-001",
    opportunityId: "opp-001",
    opportunityTitle: "Graduate Software Engineer",
    applicantName: "Adaeze Okonkwo",
    applicantEmail: "adaeze.okonkwo@run.edu.ng",
    cvFileName: "adaeze-okonkwo-cv.pdf",
    status: "shortlisted",
    appliedAt: "2025-06-10",
  },
  {
    id: "app-002",
    opportunityId: "opp-001",
    opportunityTitle: "Graduate Software Engineer",
    applicantName: "Emeka Nwosu",
    applicantEmail: "emeka.nwosu@run.edu.ng",
    cvFileName: "emeka-nwosu-cv.pdf",
    status: "pending",
    appliedAt: "2025-06-12",
  },
  {
    id: "app-003",
    opportunityId: "opp-003",
    opportunityTitle: "Summer Internship – Finance Analyst",
    applicantName: "Chioma Obiora",
    applicantEmail: "chioma.obiora@run.edu.ng",
    cvFileName: "chioma-obiora-cv.pdf",
    status: "pending",
    appliedAt: "2025-06-14",
  },
];

export const runLasSubmissions: RunLasSubmission[] = [
  {
    id: "run-001",
    studentName: "Adaeze Okonkwo",
    studentId: "CMS/2023/001",
    department: "Computer Science",
    supervisor: "Dr. Emeka Nwosu",
    organization: "TechBridge Solutions",
    startDate: "2025-04-01",
    endDate: "2025-09-30",
    submittedAt: "2025-06-16",
    status: "pending",
  },
  {
    id: "run-002",
    studentName: "Chioma Obiora",
    studentId: "BIO/2023/024",
    department: "Biochemistry",
    supervisor: "Prof. Amina Yusuf",
    organization: "BioHealth Labs",
    startDate: "2025-05-05",
    endDate: "2025-10-05",
    submittedAt: "2025-06-18",
    status: "approved",
  },
];

export const bookingRequests: BookingRequest[] = [
  {
    id: "book-001",
    name: "Mr. James Adenuga",
    email: "james.adenuga@example.com",
    phone: "+2348031234567",
    date: "2025-06-25",
    purpose: "Employer presentation at Career Fair",
    status: "pending",
  },
  {
    id: "book-002",
    name: "Mrs. Sade Adebayo",
    email: "sade.adebayo@example.com",
    phone: "+2348037654321",
    date: "2025-07-10",
    purpose: "CV workshop facilitation",
    status: "approved",
  },
];
