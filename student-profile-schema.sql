
-- ============================================================
-- 11. STUDENT PROFILES (Extended Student Info)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  
  department TEXT,
  level TEXT CHECK (level IN ('100', '200', '300', '400', '500', '600', 'Alumni')),
  matric_number TEXT,
  
  skills TEXT[],
  bio TEXT,
  
  career_interests TEXT[],
  
  cv_url TEXT,
  
  linkedin_url TEXT,
  github_url TEXT,
  
  profile_completion_score INTEGER DEFAULT 30,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public student profiles are viewable by everyone." ON public.student_profiles;
CREATE POLICY "Public student profiles are viewable by everyone." ON public.student_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students can insert their own student profile." ON public.student_profiles;
CREATE POLICY "Students can insert their own student profile." ON public.student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update own student profile." ON public.student_profiles;
CREATE POLICY "Students can update own student profile." ON public.student_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- 12. AUTO PROFILE CREATION TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_student_profile()
RETURNS trigger AS $$
BEGIN
  IF NEW.role = 'student' THEN
    INSERT INTO public.student_profiles (user_id, department)
    VALUES (NEW.id, NEW.department);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_setup_student ON public.profiles;
CREATE TRIGGER on_profile_created_setup_student
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_student_profile();

-- ============================================================
-- 13. STORAGE BUCKETS (Run these via Supabase Dashboard or API)
-- ============================================================
-- 1. Create 'cv_storage' bucket
-- 2. Set Public Access: true
-- 3. Policy: Authenticated users can upload to their own folder (cv_storage/auth.uid()/*)
-- 4. Policy: Anyone can read from cv_storage
