import { useEffect, useState } from 'react'
import api from '../../services/api'

const Grades = () => {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      const response = await api.get('/students/grades')
      setGrades(response.data)
    } catch (error) {
      console.error('Failed to fetch grades:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Grades & Performance</h1>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Course</th>
              <th className="text-left py-3 px-4">Exam Type</th>
              <th className="text-left py-3 px-4">Marks</th>
              <th className="text-left py-3 px-4">Grade</th>
              <th className="text-left py-3 px-4">Semester</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{grade.course_name}</p>
                    <p className="text-sm text-gray-600">{grade.course_code}</p>
                  </div>
                </td>
                <td className="py-3 px-4 capitalize">{grade.exam_type}</td>
                <td className="py-3 px-4">
                  {grade.marks_obtained} / {grade.total_marks}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-primary-600">{grade.grade}</span>
                </td>
                <td className="py-3 px-4">
                  Semester {grade.semester}, {grade.year}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {grades.length === 0 && (
          <p className="text-center py-8 text-gray-600">No grades available yet</p>
        )}
      </div>
    </div>
  )
}

export default Grades
