import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BookOpen, Calendar, ClipboardList, DollarSign, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/students/dashboard')
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>
  }

  const stats = [
    {
      label: 'Enrolled Courses',
      value: data?.stats?.enrolledCourses || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      label: 'Attendance',
      value: `${data?.stats?.attendancePercentage || 0}%`,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      label: 'Pending Assignments',
      value: data?.stats?.pendingAssignments || 0,
      icon: ClipboardList,
      color: 'bg-orange-500',
    },
    {
      label: 'GPA',
      value: data?.stats?.gpa?.toFixed(2) || '0.00',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Pending Fees',
      value: `$${data?.stats?.pendingFees?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-red-500',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {data?.student?.first_name}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your academic overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
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
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Student ID:</span>
              <span className="font-medium">{data?.student?.student_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Semester:</span>
              <span className="font-medium">{data?.student?.semester}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Year:</span>
              <span className="font-medium">{data?.student?.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{data?.student?.email}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/student/courses" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium">Register for Courses</p>
              <p className="text-sm text-gray-600">Browse and enroll in available courses</p>
            </a>
            <a href="/student/assignments" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium">Submit Assignments</p>
              <p className="text-sm text-gray-600">View and submit pending assignments</p>
            </a>
            <a href="/student/fees" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium">Pay Fees</p>
              <p className="text-sm text-gray-600">View and pay pending fees</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
