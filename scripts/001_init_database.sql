-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create timetable table
CREATE TABLE IF NOT EXISTS public.timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create marks table
CREATE TABLE IF NOT EXISTS public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(5,2),
  total_marks NUMERIC(5,2),
  exam_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  attended_classes INTEGER DEFAULT 0,
  total_classes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  due_date TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  attachment_url VARCHAR(500),
  attachment_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create meet_links table
CREATE TABLE IF NOT EXISTS public.meet_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meet_link VARCHAR(500) NOT NULL,
  scheduled_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meet_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for students table (teachers can view all, students can view own)
CREATE POLICY "Students can view their own data" ON public.students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all students" ON public.students FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- RLS Policies for timetable (everyone can view, teachers can manage)
CREATE POLICY "Everyone can view timetable" ON public.timetable FOR SELECT USING (true);
CREATE POLICY "Teachers can manage their timetable" ON public.timetable FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update their timetable" ON public.timetable FOR UPDATE USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can delete their timetable" ON public.timetable FOR DELETE USING (auth.uid() = teacher_id);

-- RLS Policies for marks (students can view own, teachers can manage)
CREATE POLICY "Students can view their own marks" ON public.marks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Teachers can view all marks" ON public.marks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers can insert marks" ON public.marks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers can update marks" ON public.marks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- RLS Policies for attendance (similar to marks)
CREATE POLICY "Students can view their own attendance" ON public.attendance FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Teachers can view all attendance" ON public.attendance FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers can manage attendance" ON public.attendance FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers can update attendance" ON public.attendance FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- RLS Policies for assignments
CREATE POLICY "Everyone can view assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can create assignments" ON public.assignments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- RLS Policies for resources
CREATE POLICY "Everyone can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Teachers can upload resources" ON public.resources FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- RLS Policies for meet_links
CREATE POLICY "Everyone can view meet links" ON public.meet_links FOR SELECT USING (true);
CREATE POLICY "Teachers can create meet links" ON public.meet_links FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- Insert sample subjects
INSERT INTO public.subjects (name, code) VALUES
  ('Mathematics', 'MATH'),
  ('Advanced Programming', 'APP'),
  ('Computer Organization', 'COA'),
  ('Data Structures', 'DSA')
ON CONFLICT (code) DO NOTHING;
