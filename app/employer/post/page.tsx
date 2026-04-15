"use client";

import { useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface PostForm {
  title: string;
  description: string;
  posted_by_name: string;
  location: string;
  salary: string;
  requirements: string;
  skills: string;
  eligibility: string;
  application_instructions: string;
  type: string;
  deadline: string;
}

const emptyForm: PostForm = { 
  title: "", 
  description: "", 
  posted_by_name: "",
  location: "",
  salary: "",
  requirements: "",
  skills: "",
  eligibility: "",
  application_instructions: "",
  type: "job", 
  deadline: "" 
};

export default function EmployerPostOpportunityPage() {
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<PostForm>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function validate() {
    const e: Partial<PostForm> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.deadline) e.deadline = "Deadline is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus("submitting");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("opportunities")
        .insert([{
          title: form.title,
          description: form.description,
          posted_by_name: form.posted_by_name,
          location: form.location,
          salary: form.salary,
          requirements: form.requirements ? form.requirements.split("\n").map(r => r.trim()).filter(Boolean) : [],
          skills: form.skills ? form.skills.split("\n").map(s => s.trim()).filter(Boolean) : [],
          eligibility: form.eligibility ? form.eligibility.split("\n").map(r => r.trim()).filter(Boolean) : [],
          application_instructions: form.application_instructions,
          type: form.type,
          deadline: form.deadline,
          status: "active",
          posted_by: user?.id,
        }]);

      if (error) {
        alert("Failed to post opportunity: " + error.message);
        setStatus("idle");
      } else {
        setStatus("success");
        setForm(emptyForm);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white border border-gray-200 rounded p-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-green-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-2">
          Opportunity Posted Successfully
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Your opportunity is now live and students can begin applying immediately.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setStatus("idle")}
            className="px-4 py-2 bg-[#1a2e4a] text-white text-sm rounded hover:bg-[#14253d] transition-colors"
          >
            Post Another Opportunity
          </button>
          <Link
            href="/employer/opportunities"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium mt-2"
          >
            Manage your listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Post a New Opportunity</h2>
        <p className="text-sm text-gray-500">
          Complete the form below to share a job, internship, or scholarship with Nigeria University students.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Opportunity Title" required error={errors.title}>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Graduate Software Engineer"
                hasError={!!errors.title}
              />
            </FormField>
            <FormField label="Company Name">
              <Input
                value={form.posted_by_name}
                onChange={(e) => setForm((f) => ({ ...f, posted_by_name: e.target.value }))}
                placeholder="e.g. Access Bank"
              />
            </FormField>
            <FormField label="Location">
              <Input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Lagos, Remote"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Employment Type">
              <Select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="job">Job</option>
                <option value="internship">Internship</option>
                <option value="scholarship">Scholarship</option>
                <option value="competition">Competition</option>
              </Select>
            </FormField>
            <FormField label="Salary / Stipend">
              <Input
                value={form.salary}
                onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                placeholder="e.g. ₦150,000"
              />
            </FormField>
            <FormField label="Deadline" required error={errors.deadline}>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                hasError={!!errors.deadline}
              />
            </FormField>
          </div>

          <FormField label="Description" required error={errors.description}>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Provide a detailed description of the role..."
              rows={4}
              hasError={!!errors.description}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Requirements (One per line)">
              <Textarea
                value={form.requirements}
                onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
                placeholder="Degree in CS&#10;2+ years experience"
                rows={4}
              />
            </FormField>
            <FormField label="Skills Needed (One per line)">
              <Textarea
                value={form.skills}
                onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                placeholder="JavaScript&#10;Python&#10;AWS"
                rows={4}
              />
            </FormField>
            <FormField label="Eligibility (One per line)">
              <Textarea
                value={form.eligibility}
                onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))}
                placeholder="Nigerian Students&#10;3.5 CGPA"
                rows={4}
              />
            </FormField>
          </div>

          <FormField label="Application Instructions">
            <Textarea
              value={form.application_instructions}
              onChange={(e) => setForm((f) => ({ ...f, application_instructions: e.target.value }))}
              placeholder="How should students apply? (e.g. Email CV to...)"
              rows={2}
            />
          </FormField>


          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => { setForm(emptyForm); setErrors({}); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={status === "submitting"}
              className={`px-6 py-2 text-sm bg-[#1a2e4a] text-white rounded hover:bg-[#14253d] transition-colors ${
                status === "submitting" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {status === "submitting" ? "Posting..." : "Submit Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
