import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (role) => {
    const credentials = {
      admin: { email: 'admin@university.edu', password: 'Admin@123' },
      teacher: { email: 'teacher@university.edu', password: 'Teacher@123' },
      student: { email: 'student@university.edu', password: 'Student@123' }
    }
    setEmail(credentials[role].email)
    setPassword(credentials[role].password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-xl transform hover:scale-110 transition-transform duration-300">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            University SIS
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Student Information System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                  placeholder="your.email@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Login Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 text-center mb-3">
              Quick Login (Demo Accounts)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('teacher')}
                className="px-3 py-2 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
              >
                Teacher
              </button>
              <button
                onClick={() => quickLogin('student')}
                className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              >
                Student
              </button>
            </div>
            <div className="mt-4 space-y-1 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">Demo Credentials:</p>
              <p>👨‍💼 Admin: admin@university.edu / Admin@123</p>
              <p>👩‍🏫 Teacher: teacher@university.edu / Teacher@123</p>
              <p>👨‍🎓 Student: student@university.edu / Student@123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2024 University SIS. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
