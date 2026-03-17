import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    try {
      await api.delete(`/admin/courses/${id}`)
      fetchCourses()
    } catch (error) {
      alert('Failed to delete course')
    }
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses Management</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Course
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Code</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Department</th>
              <th className="text-left py-3 px-4">Credits</th>
              <th className="text-left py-3 px-4">Semester</th>
              <th className="text-left py-3 px-4">Teacher</th>
              <th className="text-left py-3 px-4">Enrolled</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">{course.course_code}</td>
                <td className="py-3 px-4">{course.name}</td>
                <td className="py-3 px-4">{course.department_name || 'N/A'}</td>
                <td className="py-3 px-4">{course.credits}</td>
                <td className="py-3 px-4">{course.semester}</td>
                <td className="py-3 px-4">{course.teacher_name || 'Unassigned'}</td>
                <td className="py-3 px-4">
                  {course.enrolled_count || 0} / {course.capacity}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCourses.length === 0 && (
          <p className="text-center py-8 text-gray-600">No courses found</p>
        )}
      </div>
    </div>
  )
}

export default Courses
