import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BookOpen, Calendar, ClipboardList, DollarSign, TrendingUp, ArrowRight, Award } from 'lucide-react'
import Loading from '../../components/Loading'

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

  if (loading) return <Loading message="Loading your dashboard..." />

  const stats = [
    {
      label: 'Enrolled Courses',
      value: data?.stats?.enrolledCourses || 0,
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Attendance',
      value: `${data?.stats?.attendancePercentage || 0}%`,
      icon: Calendar,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Pending Tasks',
      value: data?.stats?.pendingAssignments || 0,
      icon: ClipboardList,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-600',
    },
    {
      label: 'Current GPA',
      value: data?.stats?.gpa?.toFixed(2) || '0.00',
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Pending Fees',
      value: `$${data?.stats?.pendingFees?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      textColor: 'text-red-600',
    },
  ]

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return 'text-green-600'
    if (gpa >= 3.0) return 'text-blue-600'
    if (gpa >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {data?.student?.first_name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Here's your academic overview for today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp size={48} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stat-card group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Student Information</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              data?.student?.gpa >= 3.5 ? 'bg-green-100 text-green-700' :
              data?.student?.gpa >= 3.0 ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              GPA: {data?.student?.gpa?.toFixed(2)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Student ID</span>
              <span className="font-semibold text-gray-900">{data?.student?.student_id}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Semester</span>
              <span className="font-semibold text-gray-900">{data?.student?.semester}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Academic Year</span>
              <span className="font-semibold text-gray-900">{data?.student?.year}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Email</span>
              <span className="font-semibold text-gray-900 text-sm">{data?.student?.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <a 
              href="/student/courses" 
              className="group block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-100 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Register for Courses</p>
                    <p className="text-sm text-gray-600">Browse and enroll in available courses</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            
            <a 
              href="/student/assignments" 
              className="group block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all duration-200 border border-orange-100 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <ClipboardList size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Submit Assignments</p>
                    <p className="text-sm text-gray-600">View and submit pending assignments</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            
            <a 
              href="/student/fees" 
              className="group block p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-100 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <DollarSign size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pay Fees</p>
                    <p className="text-sm text-gray-600">View and pay pending fees</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
