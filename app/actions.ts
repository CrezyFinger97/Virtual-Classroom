"use server"

import { createClient } from "@/lib/supabase/server"

// User Actions
export async function signUpUser(email: string, password: string, name: string, role: "teacher" | "student") {
  const supabase = await createClient()

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
      data: { role, name },
    },
  })

  if (authError) return { error: authError.message }

  // Create user record in users table
  if (authData.user) {
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      name,
      role,
    })

    if (userError) return { error: userError.message }

    // If student, also create student record
    if (role === "student") {
      const { error: studentError } = await supabase.from("students").insert({
        user_id: authData.user.id,
        email,
        name,
      })

      if (studentError) return { error: studentError.message }
    }
  }

  return { success: true, user: authData.user }
}

export async function loginUser(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  return { success: true, user: data.user }
}

export async function getUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) return { error: error.message }

  return { user: data.user }
}

// Student Actions
export async function addStudent(name: string, email: string, password: string) {
  const supabase = await createClient()

  // Sign up student
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: "student", name },
    },
  })

  if (authError) return { error: authError.message }

  if (authData.user) {
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      name,
      role: "student",
    })

    if (userError) return { error: userError.message }

    const { error: studentError } = await supabase.from("students").insert({
      user_id: authData.user.id,
      email,
      name,
    })

    if (studentError) return { error: studentError.message }
  }

  return { success: true }
}

export async function getStudents() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("students").select("*")

  if (error) return { error: error.message }

  return { students: data }
}

export async function deleteStudent(studentId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("students").delete().eq("user_id", studentId)

  if (error) return { error: error.message }

  return { success: true }
}

// Marks Actions
export async function updateMarks(studentId: string, subject: string, marks: number) {
  const supabase = await createClient()

  const { data: existingMarks } = await supabase
    .from("marks")
    .select("id")
    .eq("student_id", studentId)
    .eq("subject_id", subject)
    .single()

  if (existingMarks) {
    const { error } = await supabase.from("marks").update({ marks_obtained: marks }).eq("id", existingMarks.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("marks").insert({
      student_id: studentId,
      subject_id: subject,
      marks_obtained: marks,
      total_marks: 100,
      exam_type: "exam",
    })

    if (error) return { error: error.message }
  }

  return { success: true }
}

export async function getStudentMarks(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("marks").select("*").eq("student_id", studentId)

  if (error) return { error: error.message }

  return { marks: data }
}

// Attendance Actions
export async function updateAttendance(studentId: string, subject: string, attended: number, total: number) {
  const supabase = await createClient()

  const { data: existingAttendance } = await supabase
    .from("attendance")
    .select("id")
    .eq("student_id", studentId)
    .eq("subject_id", subject)
    .single()

  if (existingAttendance) {
    const { error } = await supabase
      .from("attendance")
      .update({ attended_classes: attended, total_classes: total })
      .eq("id", existingAttendance.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("attendance").insert({
      student_id: studentId,
      subject_id: subject,
      attended_classes: attended,
      total_classes: total,
    })

    if (error) return { error: error.message }
  }

  return { success: true }
}

export async function getStudentAttendance(studentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("attendance").select("*").eq("student_id", studentId)

  if (error) return { error: error.message }

  return { attendance: data }
}

// Timetable Actions
export async function addTimetableSlot(
  day: string,
  startTime: string,
  endTime: string,
  subjectId: string,
  teacherId: string,
  roomNumber: string,
) {
  const supabase = await createClient()

  const { error } = await supabase.from("timetable").insert({
    day_of_week: day,
    start_time: startTime,
    end_time: endTime,
    subject_id: subjectId,
    teacher_id: teacherId,
    room_number: roomNumber,
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function getTimetable(teacherId?: string) {
  const supabase = await createClient()

  let query = supabase.from("timetable").select("*")

  if (teacherId) {
    query = query.eq("teacher_id", teacherId)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { timetable: data }
}

export async function deleteTimetableSlot(slotId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("timetable").delete().eq("id", slotId)

  if (error) return { error: error.message }

  return { success: true }
}

// Assignment Actions
export async function createAssignment(title: string, subjectId: string, dueDate: string, createdBy: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("assignments").insert({
    title,
    subject_id: subjectId,
    due_date: dueDate,
    created_by: createdBy,
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function getAssignments(subjectId?: string) {
  const supabase = await createClient()

  let query = supabase.from("assignments").select("*")

  if (subjectId) {
    query = query.eq("subject_id", subjectId)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { assignments: data }
}

// Resource Actions
export async function uploadResource(
  title: string,
  subjectId: string,
  fileName: string,
  fileUrl: string,
  uploadedBy: string,
) {
  const supabase = await createClient()

  const { error } = await supabase.from("resources").insert({
    title,
    subject_id: subjectId,
    file_name: fileName,
    file_url: fileUrl,
    uploaded_by: uploadedBy,
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function getResources(subjectId?: string) {
  const supabase = await createClient()

  let query = supabase.from("resources").select("*")

  if (subjectId) {
    query = query.eq("subject_id", subjectId)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { resources: data }
}

// Meet Link Actions
export async function createMeetLink(subjectId: string, meetLink: string, teacherId: string, scheduledTime: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("meet_links").insert({
    subject_id: subjectId,
    meet_link: meetLink,
    teacher_id: teacherId,
    scheduled_time: scheduledTime,
    status: "live",
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function getMeetLinks(subjectId?: string) {
  const supabase = await createClient()

  let query = supabase.from("meet_links").select("*")

  if (subjectId) {
    query = query.eq("subject_id", subjectId)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { meetLinks: data }
}
