import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Briefcase, Award, Zap, Globe, Lightbulb, Network, ClipboardCheck } from "lucide-react";

const offerings = [
  {
    icon: Users,
    title: "Skilled Instructors",
    desc: "Learn from experienced professionals dedicated to your career development.",
  },
  {
    icon: Globe,
    title: "International Certificate",
    desc: "Earn recognized credentials that enhance your professional profile globally.",
  },
  {
    icon: Award,
    title: "Career Counseling",
    desc: "Personalized guidance to help you navigate and achieve your career goals.",
  },
  {
    icon: Briefcase,
    title: "Job & Internship Listings",
    desc: "Access curated opportunities from top employers and organizations.",
  },
  {
    icon: Zap,
    title: "Webinar Classes",
    desc: "Participate in interactive online workshops covering industry-relevant topics.",
  },
  {
    icon: Lightbulb,
    title: "Online Guidance",
    desc: "Get expert advice and support through our digital counseling platforms.",
  },
  {
    icon: Network,
    title: "Industry Networking",
    desc: "Connect with professionals and build valuable relationships in your field.",
  },
  {
    icon: ClipboardCheck,
    title: "CV & Interview Support",
    desc: "Refine your resume and prepare confidently for interviews with expert coaching.",
  },
];

const teamMembers = [
  {
    initials: "P",
    name: "Prof. A. O. Adeyemi",
    title: "Director, CASEC",
  },
  {
    initials: "M",
    name: "Mrs. R. T. Oyebanji",
    title: "Career Counselor",
  },
  {
    initials: "M",
    name: "Mr. K. S. Babalinde",
    title: "Industry Liaison Officer",
  },
  {
    initials: "M",
    name: "Miss T. A. Fabiola",
    title: "Programme Coordinator",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#097969] py-10 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">About CASEC</h1>
          <p className="mt-2 text-sm text-emerald-100">
            <Link href="/" className="hover:text-white">Home</Link> &rsaquo; About Us
          </p>
        </div>
      </div>

      <main>
        {/* Welcome Section */}
        <section className="py-16 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Welcome to Career Services Centre University, Nigeria
            </h2>
            <p className="text-sm leading-7 text-slate-600 mb-6">
              The Career Services Centre (CASEC) at University, Nigeria is dedicated to supporting students and graduates in their career development journey. We provide a range of services designed to equip students with the tools, knowledge, and connections they need to transition successfully from academia to the professional world.
            </p>
            <p className="text-sm leading-7 text-slate-600">
              Our team of career professionals, counsellors, and industry partners work collaboratively to deliver personalised guidance, workshops, networking events, and access to internship and employment opportunities.
            </p>
          </div>
        </section>

        {/* Vision and Mission Section */}
        <section className="py-16 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Vision */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-[#097969] rounded" />
                  <h3 className="text-xl font-bold text-slate-900">Vision</h3>
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  To empower students to discover and achieve their professional aspirations by providing comprehensive career development support and facilitating successful transitions into the workforce.
                </p>
              </div>

              {/* Mission */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-[#097969] rounded" />
                  <h3 className="text-xl font-bold text-slate-900">Mission</h3>
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  To offer personalized career guidance, connect students with employers, and enhance students' employability through skill development, networking opportunities and resources that foster professional growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              What We Offer
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {offerings.map((offer, idx) => {
                const Icon = offer.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e6f4f1] text-[#097969]">
                        <Icon size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-600">
                        {offer.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Our Team
            </h2>
            <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#097969] to-[#065f52] flex items-center justify-center text-white font-bold text-3xl">
                    {member.initials}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {member.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#097969] border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Explore opportunities, attend events, and connect with mentors to help you achieve your career goals.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/jobs"
                className="inline-flex items-center rounded bg-white px-6 py-3 text-sm font-semibold text-[#097969] hover:bg-emerald-50 transition-colors"
              >
                Browse Opportunities
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center rounded border border-white bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Attend Events
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
