import axiosInstance from './axiosInstance'

export const getMyProfile = () => axiosInstance.get('/profile')

export const updateMyProfile = (payload) => axiosInstance.put('/profile/update-profile', payload)

export const resetPassword = (payload) => axiosInstance.post('/profile/reset-password', payload)

export const uploadCv = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return axiosInstance.post('/profile/cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}