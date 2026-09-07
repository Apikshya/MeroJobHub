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

export const uploadProfilePicture = (file) => {
  const formData = new FormData()
  formData.append('profilePicture', file)
  return axiosInstance.post('/profile-picture/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteProfilePicture = () => axiosInstance.delete('/profile-picture/delete')

export const getProfilePictureUrl = (userId, timestamp) => {
  if (!userId) return null
  const base = axiosInstance.defaults.baseURL || 'http://localhost:8081/api/v1'
  return `${base}/profile-picture/view/${userId}${timestamp ? `?t=${timestamp}` : ''}`
}