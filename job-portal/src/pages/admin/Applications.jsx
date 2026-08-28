import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getApplications, updateApplicationStatus, APPLICATION_STATUSES } from '../../api/applicationsApi'
import { getJobs } from '../../api/jobsApi'
import { getDocumentsByEmail } from '../../api/documentsApi'
import DocumentViewButton from '../../components/DocumentViewButton'

// Helper: status badge with consistent colors (like userTypeBadge)
const statusBadge = (status) => {
  const styles = {
    APPLIED: 'bg-blue-100 text-blue-700 border-blue-200',
    SHORTLISTED: 'bg-amber-100 text-amber-700 border-amber-200',
    SELECTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-100 text-red-600 border-red-200',
    WITHDRAWN: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  const s = styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${s}`}>
      {status}
    </span>
  )
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [jobsById, setJobsById] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewingApp, setViewingApp] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [applicantDocs, setApplicantDocs] = useState([])
  const [docsLoading, setDocsLoading] = useState(false)

  const loadData = () => {
    setLoading(true)
    Promise.all([getApplications(), getJobs()])
      .then(([appsRes, jobsRes]) => {
        setApplications(appsRes.data?.data?.job_applications || [])
        const jobs = jobsRes.data?.data?.jobs || []
        setJobsById(Object.fromEntries(jobs.map((j) => [j.id, j])))
      })
      .catch(() => toast.error('Could not load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const visibleApps = useMemo(() => {
    const term = search.trim().toLowerCase()
    return applications.filter((a) => {
      const job = jobsById[a.job_id]
      const matchesSearch =
        !term ||
        a.applicant_name?.toLowerCase().includes(term) ||
        a.applicant_email?.toLowerCase().includes(term) ||
        job?.title?.toLowerCase().includes(term)
      const matchesStatus = !statusFilter || a.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [applications, jobsById, search, statusFilter])

  const openView = (app) => {
    setViewingApp(app)
    setSelectedStatus(app.status)
    setApplicantDocs([])
    setDocsLoading(true)
    getDocumentsByEmail(app.applicant_email)
      .then((res) => setApplicantDocs(res.data?.data?.documents || []))
      .catch(() => toast.error('Could not load applicant documents'))
      .finally(() => setDocsLoading(false))
  }

  const handleStatusSave = async () => {
    if (selectedStatus === viewingApp.status) {
      setViewingApp(null)
      return
    }
    setSaving(true)
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
      })
      toast.success('Application status updated')
      setViewingApp(null)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status')
    } finally {
      setSaving(false)
    }
  }

  // Distinct statuses for the filter dropdown (including all possible ones)
  const allStatuses = ['', ...new Set(['APPLIED', ...APPLICATION_STATUSES])]

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* ——— Gradient header ——— */}
      <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center px-6 rounded-t-2xl mb-4">
        <h1 className="text-2xl font-bold text-white">Applied Jobs</h1>
      </div>

      {/* ——— Search & filter (with margin and same input styling) ——— */}
      <div className="flex flex-col sm:flex-row gap-3 m-4">
        <input
          className="input-field flex-1 sm:max-w-xs rounded-full pl-10 pr-4 py-2 bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Search applicant or job title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field sm:w-48 rounded-full px-4 py-2 bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {allStatuses.filter(s => s !== '').map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ——— Table (card with rounded corners and shadow) ——— */}
      <div className="card overflow-x-auto rounded-2xl shadow-lg border border-gray-100 m-4">
        {loading ? (
          <p className="text-slate-500 p-4">Loading applications...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 uppercase text-xs border-b border-slate-100">
                <th className="py-3 pr-4 pl-4">Applicant</th>
                <th className="py-3 pr-4">Job</th>
                <th className="py-3 pr-4">Resume</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleApps.map((app) => (
                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition">
                  <td className="py-3 pr-4 pl-4">
                    <p className="font-medium text-slate-800">{app.applicant_name}</p>
                    <p className="text-xs text-slate-400">{app.applicant_email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    {jobsById[app.job_id]?.title || `Job #${app.job_id}`}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500">
                    {app.resume_file_name || '-'}
                  </td>
                  <td className="py-3 pr-4">{statusBadge(app.status)}</td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() => openView(app)}
                      className="text-blue-600 hover:text-blue-800 transition px-2 py-1 rounded-full hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {visibleApps.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ——— View/Edit Modal (gradient header, full-width layout) ——— */}
      {viewingApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 z-10 h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-white">{viewingApp.applicant_name}</h2>
                {statusBadge(viewingApp.status)}
              </div>
            </div>

            <div className="p-6 bg-gray-50/50">
              <p className="text-sm text-gray-500 mb-4">
                Applied for <span className="font-medium text-gray-700">{jobsById[viewingApp.job_id]?.title || `Job #${viewingApp.job_id}`}</span>
                {jobsById[viewingApp.job_id]?.company_name && ` · ${jobsById[viewingApp.job_id].company_name}`}
              </p>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <DetailRow label="Application ID" value={viewingApp.id} />
                <DetailRow label="Applicant ID" value={viewingApp.applicant_id} />
                <DetailRow label="Email" value={viewingApp.applicant_email} />
                <DetailRow label="Phone" value={viewingApp.applicant_phone} />
                <DetailRow label="Resume file" value={viewingApp.resume_file_name} className="sm:col-span-2" />
              </dl>

              <div className="mb-4">
                <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">Cover letter</dt>
                <dd className="text-sm text-gray-700 whitespace-pre-line bg-white rounded-lg p-3 border border-gray-200 max-h-40 overflow-y-auto">
                  {viewingApp.cover_letter || '-'}
                </dd>
              </div>

              <div className="mb-4">
                <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">
                  Documents on file
                </dt>
                {docsLoading ? (
                  <p className="text-sm text-gray-400">Loading documents...</p>
                ) : applicantDocs.length === 0 ? (
                  <p className="text-sm text-gray-400">No documents uploaded by this applicant.</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
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
                  className="input-field mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value={viewingApp.status}>{viewingApp.status} (current)</option>
                  {APPLICATION_STATUSES.filter((s) => s !== viewingApp.status).map((s) => (
                    <option key={s} value={s}>{s}</option>
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

      {/* Animation keyframes (same as used elsewhere) */}
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
  )
}

// Reusable detail row component
function DetailRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{label}</dt>
      <dd className="text-sm text-gray-800 mt-0.5">{value || '-'}</dd>
    </div>
  )
}