import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from './Layout'

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium text-lg">Loading your dashboard...</p>
        <p className="mt-2 text-gray-500 text-sm">Please wait a moment</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default ProtectedRoute
