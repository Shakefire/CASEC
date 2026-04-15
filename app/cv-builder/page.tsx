"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, FileText, Users, GraduationCap, Target, MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { mailer } from "@/lib/email/sendEmail";

export default function CvBuilderPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    matric_number: "",
    password_hint: "", // strictly for matching original UI
    graduation_year: "",
    
    supervisor_name: "",
    supervisor_dept: "",
    supervisor_position: "",
    supervisor_email: "",
    supervisor_sex: "",
    supervisor_mobile: "",
    
    adviser_name: "",
    adviser_dept: "",
    adviser_position: "",
    adviser_email: "",
    adviser_sex: "",
    adviser_mobile: "",
    
    likes_run: "",
    dislikes_run: "",
    vc_change: "",
    future_desire: "",
    choice_details: ""
  });

  const steps = [
    { number: 1, title: "Student's Details", icon: FileText },
    { number: 2, title: "Project Supervisor", icon: Users },
    { number: 3, title: "Academic/Level Adviser", icon: GraduationCap },
    { number: 4, title: "Questionnaire", icon: MessageSquare },
    { number: 5, title: "Future Plans", icon: Target },
    { number: 6, title: "Detailed Response", icon: MessageSquare },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("las_questionnaires")
        .insert([{
          user_id: user?.id || null,
          matric_number: formData.matric_number,
          graduation_year: parseInt(formData.graduation_year) || null,
          supervisor_name: formData.supervisor_name,
          supervisor_dept: formData.supervisor_dept,
          supervisor_position: formData.supervisor_position,
          supervisor_email: formData.supervisor_email,
          supervisor_sex: formData.supervisor_sex,
          supervisor_mobile: formData.supervisor_mobile,
          adviser_name: formData.adviser_name,
          adviser_dept: formData.adviser_dept,
          adviser_position: formData.adviser_position,
          adviser_email: formData.adviser_email,
          adviser_sex: formData.adviser_sex,
          adviser_mobile: formData.adviser_mobile,
          likes_run: formData.likes_run,
          dislikes_run: formData.dislikes_run,
          vc_change: formData.vc_change,
          future_desire: formData.future_desire,
          choice_details: formData.choice_details,
          status: 'pending'
        }]);

      if (error) throw error;

      // Notify admin
      mailer.sendAdminAlert(
        "New LAS Application",
        `A new LAS Questionnaire has been submitted by ${formData.matric_number}.`,
        "/admin/runlas" // Assuming admin reviews it here
      ).catch(console.error);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Submission error:", err);
      alert("There was an error saving your application. Please try again.");
    } finally {
      setIsSubmitting(false);
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
              <span>RUN-LAS Application</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 animate-fade-in-up animation-delay-200">
              Life After School
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              The Hassle is Real
            </p>
            <div className="mt-8 flex justify-center animate-fade-in-up animation-delay-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-sm font-medium text-white shadow-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 cursor-default">
                <span>Complete your RUN-LAS application below</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {submitted ? (
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-12 text-center shadow-lg animate-in zoom-in-95 duration-500">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted Successfully</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Thank you for completing the RUN-LAS application. Your responses have been recorded and sent to the coordinator.
            </p>
            <div className="mt-8">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    matric_number: "", password_hint: "", graduation_year: "",
                    supervisor_name: "", supervisor_dept: "", supervisor_position: "", supervisor_email: "", supervisor_sex: "", supervisor_mobile: "",
                    adviser_name: "", adviser_dept: "", adviser_position: "", adviser_email: "", adviser_sex: "", adviser_mobile: "",
                    likes_run: "", dislikes_run: "", vc_change: "", future_desire: "", choice_details: ""
                  });
                }}
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
              <div className="flex items-center justify-between mb-6 overflow-x-auto pb-4 md:pb-0">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-shrink-0">
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Student's Details */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">1</div>
                  <h2 className="text-2xl font-bold text-gray-900">Student's Details</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Matric Number"
                    name="matric_number"
                    required
                    value={formData.matric_number}
                    onChange={handleInputChange}
                    placeholder="Enter your matric number"
                    onFocus={() => setCurrentStep(1)}
                  />
                  <FormField
                    label="Strictly Student Portal Password"
                    name="password_hint"
                    required
                    type="password"
                    value={formData.password_hint}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    onFocus={() => setCurrentStep(1)}
                  />
                  <FormField
                    label="Year of Graduation"
                    name="graduation_year"
                    required
                    type="number"
                    value={formData.graduation_year}
                    onChange={handleInputChange}
                    placeholder="Enter your year of graduation"
                    onFocus={() => setCurrentStep(1)}
                  />
                </div>
              </div>

              {/* 2. Project Supervisor */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">2</div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Supervisor</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Name"
                    name="supervisor_name"
                    required
                    value={formData.supervisor_name}
                    onChange={handleInputChange}
                    placeholder="Enter your supervisor name"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Department"
                    name="supervisor_dept"
                    required
                    value={formData.supervisor_dept}
                    onChange={handleInputChange}
                    placeholder="Enter your supervisor department"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Current Position"
                    name="supervisor_position"
                    required
                    value={formData.supervisor_position}
                    onChange={handleInputChange}
                    placeholder="Supervisor Position"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Email Address"
                    name="supervisor_email"
                    required
                    type="email"
                    value={formData.supervisor_email}
                    onChange={handleInputChange}
                    placeholder="Supervisor email"
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormSelect
                    label="Sex"
                    name="supervisor_sex"
                    required
                    value={formData.supervisor_sex}
                    onChange={handleInputChange}
                    options={["Select supervisor's gender", "Male", "Female"]}
                    onFocus={() => setCurrentStep(2)}
                  />
                  <FormField
                    label="Mobile Tel."
                    name="supervisor_mobile"
                    required
                    type="tel"
                    value={formData.supervisor_mobile}
                    onChange={handleInputChange}
                    placeholder="Supervisor mobile number"
                    onFocus={() => setCurrentStep(2)}
                  />
                </div>
              </div>

              {/* 3. Academic/Level Adviser */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">3</div>
                  <h2 className="text-2xl font-bold text-gray-900">Academic/Level Adviser</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Name"
                    name="adviser_name"
                    required
                    value={formData.adviser_name}
                    onChange={handleInputChange}
                    placeholder="Enter adviser name"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Department"
                    name="adviser_dept"
                    required
                    value={formData.adviser_dept}
                    onChange={handleInputChange}
                    placeholder="Adviser's department"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Current Position"
                    name="adviser_position"
                    required
                    value={formData.adviser_position}
                    onChange={handleInputChange}
                    placeholder="Adviser's Position"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Email Address"
                    name="adviser_email"
                    required
                    type="email"
                    value={formData.adviser_email}
                    onChange={handleInputChange}
                    placeholder="Adviser's email"
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormSelect
                    label="Sex"
                    name="adviser_sex"
                    required
                    value={formData.adviser_sex}
                    onChange={handleInputChange}
                    options={["Select adviser gender", "Male", "Female"]}
                    onFocus={() => setCurrentStep(3)}
                  />
                  <FormField
                    label="Mobile Tel."
                    name="adviser_mobile"
                    required
                    type="tel"
                    value={formData.adviser_mobile}
                    onChange={handleInputChange}
                    placeholder="Adviser's mobile number"
                    onFocus={() => setCurrentStep(3)}
                  />
                </div>
              </div>

              {/* 4. Questionnaire */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">4</div>
                  <h2 className="text-2xl font-bold text-gray-900">Questionnaire</h2>
                </div>
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">Please read the following questions carefully before answering.</p>
                </div>
                <div className="space-y-6">
                  <TextAreaField
                    label="What do you like about RUN (in few words)"
                    name="likes_run"
                    required
                    value={formData.likes_run}
                    onChange={handleInputChange}
                    placeholder="Enter what you like"
                    onFocus={() => setCurrentStep(4)}
                  />
                  <TextAreaField
                    label="What do you dislike about RUN (in few words)"
                    name="dislikes_run"
                    required
                    value={formData.dislikes_run}
                    onChange={handleInputChange}
                    placeholder="Enter what you dislike"
                    onFocus={() => setCurrentStep(4)}
                  />
                  <TextAreaField
                    label="If you had 24 hours to be the VC of RUN what will you like to change or do most about RUN (in few words)"
                    name="vc_change"
                    value={formData.vc_change}
                    onChange={handleInputChange}
                    placeholder="Enter your response..."
                    onFocus={() => setCurrentStep(4)}
                  />
                </div>
              </div>

              {/* 5. Future Plans */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">5</div>
                  <h2 className="text-2xl font-bold text-gray-900">What is your desire after graduating from RUN</h2>
                </div>
                <FormSelect
                  label="Choose an option"
                  name="future_desire"
                  required
                  value={formData.future_desire}
                  onChange={handleInputChange}
                  options={["Select an option", "Get a Job / Employment", "Start a Business / Entrepreneurship", "Postgraduate Studies", "Professional Certification", "NYSC then decide", "Other"]}
                  onFocus={() => setCurrentStep(5)}
                />
              </div>

              {/* 6. Detailed Response */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#097969] text-white text-sm font-bold">6</div>
                  <h2 className="text-2xl font-bold text-gray-900">Tell us about your choice in 5 above</h2>
                </div>
                <TextAreaField
                  label="Feel free to express yourself"
                  name="choice_details"
                  required
                  value={formData.choice_details}
                  onChange={handleInputChange}
                  placeholder="Enter details..."
                  rows={6}
                  onFocus={() => setCurrentStep(6)}
                />
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-[#097969] px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
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

function FormField({ label, required, type = "text", name, value, onChange, placeholder, onFocus }: any) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-2 block">{label} {required && "*" }</span>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} onFocus={onFocus}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#097969] focus:ring-4 focus:ring-[#097969]/10"
      />
    </label>
  );
}

function FormSelect({ label, required, name, value, onChange, options, onFocus }: any) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-2 block">{label} {required && "*" }</span>
      <select
        name={name} value={value} onChange={onChange} onFocus={onFocus} required={required}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#097969] focus:ring-4 focus:ring-[#097969]/10"
      >
        {options.map((option: string, index: number) => (
          <option key={option} value={index === 0 ? "" : option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, required, name, value, onChange, placeholder, rows = 4, onFocus }: any) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-2 block">{label} {required && "*" }</span>
      <textarea
        name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder} required={required} onFocus={onFocus}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#097969] focus:ring-4 focus:ring-[#097969]/10 resize-none"
      />
    </label>
  );
}
