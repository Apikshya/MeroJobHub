import axiosInstance from './axiosInstance'

export const addCompany = (payload) => axiosInstance.post('/company/add', payload)
export const getAllCompanies = () => axiosInstance.get('/company/all')
export const getCompanyByCode = (code) => axiosInstance.get(`/company/code/${encodeURIComponent(code)}`)
export const updateCompany = (payload) => axiosInstance.put('/company/update', payload)
export const deleteCompany = (id, remarks) => axiosInstance.delete('/company/delete', { data: { id, remarks } })
