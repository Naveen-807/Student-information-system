import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import StudentDashboard from './pages/student/Dashboard'
import StudentCourses from './pages/student/Courses'
import StudentAttendance from './pages/student/Attendance'
import StudentGrades from './pages/student/Grades'
import StudentAssignments from './pages/student/Assignments'
import StudentFees from './pages/student/Fees'
import StudentTimetable from './pages/student/Timetable'
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherCourses from './pages/teacher/Courses'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherAssignments from './pages/teacher/Assignments'
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminTeachers from './pages/admin/Teachers'
import AdminCourses from './pages/admin/Courses'
import AdminDepartments from './pages/admin/Departments'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="student" />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="timetable" element={<StudentTimetable />} />
          </Route>
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute role="teacher" />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="assignments" element={<TeacherAssignments />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="departments" element={<AdminDepartments />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
