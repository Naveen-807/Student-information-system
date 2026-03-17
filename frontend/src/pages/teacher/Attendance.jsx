import { useEffect, useState } from 'react'
import api from '../../services/api'

const Attendance = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [students, setStudents] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents()
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/teachers/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get(`/teachers/courses/${selectedCourse}/students`)
      setStudents(response.data)
      const initialAttendance = {}
      response.data.forEach(student => {
        initialAttendance[student.id] = 'present'
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
      studentId: parseInt(studentId),
      status
    }))

    try {
      await api.post('/teachers/attendance', {
        courseId: parseInt(selectedCourse),
        date,
        attendanceRecords
      })
      alert('Attendance marked successfully!')
    } catch (error) {
      alert('Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input"
            >
              <option value="">Choose a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.course_code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {selectedCourse && students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Student ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{student.student_id}</td>
                    <td className="py-3 px-4">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={attendance[student.id] || 'present'}
                        onChange={(e) => setAttendance({
                          ...attendance,
                          [student.id]: e.target.value
                        })}
                        className="input"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </form>
      )}

      {selectedCourse && students.length === 0 && (
        <p className="text-center py-8 text-gray-600">No students enrolled in this course</p>
      )}
    </div>
  )
}

export default Attendance
