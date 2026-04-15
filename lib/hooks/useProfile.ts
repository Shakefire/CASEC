"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface StudentProfile {
  id: string;
  user_id: string;
  department: string | null;
  level: string | null;
  matric_number: string | null;
  skills: string[] | null;
  bio: string | null;
  career_interests: string[] | null;
  cv_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  profile_completion_score: number;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function useProfile(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<StudentProfile>({
    queryKey: ["student-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      try {
        const { data, error } = await supabase
          .from("student_profiles")
          .select("*, profiles(first_name, last_name, email)")
          .eq("user_id", userId)
          .maybeSingle(); // Use maybeSingle to avoid coercion error for 0 rows

        if (error) {
           console.error("❌ useProfile DB Error:", error.message);
           throw error;
        }

        // If not found, try to auto-create
        if (!data) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("role, department, first_name, last_name, email")
            .eq("id", userId)
            .maybeSingle();

          if (!profileError && profileData && profileData.role === "student") {
            const { data: newProfile, error: createError } = await supabase
              .from("student_profiles")
              .upsert({ user_id: userId, department: profileData.department })
              .select("*, profiles(first_name, last_name, email)")
              .maybeSingle();

            if (!createError && newProfile) return newProfile as StudentProfile;
          }
          
          // Return a skeleton if creation failed or user isn't a student
          return {
            user_id: userId,
            profiles: { first_name: "User", last_name: "", email: "" },
            profile_completion_score: 0
          } as any;
        }

        return data as StudentProfile;
      } catch (err: any) {
         console.error("❌ useProfile Catch:", err.message || err);
         throw err;
       }
    },
    enabled: !!userId,
    retry: 1, // Only retry once for profile to fail faster if there's an issue
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<StudentProfile> & { profiles?: any }) => {
      if (!userId) throw new Error("User ID is required");

      // Split updates between profiles and student_profiles
      const { profiles: profileUpdates, ...studentUpdates } = updates;

      if (profileUpdates && Object.keys(profileUpdates).length > 0) {
        const { error: pError } = await supabase
          .from("profiles")
          .update(profileUpdates)
          .eq("id", userId);
        if (pError) throw pError;
      }

      if (Object.keys(studentUpdates).length > 0) {
        // Calculate completion score
        const score = calculateCompletionScore({ ...query.data, ...studentUpdates, profiles: { ...query.data?.profiles, ...profileUpdates } });
        studentUpdates.profile_completion_score = score;

        const { error: sError } = await supabase
          .from("student_profiles")
          .update(studentUpdates)
          .eq("user_id", userId);
        if (sError) throw sError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-profile", userId] });
    },
  });

  return { ...query, updateProfile: updateMutation };
}

function calculateCompletionScore(data: any): number {
  const fields = [
    data?.profiles?.first_name,
    data?.profiles?.last_name,
    data?.department,
    data?.level,
    data?.skills?.length > 0,
    data?.bio,
    data?.cv_url,
    data?.linkedin_url,
  ];

  const filled = fields.filter(Boolean).length;
  const baseScore = 30;
  const variableScore = Math.round((filled / fields.length) * (100 - baseScore));
  
  return baseScore + variableScore;
}

export function useCVUpload(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!userId) throw new Error("User ID is required");

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      // Upload to 'CV' bucket
      const { error: uploadError } = await supabase.storage
        .from("CV")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("CV")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("student_profiles")
        .update({ cv_url: publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-profile", userId] });
    },
  });
}

