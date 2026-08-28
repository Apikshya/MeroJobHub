import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getJobs, createJob, updateJob, deleteJob, JOB_TYPES, JOB_STATUSES } from '../../api/jobsApi';
import { getCompanyByCode } from '../../api/companiesApi';
import { useAuth } from '../../context/AuthContext';

function buildEmptyForm(companyCode, companyName) {
  return {
    title: '',
    description: '',
    company_Name: companyName || '',
    company_code: companyCode || '',
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
  };
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
  };
}

// The backend is expected to scope job/get-all (and add/update/delete) to the
// logged-in COMPANY_ADMIN's own company automatically based on their token —
// this page doesn't do any client-side filtering by company.
export default function ManageJobs() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(buildEmptyForm());
  const [saving, setSaving] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [deleteRemarks, setDeleteRemarks] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadJobs = () => {
    setLoading(true);
    getJobs()
      .then((res) => setJobs(res.data?.data?.jobs || []))
      .catch(() => toast.error('Could not load jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
    if (user?.system_code) {
      getCompanyByCode(user.system_code)
        .then((res) => setCompany(res.data?.data?.dto || null))
        .catch(() => toast.error('Could not load your company details'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.system_code]);

  const openAddModal = () => {
    setEditingJob(null);
    setForm(buildEmptyForm(user?.system_code, company?.company_name));
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setForm(jobToForm(job));
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Salary validation
    if (name === 'min_Salary' || name === 'max_Salary') {
      if (value !== '' && (Number(value) < 0 || Number(value) > 10000000)) {
        return;
      }
    }

    // Vacancy validation
    if (name === 'vacancy_Count') {
      if (value !== '' && (Number(value) < 1 || Number(value) > 10000)) {
        return;
      }
    }

    // Expiry date validation (cannot be in the past)
    if (name === 'expiry_Date') {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        return;
      }
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        min_Salary: Number(form.min_Salary),
        max_Salary: Number(form.max_Salary),
        vacancy_Count: Number(form.vacancy_Count),
        expiry_Date: form.expiry_Date ? `${form.expiry_Date}T23:59:59.000Z` : '',
      };
      if (editingJob) {
        await updateJob({ id: editingJob.id, ...payload });
        toast.success('Job updated');
      } else {
        delete payload.status;
        await createJob(payload);
        toast.success('Job created');
      }
      setModalOpen(false);
      loadJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (job) => {
    setDeletingJob(job);
    setDeleteRemarks('');
  };

  const confirmDelete = async () => {
    if (!deleteRemarks.trim()) {
      toast.error('Please give a reason for deleting this job');
      return;
    }
    setDeleting(true);
    try {
      await deleteJob(deletingJob.id, deleteRemarks);
      toast.success('Job deleted');
      setDeletingJob(null);
      loadJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (status) => {
    const config = {
      OPEN: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Open' },
      CLOSED: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: 'Closed' },
      EXPIRED: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Expired' },
    };
    const style = config[status] || { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', label: status };
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.text.replace('text-', 'bg-')}`}></span>
        {style.label}
      </span>
    );
  };

  // Helper for avatar initials
  const getInitials = (title) => title?.charAt(0).toUpperCase() || '?';

  // Format salary
  const formatSalary = (num) => num?.toLocaleString() || '';

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Gradient header */}
        <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-white">Manage Jobs</h1>
          <button
            onClick={openAddModal}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-4 py-2 rounded-full shadow-sm transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Job
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50/50">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mt-1"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {getInitials(job.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className="font-semibold text-gray-800 text-lg truncate">{job.title}</h2>
                        {statusBadge(job.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-500">{job.company_name}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-500">{job.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                          {job.job_type?.replace('_', ' ')}
                        </span>
                        {job.category && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
                            📂 {job.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          💰 NPR {formatSalary(job.min_salary)} – {formatSalary(job.max_salary)}
                        </span>
                        <span>🎯 {job.experience_required || 'Any'}</span>
                        <span>📚 {job.qualification || 'N/A'}</span>
                        <span>👥 {job.vacancy_count}</span>
                        <span>📅 Expires: {job.expiry_date?.substring(0, 10) || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setViewingJob(job)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(job)}
                      className="text-sm font-medium text-amber-600 hover:text-amber-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(job)}
                      className="text-sm font-medium text-red-600 hover:text-red-800 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
{modalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 max-h-[90vh] overflow-y-auto animate-fade-in-up ">
      <div className="sticky top-0 z-10 h-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6 m-4">
        <h2 className="text-xl font-bold text-white">
          {editingJob ? 'Update Job' : 'Create Job'}
        </h2>
      </div>
      <form onSubmit={handleSave} className="p-5 bg-gray-50/50 m-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Title – full width */}
          <Field
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="sm:col-span-2 lg:col-span-3"
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />

          {/* Description – full width */}
          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="sm:col-span-2 lg:col-span-3"
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
          />

          {/* Company info – full width, more compact */}
          <div className="sm:col-span-2 lg:col-span-3 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm text-gray-700 flex flex-wrap items-center gap-1">
            <span>Posting as</span>
            <span className="font-semibold text-gray-800">{form.company_Name || '—'}</span>
            <span className="text-gray-400">({form.company_code || '—'})</span>
          </div>

          {/* Location – full width */}
          <Field
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="sm:col-span-2 lg:col-span-3"
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />

          {/* Job type */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Job type
            </label>
            <select
              name="job_Type"
              value={form.job_Type}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <Field
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Software"
            required
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
          />

          {/* Experience required */}
          <Field
            label="Experience"
            name="experience_Required"
            value={form.experience_Required}
            onChange={handleChange}
            placeholder="e.g. 3-5 years"
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />

          {/* Status (only when editing) – can be in same row */}
          {editingJob && (
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* If not editing, we can push vacancy count to third column? We'll put qualification full-width later */}

          {/* Qualification – full width */}
          <Field
            label="Qualification"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            className="sm:col-span-2 lg:col-span-3"
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          />

          {/* Skills required – full width */}
          <Field
            label="Skills required"
            name="skills_Required"
            value={form.skills_Required}
            onChange={handleChange}
            placeholder="Comma separated"
            className="sm:col-span-2 lg:col-span-3"
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />

          {/* Min salary, Max salary, Vacancy count – all in one row */}
          <Field
            label="Min salary"
            name="min_Salary"
            type="number"
            min={0}
            max={10000000}
            step="1"
            value={form.min_Salary}
            onChange={handleChange}
            required
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
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
            required
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
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
            required
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />

          {/* Expiry date – can be alone or alongside other fields; we'll make it full width for date picker, or we can put it in a 3rd column with something else? */}
          <Field
            label="Expiry date"
            name="expiry_Date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={form.expiry_Date}
            onChange={handleChange}
            required
            className="sm:col-span-2 lg:col-span-3"
            icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />

          {/* Action buttons – full width */}
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

      {/* View Modal */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 animate-fade-in-up">
            <div className="h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center justify-between px-6">
              <h2 className="text-xl font-bold text-white truncate">{viewingJob.title}</h2>
              {statusBadge(viewingJob.status)}
            </div>
            <div className="p-6 bg-gray-50/50">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                <span>{viewingJob.company_name}</span>
                <span className="text-gray-300">·</span>
                <span>{viewingJob.location}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {viewingJob.job_type?.replace('_', ' ')}
                </span>
                {viewingJob.category && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
                    📂 {viewingJob.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line mb-5">{viewingJob.description}</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="Job ID" value={viewingJob.id} />
                <DetailRow label="Status" value={viewingJob.status} />
                <DetailRow label="Experience" value={viewingJob.experience_required} />
                <DetailRow label="Qualification" value={viewingJob.qualification} />
                <DetailRow
                  label="Skills"
                  value={viewingJob.skills_required}
                  className="sm:col-span-2"
                />
                <DetailRow
                  label="Salary range"
                  value={`NPR ${formatSalary(viewingJob.min_salary)} – ${formatSalary(viewingJob.max_salary)}`}
                />
                <DetailRow label="Vacancies" value={viewingJob.vacancy_count} />
                <DetailRow label="Posted" value={viewingJob.posted_date?.substring(0, 10)} />
                <DetailRow label="Expires" value={viewingJob.expiry_date?.substring(0, 10)} />
              </dl>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setViewingJob(null);
                    openEditModal(viewingJob);
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

      {/* Delete Modal */}
      {deletingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-t-2xl flex items-center px-6">
              <h2 className="text-xl font-bold text-white">Delete this job?</h2>
            </div>
            <div className="p-6 bg-gray-50/50">
              <p className="text-sm text-gray-600 mb-4">
                You're about to delete <span className="font-semibold text-gray-800">“{deletingJob.title}”</span>. This
                action cannot be undone.
              </p>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reason for deletion
              </label>
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
  );
}

// Helper components
function DetailRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{label}</dt>
      <dd className="text-sm font-medium text-gray-800 mt-0.5">{value || '-'}</dd>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', className = '', icon }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, required = false, className = '', icon }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={3}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  );
}