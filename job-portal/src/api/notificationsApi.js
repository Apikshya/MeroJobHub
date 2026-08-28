import axiosInstance from './axiosInstance'

export const getMyNotifications = () => axiosInstance.get('/notification/get-my-notifications')

export const markNotificationAsRead = (id) => axiosInstance.put(`/notification/mark-as-read/${id}`)

export const markAllNotificationsAsRead = (username) =>
  axiosInstance.put(`/notification/mark-all-as-read?username=${encodeURIComponent(username)}`)
