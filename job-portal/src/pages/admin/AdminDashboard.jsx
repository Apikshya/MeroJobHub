import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAdminDashboard } from '../../api/dashboardApi';
import { Users, Briefcase, FileText, Building2, ShieldCheck, TrendingUp, Sparkles, UserCheck } from 'lucide-react';

const JOB_STATUS_COLORS = { OPEN: '#2563eb', CLOSED: '#64748b', EXPIRED: '#ef4444' };
const APP_STATUS_COLORS = {
  APPLIED: '#2563eb',
  SHORTLISTED: '#0284c7',
  SELECTED: '#10b981',
  REJECTED: '#ef4444',
  WITHDRAWN: '#64748b',
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setSummary(res.data?.data || null))
      .catch(() => toast.error('Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1d4ed8]"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
        <p className="text-gray-500">No dashboard data available.</p>
      </div>
    );
  }

  const jobsByStatus = Object.entries(summary.jobs_by_status || {}).map(([status, count]) => ({ status, count }));
  const appsByStatus = Object.entries(summary.applications_by_status || {}).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Hero Royal Blue Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-white/90 mb-3 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" /> System Administrator
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Overview Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Monitor job portal metrics, user accounts, company registrations, and application activity in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
              <p className="text-xs text-blue-100">Total Users</p>
              <p className="text-xl font-bold text-white">{summary.total_users ?? 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
              <p className="text-xs text-blue-100">Total Companies</p>
              <p className="text-xl font-bold text-white">{summary.total_companies ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="w-5 h-5 text-blue-600" />}
          bgIcon="bg-blue-50"
          borderAccent="border-blue-500"
          label="Total Registered Users"
          value={summary.total_users}
        />
        <MetricCard
          icon={<Building2 className="w-5 h-5 text-indigo-600" />}
          bgIcon="bg-indigo-50"
          borderAccent="border-indigo-500"
          label="Total Companies"
          value={summary.total_companies}
        />
        <MetricCard
          icon={<Briefcase className="w-5 h-5 text-purple-600" />}
          bgIcon="bg-purple-50"
          borderAccent="border-purple-500"
          label="Total Jobs Created"
          value={summary.total_jobs}
        />
        <MetricCard
          icon={<FileText className="w-5 h-5 text-emerald-600" />}
          bgIcon="bg-emerald-50"
          borderAccent="border-emerald-500"
          label="Total Applications"
          value={summary.total_applications}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2563eb]" /> Jobs by Status
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {jobsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={JOB_STATUS_COLORS[entry.status] || '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2563eb]" /> Applications by Status
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {appsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={APP_STATUS_COLORS[entry.status] || '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Recent Applications
          </h2>
          <div className="divide-y divide-gray-100">
            {(summary.recent_applications || []).map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/50 px-2 rounded-xl transition">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{app.applicant_name}</p>
                  <p className="text-xs text-gray-500 truncate">{app.job_title}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                  {app.status}
                </span>
              </div>
            ))}
            {(!summary.recent_applications || summary.recent_applications.length === 0) && (
              <p className="text-sm text-gray-400 py-4 text-center">No recent applications.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" /> Recent Users
          </h2>
          <div className="divide-y divide-gray-100">
            {(summary.recent_users || []).map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/50 px-2 rounded-xl transition">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                  {u.user_type}
                </span>
              </div>
            ))}
            {(!summary.recent_users || summary.recent_users.length === 0) && (
              <p className="text-sm text-gray-400 py-4 text-center">No recent users.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, bgIcon, borderAccent, label, value }) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition group`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${borderAccent}`} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        <div className={`p-2.5 rounded-xl ${bgIcon} group-hover:scale-105 transition-transform`}>{icon}</div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold text-gray-900">{value ?? 0}</span>
      </div>
    </div>
  );
}
