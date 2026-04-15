"use client";

import { FolderOpen, Download, Search, Loader2 } from "lucide-react";
import { useResourcesManagement } from "@/lib/hooks/useDashboard";
import { Input } from "@/components/ui/FormField";
import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";

export default function StudentResourcesPage() {
  const { data: resources = [], isLoading } = useResourcesManagement();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = (resources as any[]).filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Career Resources</h2>
          <p className="text-sm text-gray-500">Guides, templates, and documents to help you in your career journey.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Search for guides, templates, or documents..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#097969]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <FolderOpen size={24} className="text-gray-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {searchQuery ? "No matching resources" : "Empty Library"}
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                {searchQuery ? "Try a different search term." : "Resource documents and career guides will be available here soon."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((res: any) => (
              <div 
                key={res.id} 
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <StatusBadge status={res.category} />
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{res.title}</h3>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400 text-xs font-bold uppercase">
                    {res.type}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">
                  {res.description || "No description provided for this resource."}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400 font-medium">
                    {res.file_size}
                  </span>
                  <button 
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#097969] hover:bg-[#097969]/5 rounded-lg transition-colors"
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
