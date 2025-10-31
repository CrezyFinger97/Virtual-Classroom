"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/supabaseClient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Menu,
  X,
  LogOut,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  FileText,
  Video,
  Clock,
  Home,
} from "lucide-react"


// ✅ All type definitions and mock data stay here:
type Subject = "Maths" | "APP" | "COA" | "DSA"

type User = {
  id: string
  email: string
  password: string
  role: "teacher" | "student"
  name: string
}

type Student = {
  id: string
  name: string
  email: string
  marks: Record<Subject, number> | null
  attendance: Record<Subject, { total: number; attended: number }> | null
}

type Assignment = {
  id: string
  title: string
  subject: Subject
  due_date: string
  attachment_name?: string
}

type Resource = {
  id: string
  title: string
  subject: Subject
  file_name?: string
}

type MeetLink = {
  id: string
  subject: Subject
  teacher: string
  time: string
  link: string
  status: "live" | "upcoming" | "scheduled"
}

type TimetableSlot = {
  id: string
  day: string
  time: string
  subject: Subject
  teacher?: string
  room?: string
}


// ✅ From here on, everything must be **inside the com**
export default function VirtualClassroomApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<"student" | "teacher" | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  // 🧭 track which page user is viewing
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [meetLinks, setMeetLinks] = useState<MeetLink[]>([])
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subject: "",
    dueDate: "",
    attachmentName: "",
  })
  const [resourceForm, setResourceForm] = useState({
    title: "",
    subject: "",
    fileName: "",
  })


  
  const [users, setUsers] = useState<User[]>([])

  const [signupRole, setSignupRole] = useState<"student" | "teacher" | null>(null)
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const handleLogin = async () => {
  setLoginError(null)
  console.log("Attempting login with:", loginEmail.trim(), loginPassword.trim())

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .ilike("email", loginEmail.trim())
    .eq("password", loginPassword.trim())
    .maybeSingle()

  if (error || !data) {
    console.error("Login error:", error)
    setLoginError("Invalid email or password.")
    return
  }

  setRole(data.role)
  setCurrentUser(data)
  setIsLoggedIn(true)
  console.log("✅ Logged in as:", data.role)
  }
  const [signupError, setSignupError] = useState<string | null>(null)


  const [isSigningUp, setIsSigningUp] = useState(false)

  const [students, setStudents] = useState<Student[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [meets, setMeets] = useState<MeetLink[]>([])
  const [timetable, setTimetable] = useState<TimetableSlot[]>([])

  const [loadingStudents, setLoadingStudents] = useState(true)
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [loadingResources, setLoadingResources] = useState(true)
  const [loadingMeets, setLoadingMeets] = useState(true)
  const [loadingTimetable, setLoadingTimetable] = useState(true)

// Fetch all tables
useEffect(() => {
  const fetchAll = async () => {
    try {
      setLoadingStudents(true);
      setLoadingAssignments(true);
      setLoadingResources(true);
      setLoadingMeets(true);
      setLoadingTimetable(true);

      // 🧩 Parallel fetching for all tables
      const [
        { data: sData, error: sError },
        { data: aData, error: aError },
        { data: rData, error: rError },
        { data: mData, error: mError },
        { data: tData, error: tError },
      ] = await Promise.all([
        supabase.from("students").select("*"),
        supabase.from("assignments").select("*"),
        supabase.from("resources").select("*"),
        supabase.from("meets").select("*"),
        supabase.from("timetable").select("*"),
      ]);

      // ✅ Students
      if (sError) console.error("❌ Error fetching students:", sError);
      else {
        console.log("✅ Students fetched:", sData);
        setStudents(sData || []);
      }
      setLoadingStudents(false);

      // ✅ Assignments
      if (aError) console.error("❌ Error fetching assignments:", aError);
      else setAssignments(aData || []);
      setLoadingAssignments(false);

      // ✅ Resources
      if (rError) console.error("❌ Error fetching resources:", rError);
      else setResources(rData || []);
      setLoadingResources(false);

      // ✅ Meets
      if (mError) console.error("❌ Error fetching meets:", mError);
      else setMeets(mData || []);
      setLoadingMeets(false);

      // ✅ Timetable
      if (tError) console.error("❌ Error fetching timetable:", tError);
      else setTimetable(tData || []);
      setLoadingTimetable(false);

    } catch (err) {
      console.error("⚠️ Unexpected fetch error:", err);
      setLoadingStudents(false);
      setLoadingAssignments(false);
      setLoadingResources(false);
      setLoadingMeets(false);
      setLoadingTimetable(false);
    }
  };

  fetchAll();
}, []);











const initialAssignments: Assignment[] = []
const initialResources: Resource[] = []
const initialMeetLinks: MeetLink[] = []
const initialTimetable: TimetableDay[] = [
  {
    day: "Monday",
    slots: [
      { time: "9:00 - 10:00", subject: "Maths", teacher: "Dr. Rao", room: "A-101" },
      { time: "10:15 - 11:15", subject: "APP", teacher: "Prof. Kumar", room: "B-202" },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { time: "9:00 - 10:00", subject: "COA", teacher: "Dr. Singh", room: "C-303" },
      { time: "10:15 - 11:15", subject: "DSA", teacher: "Prof. Patel", room: "D-404" },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { time: "9:00 - 10:00", subject: "Maths", teacher: "Dr. Rao", room: "A-101" },
      { time: "10:15 - 11:15", subject: "APP", teacher: "Prof. Kumar", room: "B-202" },
    ],
  },
  {
    day: "Thursday",
    slots: [
      { time: "9:00 - 10:00", subject: "COA", teacher: "Dr. Singh", room: "C-303" },
      { time: "10:15 - 11:15", subject: "DSA", teacher: "Prof. Patel", room: "D-404" },
    ],
  },
  {
    day: "Friday",
    slots: [
      { time: "9:00 - 10:00", subject: "Maths", teacher: "Dr. Rao", room: "A-101" },
      { time: "10:15 - 11:15", subject: "APP", teacher: "Prof. Kumar", room: "B-202" },
    ],
  }
]

  // Timetable slots
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([
    { id: "1", day: "Monday", time: "9:00 - 10:00", subject: "Maths", room: "A-101" },
    { id: "2", day: "Monday", time: "10:15 - 11:15", subject: "APP", room: "B-202" },
    { id: "3", day: "Tuesday", time: "9:00 - 10:00", subject: "COA", room: "C-303" },
    { id: "4", day: "Tuesday", time: "10:15 - 11:15", subject: "DSA", room: "D-404" },
  ])

  const [newTimetableForm, setNewTimetableForm] = useState({
    day: "Monday",
    time: "",
    subject: "Maths" as Subject,
    room: "",
  })

  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)

  const [newStudentEmail, setNewStudentEmail] = useState("")
  const [newStudentPassword, setNewStudentPassword] = useState("")
  const [newStudentName, setNewStudentName] = useState("")

  const [updateMarksForm, setUpdateMarksForm] = useState({
    studentId: "",
    subject: "Maths" as Subject,
    marks: 0,
  })

  const [updateAttendanceForm, setUpdateAttendanceForm] = useState({
    studentId: "",
    subject: "Maths" as Subject,
    attended: 0,
    total: 0,
  })

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const canLogin = /@gmail\.com$/i.test(email.trim()) && password.trim().length >= 6

  const canSignup =
    signupRole &&
    signupForm.email.trim().length > 0 &&
    signupForm.password.trim().length >= 6 &&
    signupForm.password === signupForm.confirmPassword &&
    signupForm.name.trim().length > 0

    
  console.log("Attempting login with:", email.trim(), password.trim())
