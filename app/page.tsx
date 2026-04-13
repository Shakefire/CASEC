import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { opportunities, events } from "@/lib/data";
import JobCard from "@/components/ui/JobCard";
import EventCard from "@/components/ui/EventCard";
import { Users, Monitor, CheckCircle, BookOpen, Calendar, MapPin } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Skilled Instructors",
    desc: "Learn from experienced professionals dedicated to your career development.",
  },
  {
    icon: Monitor,
    title: "Webinar Sessions",
    desc: "Participate in interactive online workshops covering various career-related topics.",
  },
  {
    icon: CheckCircle,
    title: "Projects",
    desc: "Engage in practical assignments to build real-world skills.",
  },
  {
    icon: BookOpen,
    title: "Library",
    desc: "Access a curated collection of resources to support your career journey.",
  },
];

const testimonials = [
  {
    text: "CASEC helped me land my first internship. The career counselling sessions were very practical and tailored to my goals.",
    author: "Adebayo Olanrewaju",
    dept: "Computer Science, 2024",
    initials: "AO",
  },
  {
    text: "The CV workshop and mock interviews gave me the confidence I needed. I secured a graduate trainee role weeks after graduation.",
    author: "Chidinma Okoye",
    dept: "Business Administration, 2023",
    initials: "CO",
  },
  {
    text: "The career opportunities board on the CASEC website exposed me to scholarships I would never have found on my own.",
    author: "Emmanuel Adesola",
    dept: "Engineering, 2025",
    initials: "EA",
  },
];

const eventImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80", // Career fair/networking event
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80", // Workshop/classroom setting
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&q=80", // Business/entrepreneurship
];

const heroImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop&q=80",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Carousel Animation */}
      <section className="relative h-96 md:h-[480px] overflow-hidden">
        {/* Carousel Background */}
        <style>{`
          @keyframes heroSlide1 {
            0% { opacity: 1; }
            32% { opacity: 1; }
            34% { opacity: 0; }
            66% { opacity: 0; }
            100% { opacity: 0; }
          }
          
          @keyframes heroSlide2 {
            0% { opacity: 0; }
            32% { opacity: 0; }
            34% { opacity: 1; }
            66% { opacity: 1; }
            68% { opacity: 0; }
            100% { opacity: 0; }
          }
          
          @keyframes heroSlide3 {
            0% { opacity: 0; }
            66% { opacity: 0; }
            68% { opacity: 1; }
            100% { opacity: 1; }
          }
          
          @keyframes heroZoom {
            0%, 32% { transform: scale(1); }
            34%, 66% { transform: scale(1.05); }
            68%, 100% { transform: scale(1); }
          }
          
          @keyframes textContent1 {
            0% { opacity: 0; transform: translateY(30px); }
            5%, 30% { opacity: 1; transform: translateY(0); }
            33% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 0; }
          }
          
          @keyframes textContent2 {
            0%, 32% { opacity: 0; pointer-events: none; }
            37%, 62% { opacity: 1; pointer-events: auto; transform: translateY(0); }
            65% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 0; pointer-events: none; }
          }
          
          @keyframes textContent3 {
            0%, 66% { opacity: 0; pointer-events: none; }
            71%, 97% { opacity: 1; pointer-events: auto; transform: translateY(0); }
            100% { opacity: 0; pointer-events: none; }
          }
          
          .hero-slide-1 {
            animation: heroSlide1 18s infinite;
          }
          
          .hero-slide-2 {
            animation: heroSlide2 18s infinite;
          }
          
          .hero-slide-3 {
            animation: heroSlide3 18s infinite;
          }
          
          .bg-image {
            animation: heroZoom 18s infinite;
          }
          
          .hero-content-1 {
            animation: textContent1 18s infinite;
            max-width: 40rem;
          }
          
          .hero-content-2 {
            animation: textContent2 18s infinite;
            max-width: 40rem;
          }
          
          .hero-content-3 {
            animation: textContent3 18s infinite;
            max-width: 40rem;
          }
        `}</style>

        {/* Slide 1 - Main Hero Image */}
        <div className="hero-slide-1 absolute inset-0">
          <div
            className="bg-image w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${heroImages[0]}')`,
            }}
          >
            <div className="absolute inset-0 bg-[#097969cc]" />
          </div>
        </div>

        {/* Slide 2 - Career Workshop Image */}
        <div className="hero-slide-2 absolute inset-0">
          <div
            className="bg-image w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${heroImages[1]}')`,
            }}
          >
            <div className="absolute inset-0 bg-[#097969cc]" />
          </div>
        </div>

        {/* Slide 3 - Networking Event Image */}
        <div className="hero-slide-3 absolute inset-0">
          <div
            className="bg-image w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${heroImages[2]}')`,
            }}
          >
            <div className="absolute inset-0 bg-[#097969cc]" />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center text-white">
          <div className="w-full">
            {/* Content Set 1 */}
            <div className="flex items-center h-full">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl hero-content-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100 mb-3">
                    Welcome to
                  </p>
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Career Services Centre
                    <span className="block text-3xl font-semibold mt-2">
                      University,
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-emerald-100">
                    Welcome to the Career Services Centre University,, your
                    gateway to professional success. Whether you're exploring career
                    options, searching for internships, or preparing for life after
                    graduation, we are here to support you.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/resources"
                      className="inline-flex items-center rounded bg-white px-5 py-3 text-sm font-semibold text-[#097969]"
                    >
                      Read More
                    </Link>
                    <Link
                      href="/jobs"
                      className="inline-flex items-center rounded border border-white bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/20"
                    >
                      Career Opportunities
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Set 2 */}
            <div className="flex items-center h-full absolute inset-0">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl hero-content-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100 mb-3">
                    Find Your Path
                  </p>
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Internships &
                    <span className="block text-3xl font-semibold mt-2">
                      Working Opportunities
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-emerald-100">
                    Explore career opportunities tailored to your skills and aspirations. Access scholarships, internships, and job placements from top employers.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/jobs"
                      className="inline-flex items-center rounded bg-white px-5 py-3 text-sm font-semibold text-[#097969]"
                    >
                      Browse Opportunities
                    </Link>
                    <Link
                      href="/events"
                      className="inline-flex items-center rounded border border-white bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/20"
                    >
                      Upcoming Events
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Set 3 */}
            <div className="flex items-center h-full absolute inset-0">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl hero-content-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100 mb-3">
                    Get Prepared
                  </p>
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Build Your Skills &
                    <span className="block text-3xl font-semibold mt-2">
                      Land Your Dream Job
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-emerald-100">
                    Access workshops, webinars, and CV guidance. Prepare for interviews with expert coaching and career counselling from industry professionals.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/resources"
                      className="inline-flex items-center rounded bg-white px-5 py-3 text-sm font-semibold text-[#097969]"
                    >
                      Explore Resources
                    </Link>
                    <Link
                      href="/jobs"
                      className="inline-flex items-center rounded border border-white bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/20"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-white opacity-80 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <div className="w-2 h-2 rounded-full bg-white/40" />
        </div>
      </section>

      <main>
        {/* Features Section */}
        <section className="bg-white py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#097969] mb-3">Our Features</p>
              <h2 className="text-4xl font-bold text-slate-900">What We Offer</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group rounded-xl border border-slate-300 bg-gradient-to-br from-slate-50 to-white p-8 text-center hover:border-[#097969] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[#e6f4f1] p-4 text-[#097969] group-hover:scale-110 transition-transform">
                      <Icon size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-sm leading-6 text-slate-600">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About CASEC Section */}
        <section className="bg-slate-50 py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Image Side */}
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <div
                  className="w-full h-full bg-cover bg-center bg-gradient-to-br from-[#097969] to-[#065f52]"
                  style={{
                    backgroundImage: "url('/images/hero-bg.jpg')",
                  }}
                />
                <div className="absolute inset-0 bg-[#097969]/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <div className="text-5xl font-bold mb-2">CASEC</div>
                  <p className="text-sm leading-6">Career Services Centre University,</p>
                </div>
              </div>

              {/* Content Side */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#097969] mb-4">About CASEC</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Welcome to Career Services Centre University,</h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-6 bg-[#097969] rounded" />
                      Vision
                    </h4>
                    <p className="text-sm leading-7 text-slate-600 pl-4">
                      To empower students to discover and achieve their professional aspirations by providing comprehensive career development support and facilitating successful transitions into the workforce.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-6 bg-[#097969] rounded" />
                      Mission
                    </h4>
                    <p className="text-sm leading-7 text-slate-600 pl-4">
                      To offer personalized career guidance, connect students with employers, and enhance students' employability through skill development, networking opportunities and resources that foster professional growth.
                    </p>
                  </div>
                </div>

                <Link
                  href="/resources"
                  className="inline-flex items-center rounded-lg bg-[#097969] px-6 py-3 text-sm font-semibold text-white hover:bg-[#065f52] transition-colors"
                >
                  Read More &rsaquo;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="bg-white py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#097969] mb-2">Opportunities</p>
                <h3 className="text-3xl font-bold text-slate-900">Career Opportunities</h3>
              </div>
              <Link href="/jobs" className="text-sm text-[#097969] font-semibold hover:underline">
                View All Opportunities &rsaquo;
              </Link>
            </div>
            <div className="space-y-3">
              {opportunities.slice(0, 5).map((opp) => (
                <div key={opp.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 hover:border-[#097969] hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#097969]">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{opp.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 capitalize">{opp.type}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap">Posted on {opp.createdAt}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="bg-slate-50 py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#097969] mb-2">What's On</p>
                <h3 className="text-3xl font-bold text-slate-900">Upcoming Events</h3>
              </div>
              <Link href="/events" className="text-sm text-[#097969] font-semibold hover:underline">
                View All Events &rsaquo;
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {events.slice(0, 3).map((event, idx) => (
                <div key={event.id} className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:border-[#097969] transition-all duration-300">
                  {/* Event Image */}
                  <div className="relative h-40 bg-gradient-to-br from-[#097969] to-[#065f52] overflow-hidden">
                    <img
                      src={eventImages[idx % eventImages.length]}
                      alt={event.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-[#097969]/20" />
                    <div className="absolute top-3 right-3 bg-white text-[#097969] rounded-full w-14 h-14 flex flex-col items-center justify-center font-bold text-xs">
                      <div>{event.date.split(" ")[1]}</div>
                      <div className="text-[10px]">
                        {event.date.split(" ")[0].slice(0, 3)}
                      </div>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-5">
                    <h4 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-[#097969] transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <MapPin size={14} className="text-[#097969]" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-xs leading-5 text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                    <button className="text-xs font-semibold text-[#097969] hover:text-[#065f52] transition-colors">
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-[#097969] py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 mb-3">Testimonials</p>
              <h2 className="text-4xl font-bold text-white">What Our Students Say</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="rounded-lg bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-[#097969] text-2xl mb-3">★★★★★</div>
                  <p className="text-sm leading-6 text-slate-700 mb-4">"{testimonial.text}"</p>
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#097969] to-[#065f52] flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{testimonial.author}</p>
                      <p className="text-xs text-slate-500">{testimonial.dept}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Counselling Section */}
        <section className="bg-white py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#097969] mb-3">Book an Appointment</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Schedule a Career Counselling Session</h2>
                <p className="text-sm leading-7 text-slate-600">
                  Book a one-on-one career counselling session with our advisors. We are here to help you map out your career path, review your CV, prepare for interviews, or explore graduate opportunities.
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-8 border border-slate-200">
                <form className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      required
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#097969] focus:ring-1 focus:ring-[#097969]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Your email address"
                      required
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#097969] focus:ring-1 focus:ring-[#097969]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#097969] focus:ring-1 focus:ring-[#097969]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Purpose <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#097969] focus:ring-1 focus:ring-[#097969]"
                    >
                      <option value="">Select a purpose</option>
                      <option value="career-path">Career Path Planning</option>
                      <option value="cv-review">CV Review</option>
                      <option value="interview-prep">Interview Preparation</option>
                      <option value="job-search">Job Search Strategy</option>
                      <option value="graduate-opportunities">Graduate Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#097969] px-5 py-3 text-sm font-semibold text-white hover:bg-[#065f52] transition-colors"
                  >
                    Book Appointment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


