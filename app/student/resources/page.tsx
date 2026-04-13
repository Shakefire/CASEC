import { FolderOpen } from "lucide-react";

export default function StudentResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Career Resources</h2>
        <p className="text-sm text-gray-500">Guides, templates, and documents to help you in your career journey.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
          <FolderOpen size={24} className="text-gray-300" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Empty Library</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">Resource documents and career guides will be available here soon.</p>
        </div>
      </div>
    </div>
  );
}
