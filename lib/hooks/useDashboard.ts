"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Booking {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  purpose: string;
  start_time: string;
  end_time: string;
  status: string;
  meeting_link: string | null;
  admin_note: string | null;
  details: string | null;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

export function useBookings(userId?: string) {
  return useQuery<Booking[]>({
    queryKey: ["bookings", userId],
    queryFn: async () => {
      try {
        let query = supabase
          .from("bookings")
          .select("*, profiles(first_name, last_name)")
          .order("start_time", { ascending: false });

        if (userId) {
          query = query.eq("user_id", userId);
        }

        const { data, error } = await query;
        if (error) {
          console.error("❌ useBookings Error:", error);
          throw new Error(error.message || "Failed to fetch bookings");
        }
        return data as Booking[];
      } catch (err: any) {
        console.error("❌ useBookings Catch:", err);
        throw err || new Error("Unknown error in useBookings");
      }
    },
  });
}

export function useBookingStats() {
  return useQuery({
    queryKey: ["booking-stats"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("bookings").select("status");
        if (error) {
          console.error("❌ useBookingStats Error:", error);
          throw new Error(error.message || "Failed to fetch booking stats");
        }

        const total = data?.length || 0;
        const pending = data?.filter((b) => b.status === "pending").length || 0;
        const approved = data?.filter((b) => b.status === "approved").length || 0;

        return { total, pending, approved };
      } catch (err: any) {
        console.error("❌ useBookingStats Catch:", err);
        throw err || new Error("Unknown error in useBookingStats");
      }
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const results = await Promise.all([
          supabase.from("opportunities").select("status"),
          supabase.from("profiles").select("role"),
          supabase.from("bookings").select("status"),
          supabase.from("events").select("status"),
          supabase.from("resources").select("id"),
          supabase.from("runlas_forms").select("status"),
        ]);

        const errors = results.filter(r => r.error).map(r => r.error);
        if (errors.length > 0) {
          console.error("❌ useAdminStats Errors:", errors);
          throw new Error("Failed to fetch some admin stats");
        }

        const [opps, profiles, bookings, events, resources, runlas] = results.map(r => r.data);

        return {
          opportunities: opps?.length || 0,
          activeOpportunities: opps?.filter((o: any) => o.status === "active").length || 0,
          users: profiles?.length || 0,
          students: profiles?.filter((p: any) => p.role === "student").length || 0,
          employers: profiles?.filter((p: any) => p.role === "employer").length || 0,
          bookings: bookings?.length || 0,
          pendingBookings: bookings?.filter((b: any) => b.status === "pending").length || 0,
          events: events?.length || 0,
          resources: resources?.length || 0,
          runlas: runlas?.length || 0,
          pendingRunlas: runlas?.filter((r: any) => r.status === "pending").length || 0,
        };
      } catch (err: any) {
        console.error("❌ useAdminStats Catch:", err);
        throw err || new Error("Unknown error in useAdminStats");
      }
    },
  });
}

export function useOpportunities(status: string = "active", limit: number = 5) {
  return useQuery({
    queryKey: ["opportunities", status, limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("opportunities")
          .select("*, profiles(email)")
          .eq("status", status)
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) {
          console.error("❌ useOpportunities Error:", error);
          throw new Error(error.message || "Failed to fetch opportunities");
        }
        return (data || []).map((o: any) => ({
          id: o.id,
          title: o.title,
          type: o.type || "job",
          deadline: o.deadline,
          description: o.description,
          createdAt: o.created_at,
          status: o.status,
          location: o.location,
          salary: o.salary,
          postedByName: o.posted_by_name,
          postedByEmail: o.profiles?.email, // Mapped email
          requirements: o.requirements,
          skills: o.skills,
          eligibility: o.eligibility,
          application_instructions: o.application_instructions,
        }));
      } catch (err: any) {
        console.error("❌ useOpportunities Catch:", err.message || err);
        throw err || new Error("Unknown error in useOpportunities");
      }
    },
  });
}

export function useEvents(isPast: boolean = false, limit: number = 3) {
  return useQuery({
    queryKey: ["events", isPast, limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("is_past", isPast)
          .order("date", { ascending: true })
          .limit(limit);
        if (error) {
          console.error("❌ useEvents Error:", error);
          throw new Error(error.message || "Failed to fetch events");
        }
        return (data || []).map((e: any) => ({
          id: e.id, title: e.title, date: e.date, location: e.location, description: e.description,
          createdAt: e.created_at || "",
          image_url: e.image_url || null,
        }));
      } catch (err: any) {
        console.error("❌ useEvents Catch:", err);
        throw err || new Error("Unknown error in useEvents");
      }
    },
  });
}

export function useBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type, body }: { id: string; type: string; body: any }) => {
      try {
        const endpoint = type === "create" ? "/api/bookings/create" : `/api/bookings/${id}/${type}`;
        const method = type === "create" ? "POST" : "PATCH";

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || `Failed to ${type} booking`);
        }

        return data;
      } catch (err: any) {
        console.error("❌ useBookingMutation Catch:", err);
        throw err instanceof Error ? err : new Error(String(err) || "Unknown mutation error");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities-management"] });
      queryClient.invalidateQueries({ queryKey: ["applications-management"] });
      queryClient.invalidateQueries({ queryKey: ["events-management"] });
      queryClient.invalidateQueries({ queryKey: ["resources-management"] });
      queryClient.invalidateQueries({ queryKey: ["runlas-management"] });
    },
  });
}

