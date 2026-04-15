"use client";

import { CheckCircle, XCircle, Clock, Loader2, Eye, ClipboardList, Building2, User } from "lucide-react";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import { useRunlasManagement } from "@/lib/hooks/useDashboard";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

export default function AdminRunlasPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'placements' | 'questionnaires'>('placements');
  
  // 1. Fetch Placement Forms
  const { data: placementForms = [], isLoading: placementsLoading, refetch: refetchPlacements } = useRunlasManagement();

  // 2. Fetch LAS Questionnaires
  const { data: questionnaires = [], isLoading: questionsLoading, refetch: refetchQuestionnaires } = useQuery({
    queryKey: ["las-questionnaires"],
    queryFn: async () => {
      const { data, error } = await supabase.from("las_questionnaires").select("*").order("submitted_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [reviewRemark, setReviewRemark] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStatus(form: any, status: string) {
    if (isUpdating) return;
    setIsUpdating(true);
    
    // Safety check: ensure table exists and columns match
    const table = activeTab === 'placements' ? 'runlas_forms' : 'las_questionnaires';
    
    try {
      console.log(`⏳ Updating ${table} ID: ${form.id} to status: ${status}`);
      
      const updateData: any = {
        status,
        reviewed_at: new Date().toISOString(),
      };

      if (table === 'runlas_forms') {
        updateData.remarks = reviewRemark;
      } else {
        updateData.admin_remarks = reviewRemark;
      }

      const { data, error } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", form.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error("No record found to update or permission denied (RLS)");
      }

      console.log("✅ Update successful:", data);

      // Force immediate local refetch
      if (activeTab === 'placements') {
        await refetchPlacements();
      } else {
        await refetchQuestionnaires();
      }

      setSelectedForm(null);
      setReviewRemark("");
      
    } catch (err: any) {
      console.error("❌ Update Error:", err);
      alert(`Database Error: ${err.message || "Unknown error occurred"}\n\nPlease ensure you have run the latest SQL update in Supabase.`);
    } finally {
      setIsUpdating(false);
    }
  }

  // Columns for Placements
  const placementColumns = [
    {
      key: "user",
      header: "Student",
      render: (row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{row.student_name}</span>
            {!row.user_id && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Guest</span>}
          </div>
          <span className="text-xs text-gray-500">{row.department}</span>
        </div>
      ),
    },
    {
      key: "organization",
      header: "Placement",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{row.organization}</span>
          <span className="text-xs text-gray-400">Sup: {row.supervisor}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedForm(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
            <Eye size={18} />
          </button>
          {row.status === 'pending' && (
             <div className="flex items-center gap-1 border-l pl-2">
                <button 
                  onClick={() => updateStatus(row, 'approved')} 
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Quick Approve"
                >
                  <CheckCircle size={18} />
                </button>
                <button 
                  onClick={() => updateStatus(row, 'rejected')} 
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Quick Reject"
                >
                  <XCircle size={18} />
                </button>
             </div>
          )}
        </div>
      ),
    },
  ];

  // Columns for Questionnaires
  const questionColumns = [
    {
      key: "matric",
      header: "Matric Number",
      render: (row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{row.matric_number}</span>
            {!row.user_id && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Guest</span>}
          </div>
          <span className="text-xs text-gray-500">Class: {row.graduation_year}</span>
        </div>
      ),
    },
    {
      key: "supervisor",
      header: "Facilitators",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-700">Sup: {row.supervisor_name}</span>
          <span className="text-xs text-gray-400">Adv: {row.adviser_name}</span>
        </div>
      ),
    },
    {
      key: "future",
      header: "Plans",
      render: (row: any) => (
        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg uppercase tracking-tight">
          {row.future_desire}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedForm(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye size={18} />
          </button>
          {row.status === 'pending' && (
             <div className="flex items-center gap-1 border-l pl-2">
                <button onClick={() => updateStatus(row, 'approved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                  <CheckCircle size={18} />
                </button>
                <button onClick={() => updateStatus(row, 'rejected')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                  <XCircle size={18} />
                </button>
             </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="text-[#097969]" />
                RUN-LAS Console
            </h1>
            <p className="text-sm text-gray-500">Manage submissions from students and guests</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('placements')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'placements' ? 'bg-white text-[#097969] shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          Placement Forms ({placementForms.length})
        </button>
        <button
          onClick={() => setActiveTab('questionnaires')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'questionnaires' ? 'bg-white text-[#097969] shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          LAS Questionnaires ({questionnaires.length})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table 
          data={activeTab === 'placements' ? placementForms : questionnaires} 
          columns={activeTab === 'placements' ? placementColumns : questionColumns} 
          loading={activeTab === 'placements' ? placementsLoading : questionsLoading} 
        />
      </div>

      {selectedForm && (
        <Modal 
          isOpen={!!selectedForm} 
          onClose={() => setSelectedForm(null)}
          title={activeTab === 'placements' ? "Placement Details" : "Questionnaire Details"}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 p-4 bg-gray-100 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center justify-between">
                    Student Details
                    {!selectedForm.user_id && <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[9px]">GUEST SUBMISSION</span>}
                  </p>
                  <p className="text-lg font-bold">
                    {activeTab === 'placements' ? selectedForm.student_name : selectedForm.matric_number}
                  </p>
               </div>
               
               {activeTab === 'questionnaires' ? (
                 <div className="col-span-2 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Supervisor</p>
                        <p className="text-sm font-medium">{selectedForm.supervisor_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Adviser</p>
                        <p className="text-sm font-medium">{selectedForm.adviser_name}</p>
                      </div>
                   </div>
                   <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                     <p className="text-xs font-bold text-emerald-800 uppercase mb-2">Future Ambition</p>
                     <p className="font-bold text-emerald-900">{selectedForm.future_desire}</p>
                     <p className="text-sm text-emerald-700 mt-1">{selectedForm.choice_details}</p>
                   </div>
                 </div>
               ) : (
                 <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Organization</p>
                      <p className="text-sm font-medium">{selectedForm.organization}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Industrial Supervisor</p>
                      <p className="text-sm font-medium">{selectedForm.supervisor}</p>
                    </div>
                 </div>
               )}
            </div>

            {selectedForm.status === 'pending' && (
              <div className="space-y-4 pt-4 border-t">
                <textarea 
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm"
                  placeholder="Review comments (optional)..."
                  rows={2}
                  value={reviewRemark}
                  onChange={(e) => setReviewRemark(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    disabled={isUpdating}
                    onClick={() => updateStatus(selectedForm, "rejected")}
                    className="flex-1 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => updateStatus(selectedForm, "approved")}
                    className="flex-1 px-4 py-3 bg-[#097969] text-white rounded-xl font-bold shadow-lg hover:bg-[#076356] transition-colors"
                  >
                    {isUpdating ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Approve Submission"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
