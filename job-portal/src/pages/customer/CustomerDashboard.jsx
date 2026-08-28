import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyProfile } from '../../api/profileApi';
import { getJobs } from '../../api/jobsApi';
import { getDocumentsByEmail } from '../../api/documentsApi';
import { getMyApplications } from '../../api/applicationsApi';
import { CheckCircle, FileText, Briefcase, ShieldCheck } from 'lucide-react';

const STATUS_STYLES = {
  APPLIED: { bar: '#2563eb', label: 'Applied' },
  SHORTLISTED: { bar: '#d97706', label: 'Shortlisted' },
  SELECTED: { bar: '#059669', label: 'Selected' },
  REJECTED: { bar: '#dc2626', label: 'Rejected' },
  WITHDRAWN: { bar: '#94a3b8', label: 'Withdrawn' },
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
            <div className="bg-gray-100 rounded-xl p-4 h-40"></div>
            <div className="bg-gray-100 rounded-xl p-4 h-40"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Main card container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Gradient header */}
        <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center px-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50/50">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon={<CheckCircle className="w-5 h-5 text-blue-500" />}
              label="Applications sent"
              value={applications.length}
            />
            <MetricCard
              icon={<FileText className="w-5 h-5 text-purple-500" />}
              label="Documents on file"
              value={documents.length}
            />
            <MetricCard
              icon={<Briefcase className="w-5 h-5 text-green-500" />}
              label="Open jobs"
              value={openJobsCount}
            />
            <MetricCard
              icon={<ShieldCheck className="w-5 h-5 text-amber-500" />}
              label="Profile complete"
              value={`${profileCompletion}%`}
            />
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status bars */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Application Status</h2>
              {statusEntries.length === 0 ? (
                <p className="text-sm text-gray-400">
                  You haven't applied to any jobs yet.{' '}
                  <Link to="/customer/jobs" className="text-blue-600 font-medium hover:underline">
                    Browse open jobs
                  </Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {statusEntries.map(([status, count]) => {
                    const style = STATUS_STYLES[status] || { bar: '#3b82f6', label: status };
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{style.label}</span>
                          <span className="font-medium text-gray-800">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full transition-all duration-300"
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

            {/* Recent applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">Recent Applications</h2>
                <Link
                  to="/customer/applications"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </div>
              {recentApplications.length === 0 ? (
                <p className="text-sm text-gray-400">No applications yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentApplications.map((app) => {
                    const style = STATUS_STYLES[app.status] || { label: app.status };
                    return (
                      <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{app.job_title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(app.applied_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{
                            backgroundColor: `${style.bar}1a`,
                            color: style.bar,
                            border: `1px solid ${style.bar}30`,
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