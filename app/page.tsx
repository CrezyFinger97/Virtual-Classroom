"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Types
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
  marks: Record<Subject, number>
  attendance: Record<Subject, { total: number; attended: number }>
}

type Assignment = {
  id: string
  title: string
  subject: Subject
  dueDate: string
  attachmentName?: string
}

type Resource = {
  id: string
  title: string
  subject: Subject
  fileName?: string
}

type MeetLink = {
  id: string
  subject: Subject
  teacher: string
  time: string
  link: string
  status: "live" | "upcoming" | "scheduled"
}

type TimetableDay = {
  day: string
  slots: Array<{
    time: string
    subject: Subject
    teacher: string
    room: string
  }>
}

// Mock data
const mockUsers: User[] = [
  {
    id: "t1",
    email: "shouryagupta180@gmail.com",
    password: "123456",
    role: "teacher",
    name: "Shourya Gupta",
  },
]

const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Alice Smith",
    email: "alice@gmail.com",
    marks: { Maths: 85, APP: 92, COA: 78, DSA: 88 },
    attendance: {
      Maths: { attended: 40, total: 45 },
      APP: { attended: 38, total: 40 },
      COA: { attended: 30, total: 38 },
      DSA: { attended: 42, total: 42 },
    },
  },
]

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
  },
]

export default function VirtualClassroomApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<"student" | "teacher" | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<string>("dashboard")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const [assignmentForm, setAssignmentForm] = useState({ title: "", subject: "Maths" as Subject, dueDate: "" })
  const [resourceForm, setResourceForm] = useState({ title: "", subject: "Maths" as Subject })
  const [meetForm, setMeetForm] = useState({ subject: "Maths" as Subject, link: "" })

  // App data
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [meetLinks, setMeetLinks] = useState<MeetLink[]>(initialMeetLinks)
  const [timetable, setTimetable] = useState<TimetableDay[]>(initialTimetable)

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

  const canLogin = /@gmail\.com$/i.test(email.trim()) && password.trim().length >= 6

  const handleLogin = () => {
    if (!canLogin) {
      setLoginError("Please use a Gmail address with at least 6 character password.")
      return
    }

    const user = users.find((u) => u.email === email.trim() && u.password === password.trim())

    if (!user) {
      setLoginError("Invalid email or password.")
      return
    }

    setLoginError(null)
    setCurrentUser(user)
    setRole(user.role)
    setIsLoggedIn(true)
    setCurrentPage("dashboard")
    setEmail("")
    setPassword("")
  }

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

  // Render login page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-white">Virtual Classroom</CardTitle>
            <CardDescription className="text-slate-400">Login to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your Gmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <Button
              onClick={handleLogin}
              disabled={!canLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login
            </Button>
            <div className="text-center text-sm text-slate-400">
              <p>Demo Teacher: shouryagupta180@gmail.com / 123456</p>
              <p>Demo Student: alice@gmail.com / pass123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (role === "teacher") {
    if (currentPage === "dashboard") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
                <p className="text-slate-400">Welcome, {currentUser?.name}</p>
              </div>
              <Button onClick={handleLogout} variant="destructive" className="gap-2">
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Manage Students", page: "manage-students" },
                { label: "Update Marks", page: "update-marks" },
                { label: "Update Attendance", page: "update-attendance" },
                { label: "Create Assignment", page: "create-assignment" },
                { label: "Upload Resources", page: "upload-resources" },
                { label: "Create Meet Link", page: "create-meet" },
              ].map((item) => (
                <Card
                  key={item.page}
                  className="bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => setCurrentPage(item.page)}
                >
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    <p className="text-white font-semibold text-lg">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (currentPage === "manage-students") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

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
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Gmail Address</Label>
                    <Input
                      placeholder="student@gmail.com"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
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
                  <CardTitle className="text-white">Registered Students ({students.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {students.map((student) => (
                      <div key={student.id} className="bg-slate-700 p-3 rounded flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">{student.name}</p>
                          <p className="text-slate-400 text-sm">{student.email}</p>
                        </div>
                        <Button onClick={() => handleDeleteStudent(student.id)} size="sm" variant="destructive">
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    if (currentPage === "update-marks") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Update Student Marks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
        </div>
      )
    }

    if (currentPage === "update-attendance") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Update Student Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
        </div>
      )
    }

    if (currentPage === "create-assignment") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Create Assignment</CardTitle>
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

                <Button
                  onClick={() => {
                    if (assignmentForm.title && assignmentForm.dueDate) {
                      handleCreateAssignment(assignmentForm.title, assignmentForm.subject, assignmentForm.dueDate)
                      setAssignmentForm({ title: "", subject: "Maths", dueDate: "" })
                    } else {
                      alert("Please fill all fields")
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (currentPage === "upload-resources") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Upload Resources</CardTitle>
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

                <Button
                  onClick={() => {
                    if (resourceForm.title) {
                      handleUploadResource(resourceForm.title, resourceForm.subject)
                      setResourceForm({ title: "", subject: "Maths" })
                    } else {
                      alert("Please enter resource title")
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (currentPage === "create-meet") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Create Meet Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
        </div>
      )
    }
  }

  if (role === "student") {
    if (currentPage === "dashboard") {
      const studentData = students.find((s) => s.email === currentUser?.email)

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
                <p className="text-slate-400">Welcome, {currentUser?.name}</p>
              </div>
              <Button onClick={handleLogout} variant="destructive" className="gap-2">
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Marks", page: "marks" },
                { label: "Attendance", page: "attendance" },
                { label: "Assignments", page: "assignments" },
                { label: "Resources", page: "resources" },
              ].map((item) => (
                <Card
                  key={item.page}
                  className="bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500 transition"
                  onClick={() => setCurrentPage(item.page)}
                >
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    <p className="text-white font-semibold text-lg">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {studentData && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(["Maths", "APP", "COA", "DSA"] as Subject[]).map((subject) => (
                      <div key={subject} className="bg-slate-700 p-4 rounded">
                        <p className="text-slate-400 text-sm">{subject}</p>
                        <p className="text-white text-2xl font-bold">{studentData.marks[subject]}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )
    }

    // Student Marks Page
    if (currentPage === "marks") {
      const studentData = students.find((s) => s.email === currentUser?.email)

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentData &&
                    (["Maths", "APP", "COA", "DSA"] as Subject[]).map((subject) => (
                      <div key={subject} className="bg-slate-700 p-4 rounded">
                        <p className="text-slate-400">{subject}</p>
                        <p className="text-white text-3xl font-bold">{studentData.marks[subject]}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Student Attendance Page
    if (currentPage === "attendance") {
      const studentData = students.find((s) => s.email === currentUser?.email)

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Attendance</CardTitle>
              </CardHeader>
              <CardContent>
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
        </div>
      )
    }

    // Student Assignments Page
    if (currentPage === "assignments") {
      const studentAssignments = assignments.filter((a) => a.subject)

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Assignments</CardTitle>
              </CardHeader>
              <CardContent>
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
        </div>
      )
    }

    // Student Resources Page
    if (currentPage === "resources") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white"
            >
              ← Back
            </Button>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Resources</CardTitle>
              </CardHeader>
              <CardContent>
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
        </div>
      )
    }
  }

  return null
}
