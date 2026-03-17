import { useEffect, useState } from 'react'
import api from '../../services/api'
import { format } from 'date-fns'

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/students/attendance')
      setAttendance(response.data)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700'
      case 'absent': return 'bg-red-100 text-red-700'
      case 'late': return 'bg-yellow-100 text-yellow-700'
      case 'excused': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Attendance Record</h1>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Course</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  {format(new Date(record.date), 'MMM dd, yyyy')}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{record.course_name}</p>
                    <p className="text-sm text-gray-600">{record.course_code}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {attendance.length === 0 && (
          <p className="text-center py-8 text-gray-600">No attendance records found</p>
        )}
      </div>
    </div>
  )
}

export default Attendance
