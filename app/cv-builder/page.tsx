"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, FileText, Users, GraduationCap, Target, MessageSquare } from "lucide-react";

export default function CvBuilderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: "Student's Details", icon: FileText },
    { number: 2, title: "Project Supervisor", icon: Users },
    { number: 3, title: "Academic/Level Adviser", icon: GraduationCap },
    { number: 4, title: "Questionnaire", icon: MessageSquare },
    { number: 5, title: "Future Plans", icon: Target },
    { number: 6, title: "Detailed Response", icon: MessageSquare },
  ];

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
              <span>RUN-LAS Application</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 animate-fade-in-up animation-delay-200">
              Life After School
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              The Hassle is Real
            </p>
            <div className="mt-8 flex justify-center animate-fade-in-up animation-delay-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <span>Complete your RUN-LAS application below</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {submitted ? (
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-12 text-center shadow-lg">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted Successfully</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Thank you for completing the RUN-LAS application. We will be in touch with you soon regarding your submission.
            </p>
            <div className="mt-8">
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-full bg-[#097969] px-8 py-3 text-white font-semibold hover:bg-[#065f52] transition-colors shadow-lg"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-[#097969] border-[#097969] text-white"
                        : "border-gray-300 text-gray-400"
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                        currentStep > step.number ? "bg-[#097969]" : "bg-gray-300"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {steps.find(s => s.number === currentStep)?.title}
                </p>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-8"
            >
              {/* 1. Student's Details */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Student's Details</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Matric Number"
                    required
                    placeholder="Enter your matric number"
                    onFocus={() => setCurrentStep(1)}
                  />
                  <FormField
                    label="Strictly Student Portal Password"
                    required
                    type="password"
                    placeholder="Enter your password"
                    onFocus={() => setCurrentStep(1)}
                  />
                  <FormField
                    label="Year of Graduation"
                    required
                    type="number"
                    placeholder="Enter your year of graduation"
                    onFocus={() => setCurrentStep(1)}
                  />
                </div>
              </div>

              {/* 2. Project Supervisor */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Supervisor</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Name"
                    required
                    placeholder="Enter your supervisor name"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Department"
                    required
                    placeholder="Enter your supervisor department"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Current Position"
                    required
                    placeholder="Supervisor Position"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Email Address"
                    required
                    type="email"
                    placeholder="Supervisor email"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormSelect
                    label="Sex"
                    required
                    options={["Select supervisor's gender", "Male", "Female"]}
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Mobile Tel."
                    required
                    type="tel"
                    placeholder="Supervisor mobile number"
                    onFocus={() => setCurrentStep(2)}
                  />
                </div>
              </div>

              {/* 3. Academic/Level Adviser */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">
                    3
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Academic/Level Adviser</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Name"
                    required
                    placeholder="Enter adviser name"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Department"
                    required
                    placeholder="Adviser's department"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Current Position"
                    required
                    placeholder="Adviser's Position"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Email Address"
                    required
                    type="email"
                    placeholder="Adviser's email"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormSelect
                    label="Sex"
                    required
                    options={["Select adviser gender", "Male", "Female"]}
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Mobile Tel."
                    required
                    type="tel"
                    placeholder="Adviser's mobile number"
                    onFocus={() => setCurrentStep(3)}
                  />
                </div>
              </div>

              {/* 4. Questionnaire */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">
                    4
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Questionnaire</h2>
                </div>
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Please read the following questions carefully before answering. We recommend writing your responses in an editor first, then pasting them here.
                  </p>
                </div>
                <div className="space-y-6">
                  <TextAreaField
                    label="What do you like about RUN (in few words)"
                    required
                    placeholder="Enter what you like"
                    onFocus={() => setCurrentStep(4)}
                  />
                  <TextAreaField
                    label="What do you dislike about RUN (in few words)"
                    required
                    placeholder="Enter what you dislike"
                    onFocus={() => setCurrentStep(4)}
                  />
                  <TextAreaField
                    label="If you had 24 hours to be the VC of RUN what will you like to change or do most about RUN (in few words)"
                    placeholder="Enter your response..."
                    onFocus={() => setCurrentStep(4)}
                  />
                </div>
              </div>

              {/* 5. Future Plans */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">
                    5
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">What is your desire after graduating from RUN</h2>
                </div>
                <FormSelect
                  label="Choose an option"
                  required
                  options={[
                    "Select an option",
                    "Get a Job / Employment",
                    "Start a Business / Entrepreneurship",
                    "Postgraduate Studies / Further Education",
                    "Professional Certification",
                    "National Service (NYSC) then decide",
                    "Other",
                  ]}
                  onFocus={() => setCurrentStep(5)}
                />
              </div>

              {/* 6. Detailed Response */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">
                    6
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tell us about your choice in 5 above (what type of business, your choice of postgraduate/school, your dream job, etc)
                  </h2>
                </div>
                <TextAreaField
                  label="Feel free to express yourself"
                  required
                  placeholder="Enter details..."
                  rows={6}
                  onFocus={() => setCurrentStep(6)}
                />
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-[#097969] to-[#065f52] px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#097969]/30"
                >
                  Submit Application
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  By submitting this application, you agree to provide accurate information and understand that all data will be handled confidentially.
                </p>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function FormField({
  label,
  required,
  type = "text",
  placeholder,
  onFocus
}: {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  onFocus?: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        onFocus={onFocus}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#097969] focus:ring-4 focus:ring-[#097969]/10 hover:border-gray-400"
      />
    </label>
  );
}

function FormSelect({
  label,
  required,
  options,
  onFocus
}: {
  label: string;
  required?: boolean;
  options: string[];
  onFocus?: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        onFocus={onFocus}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#097969] focus:ring-4 focus:ring-[#097969]/10 hover:border-gray-400"
        required={required}
      >
        {options.map((option, index) => (
          <option key={option} value={index === 0 ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  required,
  placeholder,
  rows = 4,
  onFocus
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  onFocus?: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        rows={rows}
        placeholder={placeholder}
        required={required}
        onFocus={onFocus}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#097969] focus:ring-4 focus:ring-[#097969]/10 hover:border-gray-400 resize-vertical"
      />
    </label>
  );
}
