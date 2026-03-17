import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Users, GraduationCap, BookOpen, Building2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/analytics')
      ])
      setStats(statsRes.data)
      setAnalytics(analyticsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const statCards = [
    {
      label: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Teachers',
      value: stats?.totalTeachers || 0,
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      label: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      label: 'Departments',
      value: stats?.totalDepartments || 0,
      icon: Building2,
      color: 'bg-orange-500',
    },
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Students by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.departmentStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="student_count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">GPA Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.gpaDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.grade}: ${entry.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(analytics?.gpaDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/students" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="text-blue-600 mb-2" size={24} />
            <p className="font-medium">Manage Students</p>
          </a>
          <a href="/admin/teachers" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <GraduationCap className="text-green-600 mb-2" size={24} />
            <p className="font-medium">Manage Teachers</p>
          </a>
          <a href="/admin/courses" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <BookOpen className="text-purple-600 mb-2" size={24} />
            <p className="font-medium">Manage Courses</p>
          </a>
          <a href="/admin/departments" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Building2 className="text-orange-600 mb-2" size={24} />
            <p className="font-medium">Manage Departments</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
