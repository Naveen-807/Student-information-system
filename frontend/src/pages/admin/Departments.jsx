import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Plus, Building2 } from 'lucide-react'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments')
      setDepartments(response.data)
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Departments Management</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="card">
            <div className="bg-primary-100 p-3 rounded-lg w-fit mb-4">
              <Building2 className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">{dept.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{dept.code}</p>
            <p className="text-sm text-gray-700 mb-4">{dept.description}</p>
            
            <div className="space-y-2 mb-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Head:</span>
                <span className="font-medium">{dept.head_name || 'Not assigned'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">{dept.student_count || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Courses:</span>
                <span className="font-medium">{dept.course_count || 0}</span>
              </div>
            </div>

            <button className="w-full btn btn-secondary text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <p className="text-center py-12 text-gray-600">No departments found</p>
      )}
    </div>
  )
}

export default Departments
