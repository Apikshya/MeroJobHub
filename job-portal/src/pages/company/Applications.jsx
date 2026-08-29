import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getApplications, updateApplicationStatus, APPLICATION_STATUSES } from '../../api/applicationsApi';
import { getJobs } from '../../api/jobsApi';
import { Search } from 'lucide-react';
import { getDocumentsByEmail } from '../../api/documentsApi';
import DocumentViewButton from '../../components/DocumentViewButton';

// The backend is expected to scope job-application/get-all to jobs belonging to
// the logged-in COMPANY_ADMIN's own company automatically — no client-side filtering here.
export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobsById, setJobsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewingApp, setViewingApp] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [applicantDocs, setApplicantDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    getApplications()
      .then((res) => {
        const apps = res.data?.data?.job_applications ?? res.data?.data?.jobApplications ?? res.data?.data?.applications ?? [];
        if (!Array.isArray(apps)) {
          console.error('Unexpected applications response shape:', res.data);
        }
        setApplications(Array.isArray(apps) ? apps : []);
      })
      .catch((err) => {
        console.error('Failed to load applications:', err);
        toast.error(err.response?.data?.message || 'Could not load applications');
      })
      .finally(() => setLoading(false));

    getJobs()
      .then((res) => {
        const jobs = res.data?.data?.jobs || [];
        setJobsById(Object.fromEntries(jobs.map((j) => [j.id, j])));
      })
      .catch((err) => {
        console.error('Failed to load jobs (job titles will show as "Job #id"):', err);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleApps = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((a) => {
      const job = jobsById[a.job_id];
      const matchesSearch =
        !term ||
        a.applicant_name?.toLowerCase().includes(term) ||
        a.applicant_email?.toLowerCase().includes(term) ||
        job?.title?.toLowerCase().includes(term);
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, jobsById, search, statusFilter]);

  const openView = (app) => {
    setViewingApp(app);
    setSelectedStatus(app.status);
    setApplicantDocs([]);
    setDocsLoading(true);
    getDocumentsByEmail(app.applicant_email)
      .then((res) => setApplicantDocs(res.data?.data?.documents || []))
      .catch(() => toast.error('Could not load applicant documents'))
      .finally(() => setDocsLoading(false));
  };

  const handleStatusSave = async () => {
    if (selectedStatus === viewingApp.status) {
      setViewingApp(null);
      return;
    }
    setSaving(true);
    try {
      await updateApplicationStatus({
        application_Id: viewingApp.id,
        job_Id: viewingApp.job_id,
        applicant_Id: viewingApp.applicant_id,
        applicant_Name: viewingApp.applicant_name,
        applicant_Email: viewingApp.applicant_email,
        applicant_Phone: viewingApp.applicant_phone,
        resume_File_Name: viewingApp.resume_file_name,
        cover_Letter: viewingApp.cover_letter,
        status: selectedStatus,
      });
      toast.success('Application status updated');
      setViewingApp(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status) => {
    const config = {
      APPLIED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
      SHORTLISTED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
      SELECTED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
      REJECTED: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
      WITHDRAWN: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' },
    };
    const style = config[status] || { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' };
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
        {status}
      </span>
    );
  };

  const getInitials = (name) => name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="space-y-6">
      
      {/* old Ui  */}
      {/* Blue Hero Banner */}
      {/* <div className="rounded-2xl px-8 py-6 text-white shadow-sm bg-gradient-to-r from-[#1d4ed8] to-[#2563eb]">
        <h1 className="text-3xl font-bold text-white tracking-tight">Applied Jobs</h1>
      </div> */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Applied Jobs</h1>
          <p className="text-sm text-slate-500 mt-0.5">See the applications that were applied for the jobs you have posted on this portal.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Search & Filter */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400"
              placeholder="Search applicant or job title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-44 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="APPLIED">Applied</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Application list */}
        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-5 animate-pulse border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/4 mt-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : visibleApps.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No applications found.</p>
          ) : (
            <div className="space-y-3">
              {visibleApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#dbeafe] text-[#2563eb] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {getInitials(app.applicant_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">{app.applicant_name}</p>
                          <p className="text-xs text-[#2563eb]">{app.applicant_email}</p>
                        </div>
                        {statusBadge(app.status)}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        Applied for{' '}
                        <span className="font-semibold text-slate-800">
                          {jobsById[app.job_id]?.title || `Job #${app.job_id}`}
                        </span>
                        {jobsById[app.job_id]?.company_name && (
                          <span className="text-slate-500"> · {jobsById[app.job_id].company_name}</span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>{app.resume_file_name || 'No resume'}</span>
                        <span className="text-slate-300">·</span>
                        <span>{new Date(app.applied_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => openView(app)}
                      className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewingApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 animate-fade-in-up">
            <div className="h-20 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] rounded-t-2xl flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(viewingApp.applicant_name)}
                </div>
                <h2 className="text-xl font-bold text-white">{viewingApp.applicant_name}</h2>
              </div>
              {statusBadge(viewingApp.status)}
            </div>

            <div className="p-6 bg-gray-50/50">
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Applied for{' '}
                  <span className="font-medium text-gray-800">
                    {jobsById[viewingApp.job_id]?.title || `Job #${viewingApp.job_id}`}
                  </span>
                  {jobsById[viewingApp.job_id]?.company_name && (
                    <span> · {jobsById[viewingApp.job_id].company_name}</span>
                  )}
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <DetailRow label="Application ID" value={viewingApp.id} />
                <DetailRow label="Applicant ID" value={viewingApp.applicant_id} />
                <DetailRow label="Email" value={viewingApp.applicant_email} />
                <DetailRow label="Phone" value={viewingApp.applicant_phone} />
                <DetailRow label="Resume file" value={viewingApp.resume_file_name} className="sm:col-span-2" />
              </dl>

              <div className="mb-4">
                <dt className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Cover letter</dt>
                <dd className="text-sm text-gray-700 whitespace-pre-line bg-white rounded-xl border border-gray-200 p-3 max-h-40 overflow-y-auto">
                  {viewingApp.cover_letter || '-'}
                </dd>
              </div>

              <div className="mb-4">
                <dt className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Documents on file
                </dt>
                {docsLoading ? (
                  <p className="text-sm text-gray-400">Loading documents...</p>
                ) : applicantDocs.length === 0 ? (
                  <p className="text-sm text-gray-400">No documents uploaded by this applicant.</p>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {applicantDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between gap-2 px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{doc.original_file_name}</p>
                          <p className="text-xs text-gray-400 uppercase">
                            {doc.file_type} · {doc.size_readable}
                          </p>
                        </div>
                        <DocumentViewButton fileName={doc.file_name} downloadName={doc.original_file_name} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Update status</label>
                <select
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value={viewingApp.status}>{viewingApp.status} (current)</option>
                  {APPLICATION_STATUSES.filter((s) => s !== viewingApp.status).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={handleStatusSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  {saving ? 'Saving...' : 'Save status'}
                </button>
                <button
                  onClick={() => setViewingApp(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

function DetailRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{label}</dt>
      <dd className="text-sm font-medium text-gray-800 mt-0.5">{value || '-'}</dd>
    </div>
  );
}