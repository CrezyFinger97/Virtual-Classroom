-- Updated to work with consolidated schema

-- Insert teacher account
INSERT INTO users (email, password, role, name) 
VALUES ('shouryagupta180@gmail.com', '123456', 'teacher', 'Shourya Gupta')
ON CONFLICT (email) DO NOTHING;

-- Insert subjects
INSERT INTO subjects (name, code) VALUES 
  ('Maths', 'MATH101'),
  ('APP', 'APP101'),
  ('COA', 'COA101'),
  ('DSA', 'DSA101')
ON CONFLICT (code) DO NOTHING;

-- Insert sample students
INSERT INTO users (email, password, role, name) VALUES
  ('student1@gmail.com', 'pass123', 'student', 'Alice Smith'),
  ('student2@gmail.com', 'pass123', 'student', 'Bob Johnson'),
  ('student3@gmail.com', 'pass123', 'student', 'Carol White'),
  ('student4@gmail.com', 'pass123', 'student', 'David Brown'),
  ('student5@gmail.com', 'pass123', 'student', 'Emma Davis')
ON CONFLICT (email) DO NOTHING;

-- Link students to students table
INSERT INTO students (user_id, name, email)
SELECT id, name, email FROM users WHERE role = 'student'
ON CONFLICT (email) DO NOTHING;

-- Insert sample marks
INSERT INTO marks (student_id, subject_id, exam_type, score)
SELECT s.id, sub.id, 'Midterm', FLOOR(RANDOM() * 40 + 60)::INTEGER
FROM students s, subjects sub
WHERE NOT EXISTS (
  SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id
);

-- Insert sample attendance
INSERT INTO attendance (student_id, subject_id, total_classes, attended_classes)
SELECT s.id, sub.id, 45, FLOOR(RANDOM() * 10 + 35)::INTEGER
FROM students s, subjects sub
WHERE NOT EXISTS (
  SELECT 1 FROM attendance a WHERE a.student_id = s.id AND a.subject_id = sub.id
);
