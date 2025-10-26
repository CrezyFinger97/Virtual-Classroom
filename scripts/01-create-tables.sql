-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Insert subjects
INSERT INTO subjects (id, name) VALUES 
  ('maths', 'Maths'),
  ('app', 'APP'),
  ('coa', 'COA'),
  ('dsa', 'DSA')
ON CONFLICT DO NOTHING;

-- Create marks table
CREATE TABLE IF NOT EXISTS marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  marks_value INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  attended INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  due_date TEXT NOT NULL,
  attachment_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  file_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create meet_links table
CREATE TABLE IF NOT EXISTS meet_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  meet_link TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create timetable table
CREATE TABLE IF NOT EXISTS timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  teacher_name TEXT NOT NULL,
  room TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
