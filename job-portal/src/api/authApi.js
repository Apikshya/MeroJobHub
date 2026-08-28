import axiosInstance from './axiosInstance'

// Customer self-registration only
export const signup = (payload) => axiosInstance.post('/auth/signup', payload)

// Shared login for both ADMIN and CUSTOMER — role comes back in response
export const login = (payload) => axiosInstance.post('/auth/login', payload)
