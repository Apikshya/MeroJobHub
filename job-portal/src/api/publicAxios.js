import axios from 'axios'
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1'

// A plain axios instance with none of axiosInstance's interceptors —
// used for endpoints that must NOT carry a Bearer token (e.g. forgot/change password
// while logged out, where the person isn't authenticated yet).
const publicAxios = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Handle business-level failures returned with HTTP 200 status (code: "FAILURE")
publicAxios.interceptors.response.use(
  (response) => {
    if (response.data && response.data.code && response.data.code !== 'SUCCESS') {
      return Promise.reject({ response, isApiFailure: true })
    }
    return response
  },
  (error) => Promise.reject(error)
)

export default publicAxios

