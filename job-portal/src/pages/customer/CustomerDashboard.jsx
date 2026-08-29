import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyProfile } from '../../api/profileApi';
import { getJobs } from '../../api/jobsApi';
import { getDocumentsByEmail } from '../../api/documentsApi';
import { getMyApplications } from '../../api/applicationsApi';
import { CheckCircle, FileText, Briefcase, ShieldCheck, ArrowRight, TrendingUp, Sparkles, Clock, Send, Star, Award, XCircle, Undo2 } from 'lucide-react';

const STATUS_STYLES = {
  APPLIED: { bar: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Applied', icon: Send },
  SHORTLISTED: { bar: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Shortlisted', icon: Star },
  SELECTED: { bar: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: 'Selected', icon: Award },
  REJECTED: { bar: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Rejected', icon: XCircle },
  WITHDRAWN: { bar: '#64748b', bg: '#f8fafc', border: '#e2e8f0', label: 'Withdrawn', icon: Undo2 },
};

const PROFILE_FIELDS = ['first_name', 'last_name', 'email', 'phone_number', 'age', 'address'];

// Built entirely from data already available elsewhere in the app — no dedicated
// dashboard-summary endpoint. Profile from /profile, jobs from /job/get-all, documents
// from /document/email/{email}, applications from /job-application/get-my-applications.
export default function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [openJobsCount, setOpenJobsCount] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getMyProfile()
      .then((res) => setProfile(res.data?.data?.my_profile || null))
      .catch((err) => console.error('Failed to load profile:', err));

    getJobs()
      .then((res) => {
        const jobs = res.data?.data?.jobs || [];
        setOpenJobsCount(jobs.filter((j) => j.status === 'OPEN').length);
      })
      .catch((err) => console.error('Failed to load jobs:', err));

    getMyApplications()
      .then((res) => setApplications(res.data?.data?.recent_applications || []))
      .catch((err) => {
        console.error('Failed to load applications:', err);
        toast.error('Could not load your applications');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Documents depend on the profile's email, so fetched once profile resolves
  useEffect(() => {
    if (!profile?.email) return;
    getDocumentsByEmail(profile.email)
      .then((res) => setDocuments(res.data?.data?.documents || []))
      .catch((err) => console.error('Failed to load documents:', err));
  }, [profile?.email]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const filled = PROFILE_FIELDS.filter(
      (f) => profile[f] !== undefined && profile[f] !== null && profile[f] !== ''
    );
    return Math.round((filled.length / PROFILE_FIELDS.length) * 100);
  }, [profile]);

  const statusEntries = useMemo(() => {
    const counts = {};
    applications.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return Object.entries(counts);
  }, [applications]);

  const maxCount = Math.max(1, ...statusEntries.map(([, count]) => count));

  const recentApplications = useMemo(
    () => [...applications].sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date)).slice(0, 5),
    [applications]
  );

  const greetingName = profile?.first_name || 'Job Seeker';

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 bg-blue-100/80 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200/80 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-gray-200/80 rounded-2xl"></div>
          <div className="h-72 bg-gray-200/80 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Hero Blue Banner Card */}
      <div className="rounded-2xl p-7 text-white shadow-md bg-gradient-to-br from-[#1d4ed8] via-[#2054e8] to-[#3b6af5] relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-widest text-white/90 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome Back
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hello, {greetingName}!
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Track your job applications and explore new career opportunities.
            </p>
          </div>

          {/* Quick Stats inside banner */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
              <p className="text-2xl font-extrabold text-white">{applications.length}</p>
              <p className="text-[11px] text-white/70 font-medium mt-0.5">Applied</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
              <p className="text-2xl font-extrabold text-white">
                {applications.filter((a) => a.status === 'SELECTED').length}
              </p>
              <p className="text-[11px] text-white/70 font-medium mt-0.5">Selected</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
              <p className="text-2xl font-extrabold text-white">{openJobsCount}</p>
              <p className="text-[11px] text-white/70 font-medium mt-0.5">Open Jobs</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-center min-w-[80px]">
              <p className="text-2xl font-extrabold text-white">{profileCompletion}%</p>
              <p className="text-[11px] text-white/70 font-medium mt-0.5">Profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Applications Sent"
          value={applications.length}
          accent="#2563eb"
          bg="#eff6ff"
        />
        <MetricCard
          icon={<FileText className="w-5 h-5" />}
          label="Documents on File"
          value={documents.length}
          accent="#8b5cf6"
          bg="#f5f3ff"
        />
        <MetricCard
          icon={<Briefcase className="w-5 h-5" />}
          label="Available Jobs"
          value={openJobsCount}
          accent="#059669"
          bg="#ecfdf5"
        />
        <MetricCard
          icon={<ShieldCheck className="w-5 h-5" />}
          label="Profile Completed"
          value={`${profileCompletion}%`}
          accent="#d97706"
          bg="#fffbeb"
        />
      </div>

      {/* 3. Two-column layout: Status Breakdown & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-800">Application Status Overview</h2>
              <span className="text-xs text-slate-400 font-medium">
                {applications.length} total
              </span>
            </div>

            {statusEntries.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-slate-400">You haven't applied to any jobs yet.</p>
                <Link
                  to="/customer/jobs"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] mt-2 transition"
                >
                  Browse Open Jobs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {statusEntries.map(([status, count]) => {
                  const style = STATUS_STYLES[status] || { bar: '#2563eb', label: status };
                  const pct = Math.round((count / applications.length) * 100);
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center text-sm mb-1.5">
                        <span className="font-semibold text-slate-700">{style.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{pct}%</span>
                          <span className="font-bold text-slate-900">{count}</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(count / maxCount) * 100}%`,
                            backgroundColor: style.bar,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Looking for new opportunities?</span>
            <Link
              to="/customer/jobs"
              className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] inline-flex items-center gap-1 transition"
            >
              Explore Job Feed <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Applications card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Recent Applications</h2>
              <Link
                to="/customer/applications"
                className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition"
              >
                View all
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No recent applications to display.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentApplications.map((app) => {
                  const style = STATUS_STYLES[app.status] || {
                    bar: '#2563eb',
                    bg: '#eff6ff',
                    border: '#bfdbfe',
                    label: app.status,
                  };
                  return (
                    <div key={app.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {app.job_title}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(app.applied_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap border flex-shrink-0"
                        style={{
                          backgroundColor: style.bg,
                          color: style.bar,
                          borderColor: style.border,
                        }}
                      >
                        {style.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Keep your documents updated</span>
            <Link
              to="/customer/documents"
              className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] inline-flex items-center gap-1 transition"
            >
              Manage Documents <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
        <div className="h-1 rounded-full w-2/3" style={{ background: accent, opacity: 0.5 }} />
      </div>
    </div>
  );
}