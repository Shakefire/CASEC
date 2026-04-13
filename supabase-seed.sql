-- ============================================================
-- CASEC Career Portal — Seed Data
-- Run this AFTER supabase-schema.sql
-- Populates tables with demo content
-- ============================================================

-- ============================================================
-- SEED: OPPORTUNITIES
-- ============================================================
INSERT INTO public.opportunities (id, title, description, type, deadline, status, posted_by_name, location, requirements, eligibility, verified, created_at) VALUES
  (gen_random_uuid(), 'Graduate Software Engineer', 'Join our engineering team as a graduate software engineer. You will work on scalable systems and contribute to product development.', 'job', '2025-08-15', 'active', 'Andela', 'Lagos', ARRAY['Bachelor''s in Computer Science', '2+ years experience', 'Proficiency in Python/Java'], ARRAY['All graduates', 'Recent graduates preferred'], true, '2025-06-01'),
  (gen_random_uuid(), 'MTN Nigeria Scholarship 2025', 'Full scholarship covering tuition and stipend for final-year students in STEM disciplines.', 'scholarship', '2025-07-30', 'active', 'MTN Nigeria', 'Nigeria', ARRAY['Final year students', 'STEM disciplines only', 'Minimum 3.5 CGPA'], ARRAY['Final year students', 'STEM fields', 'Nigerian citizens'], true, '2025-05-20'),
  (gen_random_uuid(), 'Summer Internship – Finance Analyst', '3-month summer internship at a leading Lagos investment bank. Open to 300-level and above.', 'internship', '2025-07-01', 'active', 'Zenith Bank', 'Lagos', ARRAY['Strong analytical skills', 'Excel proficiency', 'Finance background'], ARRAY['300-level and above', 'All disciplines', 'Nigerian students'], true, '2025-05-15'),
  (gen_random_uuid(), 'Marketing Associate', 'Full-time marketing associate role for a consumer goods company in Ibadan.', 'job', '2025-06-30', 'closed', 'Nestlé Nigeria', 'Ibadan', ARRAY['Marketing background', 'Digital marketing skills', 'Strong communication'], ARRAY['All graduates', 'Must be in Nigeria'], true, '2025-04-10'),
  (gen_random_uuid(), 'Access Bank Graduate Trainee Programme', 'Competitive graduate trainee programme for fresh graduates across all disciplines.', 'job', '2025-09-01', 'active', 'Access Bank', 'Lagos, Abuja, Remote', ARRAY['Any undergraduate degree', 'Excellent academic record', 'Leadership potential'], ARRAY['Fresh graduates only', 'Must be under 28 years', 'All disciplines'], true, '2025-06-10'),
  (gen_random_uuid(), 'Shell Nigeria STEM Scholarship', 'Scholarship for exceptional students in Engineering and Sciences.', 'scholarship', '2025-08-01', 'active', 'Shell Nigeria', 'Nigeria', ARRAY['STEM disciplines only', 'Minimum 3.7 CGPA', 'Leadership experience'], ARRAY['All year students', 'Physics, Chemistry, Engineering', 'Nigerian students'], true, '2025-06-05')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: EVENTS (Upcoming)
