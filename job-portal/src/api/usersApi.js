import axiosInstance from './axiosInstance'

export const getUsers = () => axiosInstance.get('/user/list')

// Add uses plain camelCase + password (this is how new logins get created)
export const createUser = (payload) => axiosInstance.post('/user', payload)

// Update uses mixed casing (first_Name, phone_Number, ...), no password/email
export const updateUser = (payload) => axiosInstance.put('/user/update', payload)

export const deleteUser = (id, remarks) => axiosInstance.delete('/user/delete', { data: { id, remarks } })
