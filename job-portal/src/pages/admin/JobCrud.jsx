import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getJobs, createJob, updateJob, deleteJob, JOB_TYPES, JOB_STATUSES } from '../../api/jobsApi'
import { getAllCompanies } from '../../api/companiesApi'
import { Plus } from 'lucide-react'

const emptyForm = {
  title: '',
  description: '',
  company_Name: '',
  company_code: '',
  location: '',
  job_Type: 'FULL_TIME',
  category: '',
  experience_Required: '',
  qualification: '',
  skills_Required: '',
  min_Salary: '',
  max_Salary: '',
  vacancy_Count: '',
  expiry_Date: '',
  status: 'OPEN',
}

function jobToForm(job) {
  return {
    id: job.id,
    title: job.title || '',
    description: job.description || '',
    company_Name: job.company_name || '',
    company_code: job.company_code || '',
    location: job.location || '',
    job_Type: job.job_type || 'FULL_TIME',
    category: job.category || '',
    experience_Required: job.experience_required || '',
    qualification: job.qualification || '',
    skills_Required: job.skills_required || '',
    min_Salary: job.min_salary ?? '',
    max_Salary: job.max_salary ?? '',
    vacancy_Count: job.vacancy_count ?? '',
    expiry_Date: job.expiry_date ? job.expiry_date.substring(0, 10) : '',
    status: job.status || 'OPEN',
  }
}