-- ============================================================
INSERT INTO public.events (id, title, description, date, location, category, event_type, capacity, registered, organizer, highlights, status, is_past, created_at) VALUES
  (gen_random_uuid(), 'Career Fair 2025', 'Annual career fair bringing together top employers and graduating students across departments.', '2025-07-20', 'RUN Main Hall, Ede', 'Networking', 'full-day', 500, 287, 'Career Services Centre', ARRAY['50+ top employers', 'Live recruitment', 'Free refreshments', 'Career counseling booths'], 'upcoming', false, '2025-05-01'),
  (gen_random_uuid(), 'CV Writing & Interview Skills Workshop', 'Hands-on workshop to help students craft compelling CVs and ace job interviews.', '2025-07-05', 'Senate Building, Room 101', 'Workshop', 'half-day', 80, 72, 'Career Services Centre', ARRAY['Expert facilitators', 'One-on-one feedback', 'Mock interviews', 'Free CV review'], 'upcoming', false, '2025-05-15'),
  (gen_random_uuid(), 'Entrepreneurship Bootcamp', 'Three-day bootcamp on business ideation, pitching, and startup fundamentals.', '2025-08-10', 'Business School Annex', 'Training', 'full-day', 100, 64, 'Business School & CASEC', ARRAY['Mentorship sessions', 'Pitch competition', 'Networking', 'Startup resources'], 'upcoming', false, '2025-06-01'),
  (gen_random_uuid(), 'Networking Night – Alumni Connect', 'Evening networking event connecting current students with RUN alumni in various industries.', '2025-08-22', 'RUN Guest House Hall', 'Networking', 'evening', 200, 143, 'Career Services Centre & Alumni Relations', ARRAY['Alumni as mentors', 'B2B connections', 'Career advice', 'Social networking'], 'upcoming', false, '2025-06-08')
ON CONFLICT DO NOTHING;

