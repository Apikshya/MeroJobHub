import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getCompanyByCode } from '../../api/companiesApi';
import { getJobs } from '../../api/jobsApi';
import { getApplications } from '../../api/applicationsApi';
import { useAuth } from '../../context/AuthContext';

const APP_STATUS_COLORS = {
  APPLIED: '#2563eb',
  SHORTLISTED: '#d97706',
  SELECTED: '#059669',
  REJECTED: '#dc2626',
  WITHDRAWN: '#94a3b8',
};

const JOB_STATUS_COLORS = { OPEN: '#059669', CLOSED: '#94a3b8', EXPIRED: '#dc2626' };

// Built entirely from data already available elsewhere in the app — no dedicated
// dashboard-summary endpoint. Company details from /company/code/{code}, jobs from
// /job/get-all, applications from /job-application/get-all — all aggregated client-side.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const jobTitleById = Object.fromEntries(jobs.map((j) => [j.id, j.title]));
    const appsPerJobMap = {};
    applications.forEach((a) => {
      appsPerJobMap[a.job_id] = (appsPerJobMap[a.job_id] || 0) + 1;
    });
    const appsPerJob = Object.entries(appsPerJobMap)
      .map(([jobId, count]) => ({ job: jobTitleById[jobId] || `Job #${jobId}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      totalJobs: jobs.length,
      openJobsCount: openJobs.length,
      openVacancies,
      totalApplicants: applications.length,
      jobsByStatus,
      appsByStatus,
      appsPerJob,
    };
  }, [jobs, applications]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-100 rounded-xl p-4 h-48"></div>
            <div className="bg-gray-100 rounded-xl p-4 h-48"></div>
          </div>
        </div>
      </div>
    );
  }

  // Helper for company avatar initial
  const companyInitial = company?.company_name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Gradient header */}
        <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          {company?.company_code && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
              {company.company_code}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50/50">
          {/* Company info card */}
          {company && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-sm">
                {companyInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-800 text-lg">{company.company_name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {company.industry_type} · {company.company_type} · {company.city}, {company.country}
                </p>
              </div>
            </div>
          )}

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon={
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              label="Total jobs"
              value={stats.totalJobs}
            />
            <MetricCard
              icon={
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Open jobs"
              value={stats.openJobsCount}
            />
            <MetricCard
              icon={
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              label="Open vacancies"
              value={stats.openVacancies}
            />
            <MetricCard
              icon={
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              label="Applicants"
              value={stats.totalApplicants}
            />
          </div>

          {/* Charts: two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Jobs by status</h2>
              {stats.jobsByStatus.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No jobs posted yet.</p>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.jobsByStatus}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {stats.jobsByStatus.map((entry) => (
                          <Cell key={entry.status} fill={JOB_STATUS_COLORS[entry.status] || '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Applications by status</h2>
              {stats.appsByStatus.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No applications received yet.</p>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.appsByStatus}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {stats.appsByStatus.map((entry) => (
                          <Cell key={entry.status} fill={APP_STATUS_COLORS[entry.status] || '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Most applied-to jobs chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
            <h2 className="font-semibold text-gray-800 mb-3">Most applied-to jobs</h2>
            {stats.appsPerJob.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No applications received yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.appsPerJob} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis type="category" dataKey="job" width={140} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value ?? '-'}</p>
    </div>
  );
}