// ✅ SIGNUP FUNCTION
const handleSignup = async () => {
  console.log("Signup Debug →", {
    signupForm,
    signupRole,
    canSignup,
    emailValid: /@gmail\.com$/i.test(signupForm.email.trim()),
    passwordMatch: signupForm.password === signupForm.confirmPassword,
  });

  if (!canSignup) {
    setSignupError("Please fill all fields correctly. Passwords must match.");
    return;
  }

  try {
    // ✅ 1. Check if email already exists in 'users'
    const { data: existingUsers, error: existingError } = await supabase
      .from("users")
      .select("email")
      .eq("email", signupForm.email.trim());

    if (existingError) {
      console.error("❌ Error checking existing user:", existingError);
      setSignupError("Something went wrong. Please try again.");
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      setSignupError("This email is already registered.");
      return;
    }

    // ✅ 2. Insert user into 'users'
    const { data: insertedUser, error: userError } = await supabase
      .from("users")
      .insert([
        {
          name: signupForm.name.trim(),
          email: signupForm.email.trim(),
          password: signupForm.password.trim(),
          role: signupRole,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (userError || !insertedUser) {
      console.error("❌ Error inserting user:", userError);
      setSignupError("Failed to create user.");
      return;
    }

    console.log("✅ User inserted into 'users':", insertedUser);

    // ✅ 3. Always add to 'students' if role === 'student'
    if (signupRole === "student") {
  console.log("🟡 Attempting to insert student record for:", insertedUser);

  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .insert([
      {
        user_id: insertedUser.id,
        name: insertedUser.name,
        email: insertedUser.email,
        marks: { Maths: 0, APP: 0, COA: 0, DSA: 0 },
        attendance: {
          Maths: { attended: 0, total: 0 },
          APP: { attended: 0, total: 0 },
          COA: { attended: 0, total: 0 },
          DSA: { attended: 0, total: 0 },
        },
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  console.log("🧾 Student insert result:", { studentData, studentError });

  if (studentError) {
    console.error("❌ Error inserting into 'students':", studentError.message);
  } else {
    console.log("✅ Student successfully inserted:", studentData);
  }
}


    alert("✅ Account created successfully! Please login.");
    setSignupForm({ name: "", email: "", password: "", confirmPassword: "" });
    setSignupRole(null);
    setIsSigningUp(false);
  } catch (err) {
    console.error("⚠️ Unexpected signup error:", err);
    setSignupError("Something went wrong during signup.");
  }
};






  const handleLogout = () => {
    setIsLoggedIn(false)
    setRole(null)
    setCurrentUser(null)
    setCurrentPage("dashboard")
    setEmail("")
    setPassword("")
    setLoginError(null)
  }

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentPassword.trim()) {
      alert("Please fill all fields")
      return
    }

    if (!/@gmail\.com$/i.test(newStudentEmail.trim())) {
      alert("Student email must be a Gmail address")
      return
    }

    if (newStudentPassword.trim().length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    // Check if email already exists
    if (users.some((u) => u.email === newStudentEmail.trim())) {
      alert("This email is already registered")
      return
    }

    // Add to users table
    const newUser: User = {
      id: `s${Date.now()}`,
      email: newStudentEmail.trim(),
      password: newStudentPassword.trim(),
      role: "student",
      name: newStudentName.trim(),
    }

    // Add to students table
    const newStudent: Student = {
      id: newUser.id,
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      marks: { Maths: 0, APP: 0, COA: 0, DSA: 0 },
      attendance: {
        Maths: { attended: 0, total: 0 },
        APP: { attended: 0, total: 0 },
        COA: { attended: 0, total: 0 },
        DSA: { attended: 0, total: 0 },
      },
    }

    setUsers([...users, newUser])
    setStudents([...students, newStudent])

    alert(`Student ${newStudentName} added successfully!`)
    setNewStudentName("")
    setNewStudentEmail("")
    setNewStudentPassword("")
  }

  const handleUpdateMarks = () => {
    if (!updateMarksForm.studentId) {
      alert("Please select a student")
      return
    }

    setStudents(
      students.map((s) =>
        s.id === updateMarksForm.studentId
          ? {
              ...s,
              marks: {
                ...s.marks,
                [updateMarksForm.subject]: updateMarksForm.marks,
              },
            }
          : s,
      ),
    )

    alert("Marks updated successfully!")
    setUpdateMarksForm({ studentId: "", subject: "Maths", marks: 0 })
  }

  const handleUpdateAttendance = () => {
    if (!updateAttendanceForm.studentId) {
      alert("Please select a student")
      return
    }

    setStudents(
      students.map((s) =>
        s.id === updateAttendanceForm.studentId
          ? {
              ...s,
              attendance: {
                ...s.attendance,
                [updateAttendanceForm.subject]: {
                  attended: updateAttendanceForm.attended,
                  total: updateAttendanceForm.total,
                },
              },
            }
          : s,
      ),
    )

    alert("Attendance updated successfully!")
    setUpdateAttendanceForm({ studentId: "", subject: "Maths", attended: 0, total: 0 })
  }

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setUsers(users.filter((u) => u.id !== studentId))
      setStudents(students.filter((s) => s.id !== studentId))
      alert("Student deleted successfully!")
    }
  }

  const handleCreateAssignment = (title: string, subject: Subject, dueDate: string) => {
    const newAssignment: Assignment = {
      id: `a${Date.now()}`,
      title,
      subject,
      dueDate,
    }
    setAssignments([...assignments, newAssignment])
    alert("Assignment created successfully!")
  }

  const handleUploadResource = (title: string, subject: Subject) => {
    const newResource: Resource = {
      id: `r${Date.now()}`,
      title,
      subject,
    }
    setResources([...resources, newResource])
    alert("Resource uploaded successfully!")
  }

  const handleCreateMeetLink = (subject: Subject, link: string) => {
    const newMeetLink: MeetLink = {
      id: `m${Date.now()}`,
      subject,
      teacher: "Shourya Gupta",
      time: new Date().toLocaleTimeString(),
      link,
      status: "live",
    }
    setMeetLinks([...meetLinks, newMeetLink])
    alert("Meet link created successfully!")
  }

  const handleAddTimetableSlot = () => {
    if (!newTimetableForm.time || !newTimetableForm.room) {
      alert("Please fill all fields")
      return
    }

    const newSlot: TimetableSlot = {
      id: `tt${Date.now()}`,
      day: newTimetableForm.day,
      time: newTimetableForm.time,
      subject: newTimetableForm.subject,
      room: newTimetableForm.room,
    }

    setTimetableSlots([...timetableSlots, newSlot])
    alert("Timetable slot added successfully!")
    setNewTimetableForm({ day: "Monday", time: "", subject: "Maths", room: "" })
  }

  const handleDeleteTimetableSlot = (slotId: string) => {
    if (confirm("Are you sure you want to delete this slot?")) {
      setTimetableSlots(timetableSlots.filter((s) => s.id !== slotId))
      alert("Timetable slot deleted successfully!")
    }
  }

  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null)
  const [uploadedResources, setUploadedResources] = useState<
    Array<{ id: string; title: string; subject: Subject; fileName: string; uploadedAt: string }>
  >([])
  const [uploadedAssignments, setUploadedAssignments] = useState<
    Array<{ id: string; title: string; subject: Subject; fileName: string; dueDate: string; uploadedAt: string }>
  >([])

  

  // Render login/signup page
  if (!isLoggedIn) {
    if (isSigningUp) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-white">Create Account</CardTitle>
              <CardDescription className="text-slate-400">Sign up as a teacher or student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-slate-300">Select Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setSignupRole("teacher")}
                    variant={signupRole === "teacher" ? "default" : "outline"}
                    className={signupRole === "teacher" ? "bg-blue-600" : ""}
                  >
                    Teacher
                  </Button>
                  <Button
                    onClick={() => setSignupRole("student")}
                    variant={signupRole === "student" ? "default" : "outline"}
                    className={signupRole === "student" ? "bg-blue-600" : ""}
                  >
                    Student
                  </Button>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-slate-300">
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  placeholder="Enter your full name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-slate-300">
                  Gmail Address
                </Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="bg-slate-700 text-white border-slate-600"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-slate-300">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="bg-slate-700 text-white border-slate-600"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="signup-confirm" className="text-slate-300">
                  Confirm Password
                </Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              {signupError && <p className="text-red-400 text-sm">{signupError}</p>}

              <Button
                onClick={handleSignup}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Create Account
              </Button>

              <Button
                onClick={() => {
                  setIsSigningUp(false)
                  setSignupRole(null)
                  setSignupForm({ name: "", email: "", password: "", confirmPassword: "" })
                  setSignupError(null)
                }}
                variant="ghost"
                className="w-full text-slate-300 hover:text-white"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        {/* 🔐 LOGIN FORM */}
<Card className="w-full max-w-md bg-slate-800 border-slate-700">
  <CardHeader className="space-y-2">
    <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
    <CardDescription className="text-slate-400">
      Log in to your account
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    {/* Email Input */}
    <div className="space-y-2">
      <Label className="text-slate-300">Email</Label>
      <Input
        type="email"
        placeholder="Email"
        value={loginEmail}
        onChange={(e) => {
          console.log("Email typed:", e.target.value) // ✅ debug
          setLoginEmail(e.target.value)
        }}
        className="bg-slate-700 text-white border-slate-600"
      />
    </div>

    {/* Password Input */}
    <div className="space-y-2">
      <Label className="text-slate-300">Password</Label>
      <Input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => {
          console.log("Password typed:", e.target.value) // ✅ debug
          setLoginPassword(e.target.value)
        }}
        className="bg-slate-700 text-white border-slate-600"
      />
    </div>

    {/* Error Text */}
    {loginError && (
      <p className="text-red-400 text-sm">{loginError}</p>
    )}

    {/* Login Button */}
    <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
      Login
    </Button>


    {/* Signup Redirect */}
    <p className="text-slate-400 text-sm text-center">
      Don’t have an account?{" "}
      <span
        onClick={() => setIsSigningUp(true)}
        className="text-blue-400 cursor-pointer hover:underline"
      >
        Sign up
      </span>
    </p>
  </CardContent>
</Card>

      </div>
    )
  }

  const SidebarNav = () => (
    <div
      className={`fixed left-0 top-0 h-screen bg-slate-800 border-r border-slate-700 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} z-40 flex flex-col`}
    >
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && <span className="text-white font-bold">EduHub</span>}
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {(role === "teacher"
          ? [
              { icon: Home, label: "Dashboard", page: "dashboard" },
              { icon: Users, label: "Manage Students", page: "manage-students" },
              { icon: BarChart3, label: "Update Marks", page: "update-marks" },
              { icon: Calendar, label: "Attendance", page: "update-attendance" },
              { icon: FileText, label: "Assignments", page: "create-assignment" },
              { icon: BookOpen, label: "Resources", page: "upload-resources" },
              { icon: Video, label: "Meet Links", page: "create-meet" },
              { icon: Clock, label: "Timetable", page: "manage-timetable" },
            ]
          : [
              { icon: Home, label: "Dashboard", page: "dashboard" },
              { icon: BarChart3, label: "Marks", page: "marks" },
              { icon: Calendar, label: "Attendance", page: "attendance" },
              { icon: FileText, label: "Assignments", page: "assignments" },
              { icon: BookOpen, label: "Resources", page: "resources" },
              { icon: Clock, label: "Timetable", page: "timetable" },
            ]
        ).map((item) => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentPage === item.page
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  )

  const MainLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SidebarNav />
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="text-right">
            <p className="text-white font-semibold">{currentUser?.name}</p>
            <p className="text-slate-400 text-sm capitalize">{role}</p>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )

  if (role === "teacher") {
    if (currentPage === "dashboard") {
      return (
        <MainLayout>
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {currentUser?.name}</h1>
              <p className="text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 transition">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Total Students</p>
                      <p className="text-4xl font-bold text-white mt-2">{students.length}</p>
                      <p className="text-slate-500 text-xs mt-2">Active enrollments</p>
                    </div>
                    <Users className="w-14 h-14 text-blue-500 opacity-30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-purple-500 transition">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Assignments</p>
                      <p className="text-4xl font-bold text-white mt-2">{uploadedAssignments.length}</p>
                      <p className="text-slate-500 text-xs mt-2">Created</p>
                    </div>
                    <FileText className="w-14 h-14 text-purple-500 opacity-30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-green-500 transition">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Resources</p>
                      <p className="text-4xl font-bold text-white mt-2">{uploadedResources.length}</p>
                      <p className="text-slate-500 text-xs mt-2">Uploaded</p>
                    </div>
                    <BookOpen className="w-14 h-14 text-green-500 opacity-30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-red-500 transition">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Meet Links</p>
                      <p className="text-4xl font-bold text-white mt-2">{meetLinks.length}</p>
                      <p className="text-slate-500 text-xs mt-2">Active sessions</p>
                    </div>
                    <Video className="w-14 h-14 text-red-500 opacity-30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => setCurrentPage("manage-students")}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Manage Students</span>
                  <span className="sm:hidden">Students</span>
                </Button>
                <Button
                  onClick={() => setCurrentPage("create-assignment")}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">New Assignment</span>
                  <span className="sm:hidden">Assignment</span>
                </Button>
                <Button
                  onClick={() => setCurrentPage("upload-resources")}
                  className="bg-green-600 hover:bg-green-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload Resource</span>
                  <span className="sm:hidden">Resource</span>
                </Button>
                <Button
                  onClick={() => setCurrentPage("create-meet")}
                  className="bg-red-600 hover:bg-red-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Meet</span>
                  <span className="sm:hidden">Meet</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Students Overview */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Registered Students</span>
                      <span className="text-sm font-normal text-slate-400">{students.length} total</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">Overview of all enrolled students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {students.length > 0 ? (
                        students.map((student) => (
                          <div
                            key={student.id}
                            className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-blue-500 transition"
                          >
                            <p className="text-white font-semibold">{student.name}</p>
                            <p className="text-slate-400 text-sm mb-3">{student.email}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Avg Marks:</span>
                                <span className="text-blue-400 font-semibold">
                                  {Math.round(
                                    Object.values(student.marks).reduce((a, b) => a + b, 0) /
                                      Object.values(student.marks).length || 0,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Avg Attendance:</span>
                                <span className="text-green-400 font-semibold">
                                  {Math.round(
                                    Object.values(student.attendance).reduce((sum, att) => {
                                      return sum + (att.total > 0 ? (att.attended / att.total) * 100 : 0)
                                    }, 0) / 4 || 0,
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 col-span-full text-center py-8">No students enrolled yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {/* Recent Assignments */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Recent Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uploadedAssignments.length > 0 ? (
                        uploadedAssignments
                          .slice(-3)
                          .reverse()
                          .map((assignment) => (
                            <div
                              key={assignment.id}
                              className="bg-slate-700 p-2 rounded text-xs border-l-2 border-purple-500"
                            >
                              <p className="text-white font-semibold truncate">{assignment.title}</p>
                              <p className="text-slate-400">{assignment.subject}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-slate-500 text-xs">No assignments yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Resources */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Recent Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uploadedResources.length > 0 ? (
                        uploadedResources
                          .slice(-3)
                          .reverse()
                          .map((resource) => (
                            <div
                              key={resource.id}
                              className="bg-slate-700 p-2 rounded text-xs border-l-2 border-green-500"
                            >
                              <p className="text-white font-semibold truncate">{resource.title}</p>
                              <p className="text-slate-400">{resource.subject}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-slate-500 text-xs">No resources yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Timetable Preview */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {timetableSlots.filter((slot) => {
                        const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
                        return slot.day === today
                      }).length > 0 ? (
                        timetableSlots
                          .filter((slot) => {
                            const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
                            return slot.day === today
                          })
                          .map((slot) => (
                            <div key={slot.id} className="bg-slate-700 p-2 rounded text-xs border-l-2 border-blue-500">
                              <p className="text-white font-semibold">{slot.subject}</p>
                              <p className="text-slate-400">{slot.time}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-slate-500 text-xs">No classes today</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "manage-timetable") {
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      const groupedByDay = dayOrder.reduce(
        (acc, day) => {
          acc[day] = timetableSlots.filter((slot) => slot.day === day)
          return acc
        },
        {} as Record<string, TimetableSlot[]>,
      )

      return (
        <MainLayout>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Manage Timetable</h1>

            {/* Timetable View - Moved above form */}
            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Current Timetable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {dayOrder.map((day) => (
                    <div key={day}>
                      <p className="text-blue-400 font-semibold mb-2">{day}</p>
                      <div className="space-y-2 ml-4">
                        {groupedByDay[day].length > 0 ? (
                          groupedByDay[day].map((slot) => (
                            <div key={slot.id} className="bg-slate-700 p-3 rounded flex justify-between items-start">
                              <div>
                                <p className="text-white text-sm font-semibold">{slot.time}</p>
                                <p className="text-slate-400 text-xs">
                                  {slot.subject} - Room {slot.room}
                                </p>
                              </div>
                              <Button
                                onClick={() => handleDeleteTimetableSlot(slot.id)}
                                size="sm"
                                variant="destructive"
                              >
                                Delete
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 text-sm">No classes scheduled</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add Timetable Slot Form */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Add Timetable Slot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Day</Label>
                  <select
                    value={newTimetableForm.day}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, day: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300">Time (e.g., 9:00 - 10:00)</Label>
                  <Input
                    placeholder="9:00 - 10:00"
                    value={newTimetableForm.time}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, time: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Subject</Label>
                  <select
                    value={newTimetableForm.subject}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, subject: e.target.value as Subject })}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value="Maths">Maths</option>
                    <option value="APP">APP</option>
                    <option value="COA">COA</option>
                    <option value="DSA">DSA</option>
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300">Room Number</Label>
                  <Input
                    placeholder="A-101"
                    value={newTimetableForm.room}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, room: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button onClick={handleAddTimetableSlot} className="w-full bg-green-600 hover:bg-green-700">
                  Add Slot
                </Button>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "manage-students") {
      return (
        <MainLayout>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Manage Students</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Student Form */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Student</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Student Name</Label>
                    <Input
                      placeholder="Enter student name"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Gmail Address</Label>
                    <Input
                      placeholder="student@gmail.com"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Password</Label>
                    <Input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={newStudentPassword}
                      onChange={(e) => setNewStudentPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      autoComplete="off"
                    />
                  </div>
                  <Button onClick={handleAddStudent} className="w-full bg-green-600 hover:bg-green-700">
                    Add Student
                  </Button>
                </CardContent>
              </Card>

              {/* Students List */}
<Card className="bg-slate-800 border-slate-700">
  <CardHeader>
    <CardTitle className="text-white text-xl">Manage Students</CardTitle>
    <CardDescription className="text-slate-400">
      View and manage all student users.
    </CardDescription>
  </CardHeader>

  <CardContent>
    {loadingStudents ? (
      <p className="text-slate-400">Loading students...</p>
    ) : students.length === 0 ? (
      <p className="text-slate-400">No students found.</p>
    ) : (
      <div className="space-y-3">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between bg-slate-700 p-3 rounded-xl"
          >
            <div>
              <p className="text-white font-semibold">{student.name}</p>
              <p className="text-slate-400 text-sm">{student.email}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>

            </div>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "update-marks") {
      return (
        <MainLayout>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Update Student Marks</h1>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-slate-300">Select Student</Label>
                  <select
                    value={updateMarksForm.studentId}
                    onChange={(e) => setUpdateMarksForm({ ...updateMarksForm, studentId: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value="">Choose a student...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300">Subject</Label>
                  <select
                    value={updateMarksForm.subject}
                    onChange={(e) => setUpdateMarksForm({ ...updateMarksForm, subject: e.target.value as Subject })}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value="Maths">Maths</option>
                    <option value="APP">APP</option>
                    <option value="COA">COA</option>
                    <option value="DSA">DSA</option>
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300">Marks (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={updateMarksForm.marks}
                    onChange={(e) => setUpdateMarksForm({ ...updateMarksForm, marks: Number.parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button onClick={handleUpdateMarks} className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Marks
                </Button>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "update-attendance") {
      return (
        <MainLayout>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Update Student Attendance</h1>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-slate-300">Select Student</Label>
                  <select
                    value={updateAttendanceForm.studentId}
                    onChange={(e) => setUpdateAttendanceForm({ ...updateAttendanceForm, studentId: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value="">Choose a student...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300">Subject</Label>
                  <select
                    value={updateAttendanceForm.subject}
                    onChange={(e) =>
                      setUpdateAttendanceForm({ ...updateAttendanceForm, subject: e.target.value as Subject })
                    }
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value="Maths">Maths</option>
                    <option value="APP">APP</option>
                    <option value="COA">COA</option>
                    <option value="DSA">DSA</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Classes Attended</Label>
                    <Input
                      type="number"
                      min="0"
                      value={updateAttendanceForm.attended}
                      onChange={(e) =>
                        setUpdateAttendanceForm({ ...updateAttendanceForm, attended: Number.parseInt(e.target.value) })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Total Classes</Label>
                    <Input
                      type="number"
                      min="0"
                      value={updateAttendanceForm.total}
                      onChange={(e) =>
                        setUpdateAttendanceForm({ ...updateAttendanceForm, total: Number.parseInt(e.target.value) })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Button onClick={handleUpdateAttendance} className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Attendance
                </Button>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "create-assignment") {
      const handleAssignmentUpload = () => {
        if (!assignmentForm.title || !assignmentForm.dueDate) {
          alert("Please fill all fields")
          return
        }

        const newAssignment = {
          id: `a${Date.now()}`,
          title: assignmentForm.title,
          subject: assignmentForm.subject,
          dueDate: assignmentForm.dueDate,
          fileName: assignmentFile?.name || "No file attached",
          uploadedAt: new Date().toLocaleDateString(),
        }

        setUploadedAssignments([...uploadedAssignments, newAssignment])
        handleCreateAssignment(assignmentForm.title, assignmentForm.subject, assignmentForm.dueDate)
        setAssignmentForm({ title: "", subject: "Maths", dueDate: "" })
        setAssignmentFile(null)
      }

      return (
        <MainLayout>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Create Assignment</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Assignment Form */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Create New Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Assignment Title</Label>
                    <Input
                      placeholder="Enter assignment title"
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Subject</Label>
                    <select
                      value={assignmentForm.subject}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value as Subject })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    >
                      <option value="Maths">Maths</option>
                      <option value="APP">APP</option>
                      <option value="COA">COA</option>
                      <option value="DSA">DSA</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Due Date</Label>
                    <Input
                      type="date"
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Attach File (Optional)</Label>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                      <input
                        type="file"
                        onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="assignment-file"
                      />
                      <label htmlFor="assignment-file" className="cursor-pointer">
                        <p className="text-slate-400">
                          {assignmentFile ? assignmentFile.name : "Click to select or drag and drop"}
                        </p>
                        <p className="text-slate-500 text-sm mt-1">PDF, DOC, Images supported</p>
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleAssignmentUpload} className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Assignment
                  </Button>
                </CardContent>
              </Card>

              {/* Assignments List */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Created Assignments ({uploadedAssignments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {uploadedAssignments.length > 0 ? (
                      uploadedAssignments.map((assignment) => (
                        <div key={assignment.id} className="bg-slate-700 p-3 rounded border border-slate-600">
                          <p className="text-white font-semibold text-sm">{assignment.title}</p>
                          <p className="text-slate-400 text-xs">{assignment.subject}</p>
                          <p className="text-slate-500 text-xs mt-1">📄 {assignment.fileName}</p>
                          <p className="text-blue-400 text-xs">Due: {assignment.dueDate}</p>
                          <p className="text-slate-500 text-xs">Created: {assignment.uploadedAt}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No assignments created yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "upload-resources") {
      const handleResourceUpload = () => {
        if (!resourceForm.title || !resourceFile) {
          alert("Please enter resource title and select a file")
          return
        }

        const newResource = {
          id: `r${Date.now()}`,
          title: resourceForm.title,
          subject: resourceForm.subject,
          fileName: resourceFile.name,
          uploadedAt: new Date().toLocaleDateString(),
        }

        setUploadedResources([...uploadedResources, newResource])
        setResources([
          ...resources,
          { id: newResource.id, title: resourceForm.title, subject: resourceForm.subject, fileName: resourceFile.name },
        ])
        alert("Resource uploaded successfully!")
        setResourceForm({ title: "", subject: "Maths" })
        setResourceFile(null)
      }

      return (
        <MainLayout>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Upload Resources</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Form */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Upload New Resource</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Resource Title</Label>
                    <Input
                      placeholder="Enter resource title"
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Subject</Label>
                    <select
                      value={resourceForm.subject}
                      onChange={(e) => setResourceForm({ ...resourceForm, subject: e.target.value as Subject })}
                      className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                    >
                      <option value="Maths">Maths</option>
                      <option value="APP">APP</option>
                      <option value="COA">COA</option>
                      <option value="DSA">DSA</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Select File</Label>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                      <input
                        type="file"
                        onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="resource-file"
                      />
                      <label htmlFor="resource-file" className="cursor-pointer">
                        <p className="text-slate-400">
                          {resourceFile ? resourceFile.name : "Click to select or drag and drop"}
                        </p>
                        <p className="text-slate-500 text-sm mt-1">PDF, DOC, PPT, Images supported</p>
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleResourceUpload} className="w-full bg-blue-600 hover:bg-blue-700">
                    Upload Resource
                  </Button>
                </CardContent>
              </Card>

              {/* Uploaded Resources List */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Uploaded Resources ({uploadedResources.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {uploadedResources.length > 0 ? (
                      uploadedResources.map((resource) => (
                        <div key={resource.id} className="bg-slate-700 p-3 rounded border border-slate-600">
                          <p className="text-white font-semibold text-sm">{resource.title}</p>
                          <p className="text-slate-400 text-xs">{resource.subject}</p>
                          <p className="text-slate-500 text-xs mt-1">📄 {resource.fileName}</p>
                          <p className="text-slate-500 text-xs">Uploaded: {resource.uploadedAt}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No resources uploaded yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "create-meet") {
      return (
        <MainLayout>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Create Meet Link</h1>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-slate-300">Subject</Label>
                  <select
                    value={meetForm.subject}
                    onChange={(e) => setMeetForm({ ...meetForm, subject: e.target.value as Subject })}
                    className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
                  >
                    <option value="Maths">Maths</option>
                    <option value="APP">APP</option>
                    <option value="COA">COA</option>
                    <option value="DSA">DSA</option>
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300">Google Meet Link</Label>
                  <Input
                    placeholder="https://meet.google.com/..."
                    value={meetForm.link}
                    onChange={(e) => setMeetForm({ ...meetForm, link: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button
                  onClick={() => {
                    if (meetForm.link) {
                      handleCreateMeetLink(meetForm.subject, meetForm.link)
                      setMeetForm({ subject: "Maths", link: "" })
                    } else {
                      alert("Please enter meet link")
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Meet Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }
  }

  if (role === "student") {
    if (currentPage === "dashboard") {
      const studentData = students.find((s) => s.email === currentUser?.email)

      return (
        <MainLayout>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {currentUser?.name}</h1>
              <p className="text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {studentData &&
                (["Maths", "APP", "COA", "DSA"] as Subject[]).map((subject, index) => {
                  const colors = [
                    "from-blue-600 to-blue-800",
                    "from-purple-600 to-purple-800",
                    "from-green-600 to-green-800",
                    "from-orange-600 to-orange-800",
                  ]
                  return (
                    <Card
                      key={subject}
                      className={`bg-gradient-to-br ${colors[index]} border-slate-700 hover:border-slate-500 transition`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-200 text-sm font-medium">{subject}</p>
                            <p className="text-4xl font-bold text-white mt-2">{studentData.marks[subject]}</p>
                            <p className="text-slate-300 text-xs mt-2">out of 100</p>
                          </div>
                          <BarChart3 className="w-14 h-14 text-white opacity-20" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => setCurrentPage("assignments")}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Assignments</span>
                  <span className="sm:hidden">Work</span>
                </Button>
                <Button
                  onClick={() => setCurrentPage("resources")}
                  className="bg-green-600 hover:bg-green-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Resources</span>
                  <span className="sm:hidden">Study</span>
                </Button>
                <Button
                  onClick={() => setCurrentPage("marks")}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Marks</span>
                  <span className="sm:hidden">Grades</span>
                </Button>
                <Button
                  onClick={() => setCurrentPage("timetable")}
                  className="bg-orange-600 hover:bg-orange-700 text-white h-12 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Timetable</span>
                  <span className="sm:hidden">Schedule</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Overview - Main Section */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Attendance Overview</CardTitle>
                    <CardDescription className="text-slate-400">Your attendance across all subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentData &&
                        (["Maths", "APP", "COA", "DSA"] as Subject[]).map((subject) => {
                          const att = studentData.attendance[subject]
                          const percentage = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 0
                          const statusColor =
                            percentage >= 75 ? "text-green-400" : percentage >= 60 ? "text-yellow-400" : "text-red-400"

                          return (
                            <div key={subject} className="bg-slate-700 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-white font-semibold">{subject}</p>
                                <p className={`font-bold ${statusColor}`}>{percentage}%</p>
                              </div>
                              <div className="w-full bg-slate-600 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full transition-all ${
                                    percentage >= 75
                                      ? "bg-green-500"
                                      : percentage >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <p className="text-slate-400 text-xs mt-2">
                                {att.attended} attended out of {att.total} classes
                              </p>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar with Recent Activity */}
              <div className="space-y-4">
                {/* Pending Assignments */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Pending Work</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uploadedAssignments.length > 0 ? (
                        uploadedAssignments
                          .slice(-3)
                          .reverse()
                          .map((assignment) => (
                            <div
                              key={assignment.id}
                              className="bg-slate-700 p-2 rounded text-xs border-l-2 border-purple-500"
                            >
                              <p className="text-white font-semibold truncate">{assignment.title}</p>
                              <p className="text-slate-400 text-xs">{assignment.subject}</p>
                              <p className="text-orange-400 text-xs mt-1">Due: {assignment.dueDate}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-slate-500 text-xs">No pending assignments</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Classes */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {timetableSlots.filter((slot) => {
                        const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
                        return slot.day === today
                      }).length > 0 ? (
                        timetableSlots
                          .filter((slot) => {
                            const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
                            return slot.day === today
                          })
                          .map((slot) => (
                            <div key={slot.id} className="bg-slate-700 p-2 rounded text-xs border-l-2 border-blue-500">
                              <p className="text-white font-semibold">{slot.subject}</p>
                              <p className="text-slate-400">{slot.time}</p>
                              <p className="text-slate-500 text-xs">Room {slot.room}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-slate-500 text-xs">No classes today</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Available Resources */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Study Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uploadedResources.length > 0 ? (
                        uploadedResources
                          .slice(-3)
                          .reverse()
                          .map((resource) => (
                            <div
                              key={resource.id}
                              className="bg-slate-700 p-2 rounded text-xs border-l-2 border-green-500"
                            >
                              <p className="text-white font-semibold truncate">{resource.title}</p>
                              <p className="text-slate-400">{resource.subject}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-slate-500 text-xs">No resources available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </MainLayout>
      )
    }
  
    if (currentPage === "timetable") {
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      const groupedByDay = dayOrder.reduce(
        (acc, day) => {
          acc[day] = timetableSlots.filter((slot) => slot.day === day)
          return acc
        },
        {} as Record<string, TimetableSlot[]>,
      )

      return (
        <MainLayout>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Class Timetable</h1>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {dayOrder.map((day) => (
                    <div key={day} className="border-b border-slate-700 pb-6 last:border-b-0">
                      <h3 className="text-blue-400 font-bold text-lg mb-4">{day}</h3>
                      <div className="space-y-3">
                        {groupedByDay[day].length > 0 ? (
                          groupedByDay[day].map((slot) => (
                            <div key={slot.id} className="bg-slate-700 p-4 rounded-lg border-l-4 border-blue-500">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-white font-semibold text-lg">{slot.subject}</p>
                                  <p className="text-slate-400 text-sm mt-1">Time: {slot.time}</p>
                                  <p className="text-slate-400 text-sm">Room: {slot.room}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 text-sm italic">No classes scheduled</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "marks") {
      const studentData = students.find((s) => s.email === currentUser?.email)

      return (
        <MainLayout>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Your Marks</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentData &&
                (["Maths", "APP", "COA", "DSA"] as Subject[]).map((subject) => (
                  <Card key={subject} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <p className="text-slate-400">{subject}</p>
                      <p className="text-white text-3xl font-bold mt-2">{studentData.marks[subject]}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "attendance") {
      const studentData = students.find((s) => s.email === currentUser?.email)

      return (
        <MainLayout>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Your Attendance</h1>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {studentData &&
                    (["Maths", "APP", "COA", "DSA"] as Subject[]).map((subject) => {
                      const att = studentData.attendance[subject]
                      const percentage = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 0

                      return (
                        <div key={subject} className="bg-slate-700 p-4 rounded">
                          <div className="flex justify-between mb-2">
                            <p className="text-white font-semibold">{subject}</p>
                            <p className="text-blue-400">{percentage}%</p>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <p className="text-slate-400 text-sm mt-2">
                            {att.attended} / {att.total} classes
                          </p>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "assignments") {
      const studentAssignments = assignments.filter((a) => a.subject)

      return (
        <MainLayout>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Assignments</h1>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {studentAssignments.length > 0 ? (
                    studentAssignments.map((assignment) => (
                      <div key={assignment.id} className="bg-slate-700 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-semibold">{assignment.title}</p>
                            <p className="text-slate-400 text-sm">{assignment.subject}</p>
                          </div>
                          <p className="text-blue-400 text-sm">Due: {assignment.dueDate}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">No assignments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }

    if (currentPage === "resources") {
      return (
        <MainLayout>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Resources</h1>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {resources.length > 0 ? (
                    resources.map((resource) => (
                      <div key={resource.id} className="bg-slate-700 p-4 rounded">
                        <p className="text-white font-semibold">{resource.title}</p>
                        <p className="text-slate-400 text-sm">{resource.subject}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">No resources available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )
    }
  }

  return null
}
