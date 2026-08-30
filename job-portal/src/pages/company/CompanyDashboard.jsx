import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getCompanyByCode } from '../../api/companiesApi';
import { getJobs } from '../../api/jobsApi';
import { getApplications } from '../../api/applicationsApi';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, CheckCircle, Users, User, MapPin, TrendingUp, Building2, Hash } from 'lucide-react';

const APP_STATUS_COLORS = {
  APPLIED: '#3146d9',
  SHORTLISTED: '#d97706',
  SELECTED: '#22c55e',
  REJECTED: '#dc2626',
  WITHDRAWN: '#94a3b8',
};

const JOB_STATUS_COLORS = {
  OPEN: '#2563eb',
  CLOSED: '#94a3b8',
  EXPIRED: '#dc2626',
};

// Aggregates company, jobs, and applications client-side for company dashboard
export default function CompanyDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (user?.system_code) {
      getCompanyByCode(user.system_code)
        .then((res) => setCompany(res.data?.data?.dto || null))
        .catch((err) => console.error('Failed to load company details:', err));
    }

    getJobs()
      .then((res) => setJobs(res.data?.data?.jobs || []))
      .catch((err) => {
        console.error('Failed to load jobs:', err);
        toast.error('Could not load job data');
      });

    getApplications()
      .then((res) => {
        const raw = res.data?.data;
        let apps = raw?.job_applications ?? raw?.jobApplications ?? raw?.applications ?? raw;
        if (apps && !Array.isArray(apps) && Array.isArray(apps.content)) apps = apps.content;
        setApplications(Array.isArray(apps) ? apps : []);
      })
      .catch((err) => {
        console.error('Failed to load applications:', err);
        toast.error('Could not load application data');
      })
      .finally(() => setLoading(false));
  }, [user?.system_code]);

  const stats = useMemo(() => {
    const openJobs = jobs.filter((j) => j.status === 'OPEN');
    const openVacancies = openJobs.reduce((sum, j) => sum + (j.vacancy_count || 0), 0);

    const jobsByStatus = ['OPEN', 'CLOSED', 'EXPIRED']
      .map((status) => ({ status, count: jobs.filter((j) => j.status === status).length }))
      .filter((row) => row.count > 0);

    const appsByStatusMap = {};
    applications.forEach((a) => {
      appsByStatusMap[a.status] = (appsByStatusMap[a.status] || 0) + 1;
    });
    const appsByStatus = Object.entries(appsByStatusMap).map(([status, count]) => ({ status, count }));

    return {
      totalJobs: jobs.length,
      openJobsCount: openJobs.length,
      openVacancies,
      totalApplicants: applications.length,
      jobsByStatus: jobsByStatus.length > 0 ? jobsByStatus : [{ status: 'OPEN', count: 0 }],
      appsByStatus: appsByStatus.length > 0 ? appsByStatus : [{ status: 'SELECTED', count: 0 }],
    };
  }, [jobs, applications]);

  const companyInitial =
    company?.company_name?.charAt(0)?.toUpperCase() ||
    user?.first_name?.charAt(0)?.toUpperCase() ||
    'A';

  const companyCode = company?.company_code || user?.system_code || 'ANN01';

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-blue-100/80 rounded-2xl w-full"></div>
        <div className="h-28 bg-gray-200/80 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200/80 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200/80 rounded-2xl"></div>
          <div className="h-80 bg-gray-200/80 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Hero Blue Banner — with inline stat pills */}
      <div className="rounded-2xl p-7 text-white shadow-md bg-gradient-to-br from-[#1d4ed8] via-[#2054e8] to-[#3b6af5] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Company Portal</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Overview of your recruitment activities</p>
          </div>
        </div>
      </div>

      {/* 2. Company Info Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-14 h-14 rounded-xl bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center text-2xl font-extrabold flex-shrink-0 shadow-inner">
          {companyInitial}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {company?.company_name || 'Annapurna Training Center'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
            {(company?.industry_type || company?.company_type) && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-[#2563eb]" />
                {[company?.industry_type, company?.company_type].filter(Boolean).join(' · ')}
              </span>
            )}
            {(company?.country || company?.city) && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                {company?.city || company?.country}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Hash className="w-3.5 h-3.5 text-[#2563eb]" />
              {companyCode}
            </span>
          </div>
        </div>
        <div className="sm:text-right">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe] px-3 py-1.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            Active Account
          </span>
        </div>
      </div>

      {/* 3. Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Briefcase className="w-5 h-5" />}
          label="Total Jobs"
          value={stats.totalJobs}
          accent="#2563eb"
          bg="#eff6ff"
        />
        <MetricCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Open Jobs"
          value={stats.openJobsCount}
          accent="#22c55e"
          bg="#f0fdf4"
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Open Vacancies"
          value={stats.openVacancies}
          accent="#f59e0b"
          bg="#fffbeb"
        />
        <MetricCard
          icon={<User className="w-5 h-5" />}
          label="Total Applicants"
          value={stats.totalApplicants}
          accent="#8b5cf6"
          bg="#f5f3ff"
        />
      </div>

      {/* 4. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-800">Jobs by Status</h2>
            <div className="flex items-center gap-3">
              {stats.jobsByStatus.map((e) => (
                <span key={e.status} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: JOB_STATUS_COLORS[e.status] || '#b4c6fc' }}
                  />
                  {e.status}
                </span>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.jobsByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="status"
                  axisLine={{ stroke: '#f1f5f9' }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax, 4)]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {stats.jobsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={JOB_STATUS_COLORS[entry.status] || '#b4c6fc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications by status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-800">Applications by Status</h2>
            <div className="flex flex-wrap items-center gap-3">
              {stats.appsByStatus.map((e) => (
                <span key={e.status} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: APP_STATUS_COLORS[e.status] || '#3146d9' }}
                  />
                  {e.status}
                </span>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.appsByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="status"
                  axisLine={{ stroke: '#f1f5f9' }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax, 4)]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {stats.appsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={APP_STATUS_COLORS[entry.status] || '#3146d9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, accent = '#2563eb', bg = '#eff6ff' }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
          style={{ background: bg, color: accent }}
        >
          {icon}
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
      </div>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value ?? 0}</p>
      <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
      <div className="mt-3 h-1 rounded-full w-full" style={{ background: bg }}>
        <div className="h-1 rounded-full w-2/3" style={{ background: accent, opacity: 0.4 }} />
      </div>
    </div>
  );
}