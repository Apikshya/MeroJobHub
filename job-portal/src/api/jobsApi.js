import axiosInstance from './axiosInstance'

export const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']
export const JOB_STATUSES = ['OPEN', 'CLOSED', 'EXPIRED']

// Shared (admin + customer)
export const getJobs = () => axiosInstance.get('/job/get-all')
export const getJobById = (id) => axiosInstance.get(`/job/get-by-id/${id}`)
export const applyToJob = (payload) => axiosInstance.post('/job-application/add', payload)

// Admin CRUD
export const createJob = (payload) => axiosInstance.post('/job/add', payload)
export const updateJob = (payload) => axiosInstance.put('/job/update', payload)
export const deleteJob = (id, remarks) => axiosInstance.delete('/job/delete', { data: { id, remarks } })
