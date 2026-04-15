-- ============================================================
-- CASEC Career Portal — Full Database Schema
-- Run this in your Supabase SQL Editor
-- Safe to re-run (all policies use DROP IF EXISTS)
-- ============================================================

-- ============================================================
-- 1. PROFILES (Extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employer', 'student')),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,            -- employers only
  department TEXT,               -- students only
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Extended student data (Skills, CV, Bio)
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  department TEXT,
  level TEXT,
  matric_number TEXT,
  skills TEXT[],
  bio TEXT,
  career_interests TEXT[],
  cv_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  profile_completion_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Student Profile Policies
DROP POLICY IF EXISTS "Public can view student profiles." ON public.student_profiles;
CREATE POLICY "Public can view student profiles." ON public.student_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Students can update own." ON public.student_profiles;
CREATE POLICY "Students can update own." ON public.student_profiles FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Students can insert own." ON public.student_profiles;
CREATE POLICY "Students can insert own." ON public.student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 2. OPPORTUNITIES (Jobs, Internships, Scholarships, Competitions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('job', 'internship', 'scholarship', 'competition')),
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  posted_by UUID REFERENCES public.profiles(id),
  posted_by_name TEXT,           -- display name (company/org)
  location TEXT,                 -- e.g. "Lagos", "Remote"
  salary TEXT,                   -- salary or stipend info
  requirements TEXT[],           -- array of requirement strings
  skills TEXT[],                 -- array of required skills
  eligibility TEXT[],            -- array of eligibility strings
  application_instructions TEXT, -- how to apply
  company_logo_url TEXT,         -- optional logo link
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Opportunities are viewable by everyone." ON public.opportunities;
CREATE POLICY "Opportunities are viewable by everyone." ON public.opportunities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Employers and Admins can insert." ON public.opportunities;
CREATE POLICY "Employers and Admins can insert." ON public.opportunities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employer'))
);
DROP POLICY IF EXISTS "Owners and Admins can update." ON public.opportunities;
CREATE POLICY "Owners and Admins can update." ON public.opportunities FOR UPDATE USING (
  posted_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Owners and Admins can delete." ON public.opportunities;
CREATE POLICY "Owners and Admins can delete." ON public.opportunities FOR DELETE USING (
  posted_by = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 3. JOB APPLICATIONS & QUESTIONS
-- ============================================================

-- Custom questions employers can add to specific jobs
CREATE TABLE IF NOT EXISTS public.application_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'long_text', 'dropdown', 'yes_no', 'multiple_choice', 'file')),
  options TEXT[],                 -- used for dropdown/multiple choice
  required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Advanced application tracking
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted' 
    CHECK (status IN ('draft', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'rejected', 'accepted')),
  
  -- Student Profile Snapshot (for tracking historical accuracy)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  student_id_num TEXT,
  department TEXT,
  level TEXT,
  cgpa NUMERIC,
  graduation_year INTEGER,
  
  -- Professional Info
  linked_in_url TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  
  -- Documents (URLs to storage)
  resume_url TEXT NOT NULL,
  cover_letter TEXT, 
  transcript_url TEXT,
  
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Individual answers to custom questions
CREATE TABLE IF NOT EXISTS public.application_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.application_questions(id) ON DELETE CASCADE,
  answer TEXT,                    -- text answer or value
  file_url TEXT,                  -- if question type was 'file'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.application_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_answers ENABLE ROW LEVEL SECURITY;

-- POLICIES: Questions
DROP POLICY IF EXISTS "Questions are public." ON public.application_questions;
CREATE POLICY "Questions are public." ON public.application_questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Employers manage their questions." ON public.application_questions;
CREATE POLICY "Employers manage their questions." ON public.application_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = job_id AND o.posted_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- POLICIES: Applications
DROP POLICY IF EXISTS "Students see own apps." ON public.job_applications;
CREATE POLICY "Students see own apps." ON public.job_applications FOR SELECT USING (auth.uid() = student_id);
DROP POLICY IF EXISTS "Students apply." ON public.job_applications;
CREATE POLICY "Students apply." ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = student_id);
DROP POLICY IF EXISTS "Employers see job apps." ON public.job_applications;
CREATE POLICY "Employers see job apps." ON public.job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = job_id AND o.posted_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Employers update status." ON public.job_applications;
CREATE POLICY "Employers update status." ON public.job_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = job_id AND o.posted_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- POLICIES: Answers
DROP POLICY IF EXISTS "Access own answers." ON public.application_answers;
CREATE POLICY "Access own answers." ON public.application_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.job_applications ja WHERE ja.id = application_id AND (ja.student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = ja.job_id AND o.posted_by = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);
DROP POLICY IF EXISTS "Students submit answers." ON public.application_answers;
CREATE POLICY "Students submit answers." ON public.application_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.job_applications ja WHERE ja.id = application_id AND ja.student_id = auth.uid())
);

-- ============================================================
-- 4. BOOKINGS
-- ============================================================
DROP TABLE IF EXISTS public.bookings CASCADE;
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  purpose TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'rescheduled', 'completed')),
  meeting_link TEXT,
  admin_note TEXT,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own, admin can see all." ON public.bookings;