-- SEED: EVENTS (Past)
INSERT INTO public.events (id, title, description, date, location, category, event_type, capacity, registered, organizer, highlights, status, is_past, actual_attendance, feedback_rating, speakers, topics, outcomes, recording_url, summary, created_at) VALUES
  (gen_random_uuid(), 'Career Fair 2024', 'Annual career fair bringing together top employers and graduating students across departments.', '2024-07-18', 'RUN Main Hall, Ede', 'Networking', 'full-day', 450, 428, 'Career Services Centre', ARRAY['45+ employers', '350+ job offers', '15 instant hires'], 'past', true, 412, 4.7, ARRAY['Prof. Ade Okunowo (CASEC)', 'Mr. Tunde Okeremi (Andela)', 'Ms. Chioma Ojiako (MTN Nigeria)'], ARRAY['Career pathways', 'Industry trends', 'Recruitment best practices', 'Entrepreneurship'], ARRAY['412 attendees', '350+ job offers extended', '15 instant employment offers', 'Partnerships with 45+ companies'], 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'The 2024 Career Fair was our most successful yet, attracting over 400 students and 45 leading companies.', '2024-05-01'),
  (gen_random_uuid(), 'LinkedIn Masterclass Workshop', 'Interactive workshop on optimizing LinkedIn profiles and leveraging the platform for career growth.', '2024-06-15', 'ICT Building, Room 205', 'Workshop', 'half-day', 60, 58, 'Career Services Centre', ARRAY['LinkedIn experts', 'Profile optimization', 'Networking strategies'], 'past', true, 54, 4.5, ARRAY['Ms. Omotoke Abadi (LinkedIn Nigeria)', 'Mr. Oluwaseun Adeyemi (Tech Recruiter)'], ARRAY['Profile optimization', 'Personal branding', 'Network building', 'Job search strategies'], ARRAY['54 participants graduated', '100+ profile improvements', 'Networking connections made'], 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'An insightful session teaching students how to create compelling LinkedIn profiles.', '2024-04-20'),
  (gen_random_uuid(), 'Mock Interview Series 2024', 'Comprehensive mock interview program with feedback from experienced HR professionals.', '2024-05-22', 'Conference Room A & B', 'Training', 'half-day', 120, 112, 'CASEC & HR Partners', ARRAY['1:1 interviews', 'Expert feedback', 'Industry recruiters'], 'past', true, 108, 4.8, ARRAY['10+ Senior HR Professionals'], ARRAY['Interview techniques', 'Behavioral questions', 'Technical interviews', 'Q&A strategies'], ARRAY['108 mock interviews conducted', '98% felt more confident', '42 advanced to real interviews'], 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Intensive mock interview program where students practiced with real HR professionals.', '2024-03-15')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: RESOURCES
-- ============================================================
INSERT INTO public.resources (id, title, description, file_name, file_size, category, type, downloads, featured, uploaded_at) VALUES
  (gen_random_uuid(), 'CV Writing Guide 2025', 'Comprehensive guide on crafting an effective CV that stands out to employers', 'cv-writing-guide-2025.pdf', '1.2 MB', 'CV', 'PDF', 2341, true, '2025-05-10'),
  (gen_random_uuid(), 'Interview Preparation Handbook', 'Master interview techniques with real examples and practice questions', 'interview-prep-handbook.pdf', '2.4 MB', 'Interview', 'PDF', 1856, true, '2025-05-12'),
  (gen_random_uuid(), 'SIWES Student Guide', 'Complete guide for industrial training students', 'siwes-student-guide.pdf', '890 KB', 'Internship', 'PDF', 1543, false, '2025-04-25'),
  (gen_random_uuid(), 'Graduate Job Search Strategies', 'Strategic approaches to finding and landing your first graduate role', 'grad-job-search-strategies.pdf', '1.7 MB', 'Career', 'PDF', 1127, true, '2025-06-01'),
  (gen_random_uuid(), 'Professional Email & Communication Guide', 'How to write professional emails and communicate effectively in the workplace', 'professional-communication-guide.pdf', '560 KB', 'Soft Skills', 'PDF', 892, false, '2025-06-05'),
  (gen_random_uuid(), 'Cover Letter Templates & Examples', 'Ready-to-use cover letter templates for different job types and industries', 'cover-letter-templates.pdf', '1.1 MB', 'CV', 'PDF', 1634, false, '2025-05-20'),
  (gen_random_uuid(), 'Scholarship Application Guide', 'Step-by-step guide to applying for scholarships and maximizing your chances', 'scholarship-guide.pdf', '1.5 MB', 'Scholarship', 'PDF', 2103, true, '2025-04-30'),
  (gen_random_uuid(), 'Time Management for Students', 'Practical time management techniques to balance studies and career prep', 'time-management.pdf', '845 KB', 'Soft Skills', 'PDF', 743, false, '2025-05-15')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: VIDEOS
-- ============================================================
INSERT INTO public.videos (id, title, description, category, duration, speaker, thumbnail_url, video_url, views, featured, uploaded_at) VALUES
  (gen_random_uuid(), 'How to Write a Compelling CV in 2025', 'Expert tips on creating a CV that gets you interviews.', 'CV', '12:34', 'Ms. Omotoke Abadi', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 3421, true, '2025-06-01'),
  (gen_random_uuid(), 'Mastering the Job Interview - Complete Guide', 'Learn interview strategies, how to answer tough questions, and impress hiring managers.', 'Interview', '18:45', 'Mr. Chinedu Okafor', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2834, true, '2025-05-28'),
  (gen_random_uuid(), 'LinkedIn Profile Optimization Tutorial', 'Turn your LinkedIn into a job search powerhouse.', 'LinkedIn', '15:20', 'Ms. Ada Okafor', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 4156, true, '2025-05-15'),
  (gen_random_uuid(), 'Scholarship Application Tips & Tricks', 'Insider tips on how to stand out in scholarship applications.', 'Scholarship', '9:50', 'Prof. Ade Okunowo', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1523, false, '2025-06-05'),
  (gen_random_uuid(), 'Salary Negotiation 101', 'How to negotiate your first salary and get what you deserve.', 'Career Skills', '11:30', 'Mr. Emeka Uche', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2341, false, '2025-04-20'),
  (gen_random_uuid(), 'Tech Interview Prep - Coding Challenges', 'Prepare for technical interviews in software development roles.', 'Interview', '22:15', 'Mr. David Chen', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1876, false, '2025-05-10')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: CV TEMPLATES
-- ============================================================
INSERT INTO public.cv_templates (id, name, description, style) VALUES
  (gen_random_uuid(), 'Modern CV', 'Clean, contemporary design perfect for tech and creative industries', 'modern'),
  (gen_random_uuid(), 'Minimal CV', 'Elegant and simple design that focuses on content', 'minimal'),
  (gen_random_uuid(), 'Academic CV', 'Traditional design ideal for academic and research positions', 'academic'),
  (gen_random_uuid(), 'Corporate CV', 'Professional design for corporate and financial roles', 'corporate')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE. Database is now seeded with demo content.
-- ============================================================
