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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 2. OPPORTUNITIES (Jobs, Internships, Scholarships)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('job', 'internship', 'scholarship')),
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  posted_by UUID REFERENCES public.profiles(id),
  posted_by_name TEXT,           -- display name (company/org)
  location TEXT,                 -- e.g. "Lagos", "Remote"
  requirements TEXT[],           -- array of requirement strings
  eligibility TEXT[],            -- array of eligibility strings
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
-- 3. APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected')),
  submission_text TEXT,
  cv_file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Employers see applications for their ops." ON public.applications;
CREATE POLICY "Employers see applications for their ops." ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.posted_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
  applicant_id = auth.uid()
);
DROP POLICY IF EXISTS "Students can self apply." ON public.applications;
CREATE POLICY "Students can self apply." ON public.applications FOR INSERT WITH CHECK (applicant_id = auth.uid());
DROP POLICY IF EXISTS "Employers can update status." ON public.applications;
CREATE POLICY "Employers can update status." ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.posted_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 4. BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  name TEXT,                     -- contact name
  email TEXT,                    -- contact email
  phone TEXT,                    -- contact phone
  date DATE,                     -- requested date
  type TEXT NOT NULL,
  purpose TEXT,                  -- reason for booking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own, admin can see all." ON public.bookings;
CREATE POLICY "Users can see own, admin can see all." ON public.bookings FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Users can insert." ON public.bookings;
CREATE POLICY "Users can insert." ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins can update." ON public.bookings;
CREATE POLICY "Admins can update." ON public.bookings FOR UPDATE USING (
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
-- DONE. Your full schema is now active.
-- ============================================================
