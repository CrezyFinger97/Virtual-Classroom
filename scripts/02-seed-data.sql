-- Insert subjects
INSERT INTO subjects (name, code) VALUES
('Maths', 'MATH'),
('APP', 'APP'),
('COA', 'COA'),
('DSA', 'DSA')
ON CONFLICT (code) DO NOTHING;

-- Insert teacher user
INSERT INTO users (email, password_hash, role, name) VALUES
('teacher@gmail.com', 'hashed_password_123', 'teacher', 'Dr. Rao')
ON CONFLICT (email) DO NOTHING;

-- Insert 10 student users
INSERT INTO users (email, password_hash, role, name) VALUES
('aarav@gmail.com', 'hashed_password_123', 'student', 'Aarav Sharma'),
('priya@gmail.com', 'hashed_password_123', 'student', 'Priya Verma'),
('rohan@gmail.com', 'hashed_password_123', 'student', 'Rohan Singh'),
('ananya@gmail.com', 'hashed_password_123', 'student', 'Ananya Patel'),
('arjun@gmail.com', 'hashed_password_123', 'student', 'Arjun Kumar'),
('neha@gmail.com', 'hashed_password_123', 'student', 'Neha Gupta'),
('vikram@gmail.com', 'hashed_password_123', 'student', 'Vikram Reddy'),
('divya@gmail.com', 'hashed_password_123', 'student', 'Divya Nair'),
('aditya@gmail.com', 'hashed_password_123', 'student', 'Aditya Joshi'),
('sara@gmail.com', 'hashed_password_123', 'student', 'Sara Khan')
ON CONFLICT (email) DO NOTHING;

-- Insert students (linking to users)
INSERT INTO students (user_id, name, email) 
SELECT id, name, email FROM users WHERE role = 'student'
ON CONFLICT DO NOTHING;

-- Insert marks for each student and subject
INSERT INTO marks (student_id, subject_id, marks_obtained, exam_type)
SELECT s.id, sub.id, FLOOR(RANDOM() * 40 + 60)::DECIMAL, 'Mid-term'
FROM students s, subjects sub
ON CONFLICT DO NOTHING;

INSERT INTO marks (student_id, subject_id, marks_obtained, exam_type)
SELECT s.id, sub.id, FLOOR(RANDOM() * 40 + 60)::DECIMAL, 'Assignment'
FROM students s, subjects sub
ON CONFLICT DO NOTHING;

-- Insert attendance for each student and subject
INSERT INTO attendance (student_id, subject_id, total_classes, attended_classes)
SELECT s.id, sub.id, 45, FLOOR(RANDOM() * 15 + 30)::INT
FROM students s, subjects sub
ON CONFLICT DO NOTHING;