CREATE POLICY "Users can see own, admin can see all." ON public.bookings FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Guests and users can insert." ON public.bookings;
CREATE POLICY "Guests and users can insert." ON public.bookings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can update." ON public.bookings;
CREATE POLICY "Admins can update." ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 4.1 NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking_update', 'system', 'reminder')),
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own notifications." ON public.notifications;
CREATE POLICY "Users can see own notifications." ON public.notifications FOR SELECT USING (
  user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "System can insert." ON public.notifications;
CREATE POLICY "System can insert." ON public.notifications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can update own read_status." ON public.notifications;
CREATE POLICY "Users can update own read_status." ON public.notifications FOR UPDATE USING (
  user_id = auth.uid()
);

-- ============================================================
-- 4.2 AVAILABILITY SLOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can see available slots." ON public.availability_slots;
CREATE POLICY "Anyone can see available slots." ON public.availability_slots FOR SELECT USING (is_available = true);
DROP POLICY IF EXISTS "Admins can manage slots." ON public.availability_slots;
CREATE POLICY "Admins can manage slots." ON public.availability_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 5. EVENTS (Upcoming & Past)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  category TEXT CHECK (category IN ('Workshop', 'Networking', 'Training', 'Career Fair')),
  event_type TEXT CHECK (event_type IN ('full-day', 'half-day', 'evening', 'webinar')),
  capacity INTEGER,
  registered INTEGER DEFAULT 0,
  organizer TEXT,
  highlights TEXT[],
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past', 'cancelled')),
  -- Past event fields
  is_past BOOLEAN DEFAULT false,
  actual_attendance INTEGER,
  recording_url TEXT,
  summary TEXT,
  feedback_rating NUMERIC(3,1),
  speakers TEXT[],
  topics TEXT[],
  outcomes TEXT[],
  photo_gallery TEXT[],
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events are viewable by everyone." ON public.events;
CREATE POLICY "Events are viewable by everyone." ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert events." ON public.events;
CREATE POLICY "Admins can insert events." ON public.events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can update events." ON public.events;
CREATE POLICY "Admins can update events." ON public.events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can delete events." ON public.events;
CREATE POLICY "Admins can delete events." ON public.events FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 6. RESOURCES (Downloadable Files)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  uploaded_by UUID REFERENCES public.profiles(id),
  category TEXT,
  type TEXT,
  description TEXT,
  external_url TEXT,
  downloads INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Resources are viewable by everyone." ON public.resources;
CREATE POLICY "Resources are viewable by everyone." ON public.resources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert resources." ON public.resources;
CREATE POLICY "Admins can insert resources." ON public.resources FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can update resources." ON public.resources;
CREATE POLICY "Admins can update resources." ON public.resources FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can delete resources." ON public.resources;
CREATE POLICY "Admins can delete resources." ON public.resources FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 7. VIDEOS (Career Tutorial Videos)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration TEXT,
  speaker TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Videos are viewable by everyone." ON public.videos;
CREATE POLICY "Videos are viewable by everyone." ON public.videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert videos." ON public.videos;
CREATE POLICY "Admins can insert videos." ON public.videos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can update videos." ON public.videos;
CREATE POLICY "Admins can update videos." ON public.videos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can delete videos." ON public.videos;
CREATE POLICY "Admins can delete videos." ON public.videos FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 8. RUN-LAS FORMS (SIWES / Industrial Training)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.runlas_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  student_name TEXT,
  student_id_number TEXT,        -- e.g. "CMS/2023/001"
  department TEXT,
  supervisor TEXT,
  organization TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  remarks TEXT,
  form_data JSONB,               -- flexible extra data
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.runlas_forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own RUN-LAS forms." ON public.runlas_forms;
CREATE POLICY "Users can see own RUN-LAS forms." ON public.runlas_forms FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Users can insert own RUN-LAS forms." ON public.runlas_forms;
CREATE POLICY "Users can insert own RUN-LAS forms." ON public.runlas_forms FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins can update RUN-LAS forms." ON public.runlas_forms;
CREATE POLICY "Admins can update RUN-LAS forms." ON public.runlas_forms FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 9. CV TEMPLATES (Optional — for CV Builder feature)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cv_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  style TEXT CHECK (style IN ('modern', 'minimal', 'academic', 'corporate')),
  thumbnail TEXT,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.cv_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "CV templates are viewable by everyone." ON public.cv_templates;
CREATE POLICY "CV templates are viewable by everyone." ON public.cv_templates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage CV templates." ON public.cv_templates;
CREATE POLICY "Admins can manage CV templates." ON public.cv_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 10. TRIGGERS (Auto-Claim Bookings)
-- ============================================================
-- When a user signs up (inserted into profiles), link any existing bookings matching their email
CREATE OR REPLACE FUNCTION public.claim_guest_bookings()
RETURNS trigger AS $$
BEGIN
  UPDATE public.bookings
  SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;
  
  UPDATE public.notifications
  SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_claim_bookings ON public.profiles;
CREATE TRIGGER on_profile_created_claim_bookings
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.claim_guest_bookings();

-- ============================================================
-- 11. RPC FUNCTIONS
-- ============================================================
-- Increment resource download count
CREATE OR REPLACE FUNCTION public.increment_downloads(resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.resources
  SET downloads = downloads + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- DONE. Your full schema is now active.
-- ============================================================

