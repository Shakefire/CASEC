import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError, className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full border rounded px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#097969] focus:border-[#097969] transition-colors ${
        hasError ? "border-red-400" : "border-slate-300"
      } ${className}`}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ hasError, className = "", children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full border rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#097969] focus:border-[#097969] transition-colors bg-white ${
        hasError ? "border-red-400" : "border-slate-300"
      } ${className}`}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ hasError, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 4}
      className={`w-full border rounded px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#097969] focus:border-[#097969] transition-colors resize-none ${
        hasError ? "border-red-400" : "border-slate-300"
      } ${className}`}
    />
  );
}
