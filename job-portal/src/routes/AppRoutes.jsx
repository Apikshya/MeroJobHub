import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

import CustomerLayout from '../layouts/CustomerLayout'
import AdminLayout from '../layouts/AdminLayout'
import CompanyAdminLayout from '../layouts/CompanyAdminLayout'
import ProtectedRoute from '../components/ProtectedRoute'

import MyProfile from '../pages/shared/MyProfile'
import EditProfile from '../pages/shared/EditProfile'
import ChangePassword from '../pages/shared/ChangePassword'

import CustomerDashboard from '../pages/customer/CustomerDashboard'
import JobList from '../pages/customer/JobList'
import MyDocuments from '../pages/customer/MyDocuments'
import MyApplications from '../pages/customer/MyApplications'

import AdminDashboard from '../pages/admin/AdminDashboard'
import UserList from '../pages/admin/UserList'
import JobCrud from '../pages/admin/JobCrud'
import Applications from '../pages/admin/Applications'
import Companies from '../pages/admin/Companies'

import CompanyDashboard from '../pages/company/CompanyDashboard'
import MyCompany from '../pages/company/MyCompany'
import EditCompany from '../pages/company/EditCompany'
import CompanyManageJobs from '../pages/company/ManageJobs'
import CompanyApplications from '../pages/company/Applications'
import CompanyUserList from '../pages/company/CompanyUserList'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Customer portal */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="jobs" element={<JobList />} />
        <Route path="applications" element={<MyApplications />} />
        {/* Profile routes */}
        <Route path="profile" element={<MyProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="upload-cv" element={<MyDocuments />} />
        <Route path="documents" element={<MyDocuments />} />
      </Route>

      {/* Admin portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="jobs" element={<JobCrud />} />
        <Route path="applications" element={<Applications />} />
        <Route path="companies" element={<Companies />} />
        {/* Profile routes */}
        <Route path="profile" element={<MyProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Company admin portal */}
      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRole="COMPANY_ADMIN">
            <CompanyAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="company-info" element={<MyCompany />} />
        <Route path="edit-company" element={<EditCompany />} />
        <Route path="users" element={<CompanyUserList />} />
        <Route path="jobs" element={<CompanyManageJobs />} />
        <Route path="applications" element={<CompanyApplications />} />
        {/* Profile routes */}
        <Route path="profile" element={<MyProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}