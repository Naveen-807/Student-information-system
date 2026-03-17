import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, BookOpen, Calendar, ClipboardList, 
  DollarSign, Clock, Users, GraduationCap, Building2,
  LogOut, Menu, X, Bell
} from 'lucide-react'
import { useState } from 'react'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getNavItems = () => {
    if (user.role === 'student') {
      return [
        { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/student/courses', icon: BookOpen, label: 'Courses' },
        { path: '/student/attendance', icon: Calendar, label: 'Attendance' },
        { path: '/student/grades', icon: GraduationCap, label: 'Grades' },
        { path: '/student/assignments', icon: ClipboardList, label: 'Assignments' },
        { path: '/student/fees', icon: DollarSign, label: 'Fees' },
        { path: '/student/timetable', icon: Clock, label: 'Timetable' },
      ]
    } else if (user.role === 'teacher') {
      return [
        { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/teacher/courses', icon: BookOpen, label: 'My Courses' },
        { path: '/teacher/attendance', icon: Calendar, label: 'Attendance' },
        { path: '/teacher/assignments', icon: ClipboardList, label: 'Assignments' },
      ]
    } else if (user.role === 'admin') {
      return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/students', icon: Users, label: 'Students' },
        { path: '/admin/teachers', icon: GraduationCap, label: 'Teachers' },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { path: '/admin/departments', icon: Building2, label: 'Departments' },
      ]
    }
    return []
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-primary-600">University SIS</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-14 p-6">
        {children}
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
