import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getApplications, updateApplicationStatus, APPLICATION_STATUSES } from '../../api/applicationsApi'
import { getJobs } from '../../api/jobsApi'
import { getDocumentsByEmail } from '../../api/documentsApi'
import DocumentViewButton from '../../components/DocumentViewButton'
// import { useEffect, useMemo, useState } from 'react'
// import toast from 'react-hot-toast'
// import { getApplications, updateApplicationStatus, APPLICATION_STATUSES } from '../../api/applicationsApi'
// import { getJobs } from '../../api/jobsApi'
// import { getDocumentsByEmail } from '../../api/documentsApi'
// import DocumentViewButton from '../../components/DocumentViewButton'
import { Search, Filter } from 'lucide-react'

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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Job Applications Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Inspect candidate applications, uploaded resumes, documents, and manage status updates.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:bg-white transition"
            placeholder="Search by applicant name, email, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        {/* Status Filter with Filter Icon & Label */}
        <div className="relative flex items-center w-full sm:w-60">
          <Filter className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:bg-white transition text-gray-700 font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter by Status: All</option>
            {allStatuses.filter(s => s !== '').map((s) => (
              <option key={s} value={s}>Filter by Status: {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d4ed8]"></div>
            <p className="text-sm text-gray-500 mt-2">Loading applications...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Applicant</th>
                  <th className="py-3.5 px-4">Applied Job</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleApps.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-gray-900">{app.applicant_name}</p>
                      <p className="text-xs text-gray-500">{app.applicant_email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-800">{jobsById[app.job_id]?.title || `Job #${app.job_id}`}</p>
                      {jobsById[app.job_id]?.company_name && (
                        <p className="text-xs text-gray-400">{jobsById[app.job_id].company_name}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{statusBadge(app.status)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => openView(app)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                      >
                        Inspect Application
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleApps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      No applications match your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {viewingApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up overflow-hidden">
            <div className="sticky top-0 z-10 h-16 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] flex items-center justify-between px-6">
              <h2 className="text-lg font-bold text-white">{viewingApp.applicant_name}</h2>
              {statusBadge(viewingApp.status)}
            </div>

            <div className="p-6 bg-gray-50/50 space-y-4">
              <p className="text-sm text-gray-600">
                Applied for <span className="font-semibold text-gray-900">{jobsById[viewingApp.job_id]?.title || `Job #${viewingApp.job_id}`}</span>
                {jobsById[viewingApp.job_id]?.company_name && ` at ${jobsById[viewingApp.job_id].company_name}`}
              </p>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100">
                <DetailRow label="Application ID" value={viewingApp.id} />
                <DetailRow label="Applicant ID" value={viewingApp.applicant_id} />
                <DetailRow label="Email" value={viewingApp.applicant_email} />
                <DetailRow label="Phone" value={viewingApp.applicant_phone} />
                <DetailRow label="Resume File" value={viewingApp.resume_file_name} className="sm:col-span-2 font-mono text-xs" />
              </dl>

              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Cover letter</dt>
                <dd className="text-sm text-gray-700 whitespace-pre-line bg-white rounded-xl p-4 border border-gray-100 max-h-40 overflow-y-auto">
                  {viewingApp.cover_letter || 'No cover letter submitted.'}
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                  Applicant Documents
                </dt>
                {docsLoading ? (
                  <p className="text-sm text-gray-400">Loading documents...</p>
                ) : applicantDocs.length === 0 ? (
                  <p className="text-sm text-gray-400 bg-white p-3 rounded-xl border border-gray-100">No documents uploaded by this applicant.</p>
                ) : (
                  <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 bg-white">
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

              <div className="pt-2">
                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1 block">Update Application Status</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2563eb] bg-white font-medium text-gray-800"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value={viewingApp.status}>{viewingApp.status} (current status)</option>
                  {APPLICATION_STATUSES.filter((s) => s !== viewingApp.status).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleStatusSave}
                  disabled={saving}
                  className="flex-1 bg-[#1d4ed8] hover:bg-[#1e40af] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  {saving ? 'Saving Status...' : 'Save Status'}
                </button>
                <button
                  onClick={() => setViewingApp(null)}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
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