import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BookOpen, Users, ClipboardList, AlertCircle } from 'lucide-react'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/teachers/dashboard')
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const stats = [
    {
      label: 'Total Courses',
      value: data?.stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Students',
      value: data?.stats?.totalStudents || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Total Assignments',
      value: data?.stats?.totalAssignments || 0,
      icon: ClipboardList,
      color: 'bg-purple-500',
    },
    {
      label: 'Pending Grading',
      value: data?.stats?.pendingGrading || 0,
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {data?.teacher?.first_name} {data?.teacher?.last_name}
        </h1>
        <p className="text-gray-600 mt-1">Teacher Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Teacher Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Teacher ID:</span>
              <span className="font-medium">{data?.teacher?.teacher_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Specialization:</span>
              <span className="font-medium">{data?.teacher?.specialization}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Qualification:</span>
              <span className="font-medium">{data?.teacher?.qualification}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/teacher/courses" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium">Manage Courses</p>
              <p className="text-sm text-gray-600">View and manage your courses</p>
            </a>
            <a href="/teacher/attendance" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium">Mark Attendance</p>
              <p className="text-sm text-gray-600">Record student attendance</p>
            </a>
            <a href="/teacher/assignments" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium">Grade Assignments</p>
              <p className="text-sm text-gray-600">Review and grade submissions</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