export function useEmployerDashboard(userId?: string) {
  return useQuery({
    queryKey: ["employer-dashboard", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const [oppsRes, appsRes] = await Promise.all([
        supabase.from("opportunities").select("*").eq("posted_by", userId).order("created_at", { ascending: false }),
        supabase.from("job_applications").select("*, opportunities(title), profiles(first_name, last_name)").order("applied_at", { ascending: false })
      ]);

      if (oppsRes.error) throw oppsRes.error;
      
      const opportunities = oppsRes.data || [];
      const oppIds = opportunities.map(o => o.id);
      
      const allApps = appsRes.data || [];
      const employerApps = allApps.filter(app => oppIds.includes(app.job_id));

      return {
        stats: {
          totalOpportunities: opportunities.length,
          activeListings: opportunities.filter(o => o.status === "active").length,
          totalApplications: employerApps.length,
          pendingApplications: employerApps.filter(a => a.status === "submitted" || a.status === "under_review").length,
        },
        recentOpportunities: opportunities.slice(0, 5),
        recentApplications: employerApps.slice(0, 5),
      };
    },
    enabled: !!userId,
  });
}

export function useStudentDashboard(userId?: string) {
  return useQuery({
    queryKey: ["student-dashboard", userId],
    queryFn: async () => {
      const [jobsRes, eventsRes, appsRes] = await Promise.all([
        supabase.from("opportunities").select("id").eq("status", "active"),
        supabase.from("events").select("id").eq("is_past", false),
        userId ? supabase.from("applications").select("id").eq("user_id", userId) : Promise.resolve({ data: [], error: null })
      ]);

      if (jobsRes.error) throw jobsRes.error;
      if (eventsRes.error) throw eventsRes.error;

      return {
        availableJobs: jobsRes.data?.length || 0,
        upcomingEvents: eventsRes.data?.length || 0,
        myApplications: appsRes.data?.length || 0,
      };
    },
  });
}

export function useUsersManagement() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, email, role, first_name, last_name, company_name, created_at, student_profiles(profile_completion_score, cv_url, department)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ useUsersManagement Error:", error.message || error);
        throw error;
      }
      return profiles;
    },
  });
}

export function useOpportunitiesManagement(postedBy?: string) {
  return useQuery({
    queryKey: ["opportunities-management", postedBy],
    queryFn: async () => {
      let query = supabase
        .from("opportunities")
        .select(`
          *,
          applications_count:job_applications(id)
        `)
        .order("created_at", { ascending: false });
      
      if (postedBy) {
        query = query.eq("posted_by", postedBy);
      }

      const { data, error } = await query;
      if (error) {
        console.error("❌ useOpportunitiesManagement Error:", error);
        throw error;
      }
      
      // Map to include a simple count field
      return (data || []).map(opp => ({
        ...opp,
        applicationCount: Array.isArray(opp.applications_count) ? opp.applications_count.length : 0
      }));
    },
  });
}

export function useResourceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      if (id) {
        const { error } = await supabase
          .from("resources")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("resources")
          .insert([updates]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources-management"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useResourceDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources-management"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useResourceUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `resources/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("pdf_resource")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("pdf_resource")
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      };
    },
  });
}

export function useEventsManagement() {
  return useQuery({
    queryKey: ["events-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ useEventsManagement Error:", error);
        throw error;
      }
      return data || [];
    },
  });
}

export function useApplicationsManagement(employerId?: string) {
  return useQuery({
    queryKey: ["applications-management", employerId],
    queryFn: async () => {
      let query = supabase
        .from("job_applications")
        .select(`
          *,
          opportunities(title, posted_by),
          profiles(first_name, last_name, email)
        `)
        .order("applied_at", { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error("❌ useApplicationsManagement Error:", error.message || error);
        throw error;
      }

      let applications = data || [];
      
      if (employerId) {
        applications = applications.filter((app: any) => app.opportunities?.posted_by === employerId);
      }

      return applications;
    },
  });
}

export function useApplicationAnswers(applicationId?: string) {
  return useQuery({
    queryKey: ["application-answers", applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      const { data, error } = await supabase
        .from("application_answers")
        .select("*, application_questions(question, type)")
        .eq("application_id", applicationId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!applicationId
  });
}

export function useStudentApplications(userId?: string) {
  return useQuery({
    queryKey: ["student-applications", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      try {
        const { data, error } = await supabase
          .from("job_applications")
          .select("*, opportunities(*)")
          .eq("student_id", userId)
          .order("applied_at", { ascending: false });

        if (error) {
          console.error("❌ useStudentApplications Error:", error.message || error);
          throw error;
        }
        return data || [];
      } catch (err: any) {
        console.error("❌ useStudentApplications Catch:", err.message || err);
        throw err;
      }
    },
    enabled: !!userId,
  });
}

export function useResourcesManagement() {
  return useQuery({
    queryKey: ["resources-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) {
        console.error("❌ useResourcesManagement Error:", error);
        throw error;
      }
      return data || [];
    },
  });
}

export function useRunlasManagement() {
  return useQuery({
    queryKey: ["runlas-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("runlas_forms")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("❌ useRunlasManagement Error:", error);
        throw error;
      }
      return data || [];
    },
  });
}

export function useRunlasSubmissions(userId?: string) {
  return useQuery({
    queryKey: ["runlas-submissions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("runlas_forms")
        .select("*")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useRunlasMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      if (id) {
        // Update (Review or Edit)
        const { error } = await supabase
          .from("runlas_forms")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
      } else {
        // Insert (New submission)
        const { error } = await supabase
          .from("runlas_forms")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runlas-management"] });
      queryClient.invalidateQueries({ queryKey: ["runlas-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
