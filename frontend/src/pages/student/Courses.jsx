import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BookOpen, Users, Clock } from 'lucide-react'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/students/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      await api.post('/students/courses/enroll', { courseId })
      fetchCourses()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to enroll')
    }
  }

  const handleDrop = async (courseId) => {
    if (!confirm('Are you sure you want to drop this course?')) return
    try {
      await api.delete(`/students/courses/${courseId}/drop`)
      fetchCourses()
    } catch (error) {
      alert('Failed to drop course')
    }
  }

  if (loading) return <div>Loading...</div>

  const enrolledCourses = courses.filter(c => c.enrollment_status === 'active')
  const availableCourses = courses.filter(c => !c.enrollment_status)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p className="text-gray-600">You are not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <BookOpen className="text-primary-600" size={24} />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Enrolled
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{course.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.course_code}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {course.credits} Credits
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {course.teacher_name || 'TBA'}
                  </span>
                </div>
                <button
                  onClick={() => handleDrop(course.id)}
                  className="w-full btn bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Drop Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
        {availableCourses.length === 0 ? (
          <p className="text-gray-600">No available courses to enroll.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <div key={course.id} className="card">
                <div className="bg-gray-100 p-2 rounded-lg w-fit mb-3">
                  <BookOpen className="text-gray-600" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-1">{course.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.course_code}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {course.credits} Credits
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {course.teacher_name || 'TBA'}
                  </span>
                </div>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="w-full btn btn-primary"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
