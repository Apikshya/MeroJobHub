import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getAdminDashboard } from '../../api/dashboardApi'

const JOB_STATUS_COLORS = { OPEN: '#059669', CLOSED: '#94a3b8', EXPIRED: '#dc2626' }
const APP_STATUS_COLORS = {
  APPLIED: '#2563eb',
  SHORTLISTED: '#059669',
  SELECTED: '#0f9d58',
  REJECTED: '#dc2626',
  WITHDRAWN: '#94a3b8',
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setSummary(res.data?.data || null))
      .catch(() => toast.error('Could not load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>
  if (!summary) return <p className="text-slate-500">No dashboard data available.</p>

  const jobsByStatus = Object.entries(summary.jobs_by_status || {}).map(([status, count]) => ({ status, count }))
  const appsByStatus = Object.entries(summary.applications_by_status || {}).map(([status, count]) => ({
    status,
    count,
  }))

  return (
       <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* ——— Gradient header ——— */}
      <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 m-4">
  <MetricCard icon="👥" label="Total users" value={summary.total_users} />
  <MetricCard icon="💼" label="Total jobs" value={summary.total_jobs} />
  <MetricCard icon="📄" label="Total applications" value={summary.total_applications} />
  <MetricCard icon="🏢" label="Total companies" value={summary.total_companies} />
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6  m-4">
        <div className="card">
          <h2 className="font-bold text-slate-800 mb-4">Jobs by status</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {jobsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={JOB_STATUS_COLORS[entry.status] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold text-slate-800 mb-4">Applications by status</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {appsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={APP_STATUS_COLORS[entry.status] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card m-4">
          <h2 className="font-bold text-slate-800 mb-3">Recent applications</h2>
          <div className="divide-y divide-slate-50">
            {(summary.recent_applications || []).map((app) => (
              <div key={app.id} className="py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{app.applicant_name}</p>
                  <p className="text-xs text-slate-400 truncate">{app.job_title}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 whitespace-nowrap">
                  {app.status}
                </span>
              </div>
            ))}
            {(!summary.recent_applications || summary.recent_applications.length === 0) && (
              <p className="text-sm text-slate-400 py-2">No recent applications.</p>
            )}
          </div>
        </div>

        <div className="card m-4">
          <h2 className="font-bold text-slate-800 mb-3">Recent users</h2>
          <div className="divide-y divide-slate-50">
            {(summary.recent_users || []).map((u) => (
              <div key={u.id} className="py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{u.full_name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 whitespace-nowrap">
                  {u.user_type}
                </span>
              </div>
            ))}
            {(!summary.recent_users || summary.recent_users.length === 0) && (
              <p className="text-sm text-slate-400 py-2">No recent users.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500 mb-1">
        <span className="mr-1">{icon}</span>
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-800">{value ?? '-'}</p>
    </div>
  )
}
