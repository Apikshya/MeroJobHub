import axiosInstance from './axiosInstance'

export const APPLICATION_STATUSES = ['SHORTLISTED', 'REJECTED', 'SELECTED', 'WITHDRAWN']

export const getApplications = () => axiosInstance.get('/job-application/get-all')
export const getMyApplications = () => axiosInstance.get('/job-application/get-my-applications')

export const updateApplicationStatus = (payload) => axiosInstance.put('/job-application/update', payload)
