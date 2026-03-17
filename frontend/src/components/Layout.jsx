import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, BookOpen, Calendar, ClipboardList, 
  DollarSign, Clock, Users, GraduationCap, Building2,
  LogOut, Menu, X, Bell, User
} from 'lucide-react'
import { useState } from 'react'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getNavItems = () => {
    if (user.role === 'student') {
      return [
        { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-600' },
        { path: '/student/courses', icon: BookOpen, label: 'Courses', color: 'text-green-600' },
        { path: '/student/attendance', icon: Calendar, label: 'Attendance', color: 'text-purple-600' },
        { path: '/student/grades', icon: GraduationCap, label: 'Grades', color: 'text-yellow-600' },
        { path: '/student/assignments', icon: ClipboardList, label: 'Assignments', color: 'text-red-600' },
        { path: '/student/fees', icon: DollarSign, label: 'Fees', color: 'text-orange-600' },
        { path: '/student/timetable', icon: Clock, label: 'Timetable', color: 'text-indigo-600' },
      ]
    } else if (user.role === 'teacher') {
      return [
        { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-600' },
        { path: '/teacher/courses', icon: BookOpen, label: 'My Courses', color: 'text-green-600' },
        { path: '/teacher/attendance', icon: Calendar, label: 'Attendance', color: 'text-purple-600' },
        { path: '/teacher/assignments', icon: ClipboardList, label: 'Assignments', color: 'text-red-600' },
      ]
    } else if (user.role === 'admin') {
      return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-600' },
        { path: '/admin/students', icon: Users, label: 'Students', color: 'text-green-600' },
        { path: '/admin/teachers', icon: GraduationCap, label: 'Teachers', color: 'text-purple-600' },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses', color: 'text-yellow-600' },
        { path: '/admin/departments', icon: Building2, label: 'Departments', color: 'text-orange-600' },
      ]
    }
    return []
  }

  const navItems = getNavItems()

  const getRoleColor = () => {
    switch(user.role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'teacher': return 'bg-green-100 text-green-700 border-green-200'
      case 'student': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  University SIS
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Student Information System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleColor()}`}>
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-20 shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-semibold shadow-sm border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                }`}
              >
                <Icon size={20} className={isActive ? item.color : 'text-gray-500'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-gray-700 mb-1">Need Help?</p>
          <p className="text-xs text-gray-600">Contact support@university.edu</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-14 p-6 min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
