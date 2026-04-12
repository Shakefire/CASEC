import { Resource } from "@/lib/data";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{resource.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{resource.fileSize} · Uploaded: {resource.uploadedAt}</p>
        </div>
        <span className="inline-flex rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-semibold text-[#097969]">PDF</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{resource.fileName}</p>
    </div>
  );
}
