import axiosInstance from './axiosInstance'

export const getAdminDashboard = () => axiosInstance.get('/dashboard/admin/summary')
export const getCompanyDashboard = () => axiosInstance.get('/dashboard/company/summary')
export const getCustomerDashboard = () => axiosInstance.get('/dashboard/customer/summary')
