import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    try {
      await api.delete(`/admin/students/${id}`)
      fetchStudents()
    } catch (error) {
      alert('Failed to delete student')
    }
  }

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students Management</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Student
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
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
              <th className="text-left py-3 px-4">Student ID</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Department</th>
              <th className="text-left py-3 px-4">Semester</th>
              <th className="text-left py-3 px-4">GPA</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">{student.student_id}</td>
                <td className="py-3 px-4">
                  {student.first_name} {student.last_name}
                </td>
                <td className="py-3 px-4">{student.email}</td>
                <td className="py-3 px-4">{student.department_name || 'N/A'}</td>
                <td className="py-3 px-4">{student.semester}</td>
                <td className="py-3 px-4">{student.gpa?.toFixed(2) || '0.00'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
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
        {filteredStudents.length === 0 && (
          <p className="text-center py-8 text-gray-600">No students found</p>
        )}
      </div>
    </div>
  )
}

export default Students