export default function JobCrud() {
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [viewingJob, setViewingJob] = useState(null)
  const [deletingJob, setDeletingJob] = useState(null)
  const [deleteRemarks, setDeleteRemarks] = useState('')
  const [deleting, setDeleting] = useState(false)

  const loadJobs = () => {
    setLoading(true)
    getJobs()
      .then((res) => setJobs(res.data?.data?.jobs || []))
      .catch(() => toast.error('Could not load jobs'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadJobs()
    getAllCompanies()
      .then((res) => setCompanies(res.data?.data?.dtos || []))
      .catch(() => toast.error('Could not load companies'))
  }, [])

  const handleCompanyChange = (e) => {
    const code = e.target.value
    const company = companies.find((c) => c.company_code === code)
    setForm({ ...form, company_code: code, company_Name: company?.company_name || '' })
  }

  const openAddModal = () => {
    setEditingJob(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (job) => {
    setEditingJob(job)
    setForm(jobToForm(job))
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'min_Salary' || name === 'max_Salary') {
      if (value !== '' && (Number(value) < 0 || Number(value) > 10000000)) return
    }
    if (name === 'vacancy_Count') {
      if (value !== '' && (Number(value) < 1 || Number(value) > 10000)) return
    }
    if (name === 'expiry_Date') {
      const today = new Date().toISOString().split('T')[0]
      if (value < today) return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        min_Salary: Number(form.min_Salary),
        max_Salary: Number(form.max_Salary),
        vacancy_Count: Number(form.vacancy_Count),
        expiry_Date: form.expiry_Date ? `${form.expiry_Date}T23:59:59.000Z` : '',
      }
      if (editingJob) {
        await updateJob({ id: editingJob.id, ...payload })
        toast.success('Job updated')
      } else {
        delete payload.status
        await createJob(payload)
        toast.success('Job created')
      }
      setModalOpen(false)
      loadJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const openDeleteModal = (job) => {
    setDeletingJob(job)
    setDeleteRemarks('')
  }

  const confirmDelete = async () => {
    if (!deleteRemarks.trim()) {
      toast.error('Please give a reason for deleting this job')
      return
    }
    setDeleting(true)
    try {
      await deleteJob(deletingJob.id, deleteRemarks)
      toast.success('Job deleted')
      setDeletingJob(null)
      loadJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const statusBadge = (status) => {
    const styles = {
      OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
      CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
      EXPIRED: 'bg-red-100 text-red-600 border-red-200',
    }
    const s = styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'
    return (
      <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${s}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* ——— Gradient header ——— */}
      <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6 rounded-t-2xl mb-4">
        <h1 className="text-2xl font-bold text-white">Manage Jobs</h1>
        <button
          onClick={openAddModal}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-4 py-2 rounded-full shadow-sm transition flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Create Job 
        </button>
      </div>

      {/* ——— Job cards ——— */}
      {loading ? (
        <p className="text-slate-500 m-4">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-gray-800">{job.title}</h2>
                {statusBadge(job.status)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {job.company_name} · {job.location}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {job.job_type?.replace('_', ' ')} · {job.category}
              </p>
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>
              <div className="text-xs text-gray-500 mt-3 space-y-0.5">
                <p>Salary: NPR {job.min_salary?.toLocaleString()} - {job.max_salary?.toLocaleString()}</p>
                <p>Experience: {job.experience_required || '-'}</p>
                <p>Qualification: {job.qualification || '-'}</p>
                <p className="line-clamp-1">Skills: {job.skills_required || '-'}</p>
                <p>Vacancies: {job.vacancy_count}</p>
                <p>Posted: {job.posted_date?.substring(0, 10) || '-'}</p>
                <p>Expires: {job.expiry_date?.substring(0, 10) || '-'}</p>
              </div>
              <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setViewingJob(job)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition px-2 py-1 rounded-full hover:bg-blue-50"
                >
                  View
                </button>
                <button
                  onClick={() => openEditModal(job)}
                  className="text-amber-600 hover:text-amber-800 text-sm font-semibold transition px-2 py-1 rounded-full hover:bg-amber-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(job)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold transition px-2 py-1 rounded-full hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-8">No jobs created yet.</p>
          )}
        </div>
      )}

      {/* ——— Add / Edit Modal (gradient header) ——— */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 z-10 h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6 m-4">
              <h2 className="text-xl font-bold text-white">
                {editingJob ? 'Update Job' : 'Create Job'}
              </h2>
            </div>
            <form onSubmit={handleSave} className="p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Title – full width */}
                <Field
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Senior Full Stack Developer"
                  required
                  className="sm:col-span-2 lg:col-span-3"
                />

                {/* Description – full width */}
                <TextArea
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, benefits, and what you're looking for in a candidate."
                  required
                  className="sm:col-span-2 lg:col-span-3"
                />

                {/* Company selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <select
                    name="company_code"
                    value={form.company_code}
                    onChange={handleCompanyChange}
                    className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.company_code} value={c.company_code}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  label="Company name"
                  name="company_Name"
                  value={form.company_Name}
                  onChange={handleChange}
                  placeholder="Acme Technologies Pvt. Ltd."
                  required
                />

                {/* Location – full width */}
                <Field
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="New York, NY or Remote"
                  required
                  className="sm:col-span-2 lg:col-span-3"
                />

                {/* Job type */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Job type</label>
                  <select
                    name="job_Type"
                    value={form.job_Type}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status (only when editing) */}
                {editingJob && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {JOB_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Field
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Software Development"
                  required
                />

                <Field
                  label="Experience required"
                  name="experience_Required"
                  value={form.experience_Required}
                  onChange={handleChange}
                  placeholder="3-5 years"
                />

                <Field
                  label="Qualification"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="Bachelor's degree in Computer Science"
                  className="sm:col-span-2 lg:col-span-3"
                />

                <Field
                  label="Skills required"
                  name="skills_Required"
                  value={form.skills_Required}
                  onChange={handleChange}
                  placeholder="React, Node.js, TypeScript, PostgreSQL"
                  className="sm:col-span-2 lg:col-span-3"
                />

                <Field
                  label="Min salary"
                  name="min_Salary"
                  type="number"
                  min={0}
                  max={10000000}
                  step="1"
                  value={form.min_Salary}
                  onChange={handleChange}
                  placeholder="60000"
                  required
                />

                <Field
                  label="Max salary"
                  name="max_Salary"
                  type="number"
                  min={0}
                  max={10000000}
                  step="1"
                  value={form.max_Salary}
                  onChange={handleChange}
                  placeholder="90000"
                  required
                />

                <Field
                  label="Vacancy count"
                  name="vacancy_Count"
                  type="number"
                  min={1}
                  max={10000}
                  step="1"
                  value={form.vacancy_Count}
                  onChange={handleChange}
                  placeholder="5"
                  required
                />

                <Field
                  label="Expiry date"
                  name="expiry_Date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.expiry_Date}
                  onChange={handleChange}
                  required
                  className="sm:col-span-2 lg:col-span-3"
                />

                {/* Buttons – full width */}
                <div className="flex gap-2 mt-2 sm:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ——— View Modal (gradient header) ——— */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 z-10 h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-white">{viewingJob.title}</h2>
                {statusBadge(viewingJob.status)}
              </div>
            </div>
            <div className="p-6 bg-gray-50/50">
              <p className="text-sm text-gray-500 mb-4">
                {viewingJob.company_name} · {viewingJob.location}
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line mb-5">{viewingJob.description}</p>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="Job ID" value={viewingJob.id} />
                <DetailRow label="Status" value={viewingJob.status} />
                <DetailRow label="Company code" value={viewingJob.company_code} />
                <DetailRow label="Job type" value={viewingJob.job_type?.replace('_', ' ')} />
                <DetailRow label="Category" value={viewingJob.category} />
                <DetailRow label="Experience required" value={viewingJob.experience_required} />
                <DetailRow label="Qualification" value={viewingJob.qualification} />
                <DetailRow label="Skills required" value={viewingJob.skills_required} className="sm:col-span-2" />
                <DetailRow
                  label="Salary range"
                  value={`NPR ${viewingJob.min_salary?.toLocaleString()} - ${viewingJob.max_salary?.toLocaleString()}`}
                />
                <DetailRow label="Vacancies" value={viewingJob.vacancy_count} />
                <DetailRow label="Posted date" value={viewingJob.posted_date?.substring(0, 10)} />
                <DetailRow label="Expiry date" value={viewingJob.expiry_date?.substring(0, 10)} />
              </dl>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setViewingJob(null)
                    openEditModal(viewingJob)
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  Edit this job
                </button>
                <button
                  onClick={() => setViewingJob(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ——— Delete Modal (red gradient header) ——— */}
      {deletingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-t-2xl flex items-center px-6">
              <h2 className="text-xl font-bold text-white">Delete this job?</h2>
            </div>
            <div className="p-6 bg-gray-50/50">
              <p className="text-sm text-gray-600 mb-4">
                You're about to delete <span className="font-semibold text-gray-800">“{deletingJob.title}”</span>. This can't be undone.
              </p>
              <label className="text-sm font-medium text-gray-700">Reason for deletion</label>
              <textarea
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                rows={3}
                value={deleteRemarks}
                onChange={(e) => setDeleteRemarks(e.target.value)}
                placeholder="e.g. Position filled, no longer needed"
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  {deleting ? 'Deleting...' : 'Delete job'}
                </button>
                <button
                  onClick={() => setDeletingJob(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
                >
                  Cancel
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
  )
}

// ——— Helper components ———

function DetailRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{label}</dt>
      <dd className="text-sm text-gray-800 mt-0.5 break-words">{value || '-'}</dd>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  )
}

function TextArea({ label, name, value, onChange, required = false, placeholder = '', className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        rows={3}
        placeholder={placeholder}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  )
}