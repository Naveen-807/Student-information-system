import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BookOpen, Users } from 'lucide-react'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/teachers/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className="bg-primary-100 p-3 rounded-lg w-fit mb-4">
              <BookOpen className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{course.course_code}</p>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{course.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Credits:</span>
                <span className="font-medium">{course.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Semester:</span>
                <span className="font-medium">{course.semester}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Enrolled Students:</span>
                <span className="font-medium flex items-center gap-1">
                  <Users size={14} />
                  {course.enrolled_students}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 btn btn-primary text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-center py-12 text-gray-600">No courses assigned yet</p>
      )}
    </div>
  )
}

export default Courses
