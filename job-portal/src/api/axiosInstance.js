import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1'

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every outgoing request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle expired/invalid sessions globally, and business-level failures
// that the backend returns with an HTTP 200 status (code: "FAILURE" in the body)
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.code !== 'SUCCESS') {
      // Reject with the same shape a real HTTP error would have,
      // so existing `err.response?.data?.message` reads in catch blocks keep working
      return Promise.reject({ response, isApiFailure: true })
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
