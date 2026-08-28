import axios from 'axios'
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999/api/v1'

// A plain axios instance with none of axiosInstance's interceptors —
// used for endpoints that must NOT carry a Bearer token (e.g. forgot/change password
// while logged out, where the person isn't authenticated yet).
const publicAxios = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export default publicAxios
