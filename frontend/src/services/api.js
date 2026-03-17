import axios from 'axios'

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim()
const isLocalhostApi = /^https?:\/\/localhost(:\d+)?\/api$/i.test(configuredBaseUrl || '')

// In local dev, always use Vite proxy unless an explicit non-localhost API URL is provided.
const baseURL = import.meta.env.DEV
  ? (configuredBaseUrl && !isLocalhostApi ? configuredBaseUrl : '/api')
  : (configuredBaseUrl || '/api')

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
