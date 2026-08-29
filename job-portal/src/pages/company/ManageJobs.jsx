import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getJobs, createJob, updateJob, deleteJob, JOB_TYPES, JOB_STATUSES } from '../../api/jobsApi';
import { getCompanyByCode } from '../../api/companiesApi';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, AlignLeft, MapPin, Briefcase, Tag, Clock, CheckCircle, BookOpen, Zap, DollarSign, Users, CalendarDays, Info, Folder, Banknote, Target, GraduationCap, Calendar } from 'lucide-react';

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
    <>
      <div className="space-y-6">
        {/* old UI header */}
        {/* Royal Blue Hero Banner */}
        {/* <div className="rounded-2xl px-8 py-6 text-white shadow-sm bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Jobs</h1>
          <button
            onClick={openAddModal}
            className="bg-white text-[#2563eb] hover:bg-slate-50 font-semibold px-5 py-2.5 rounded-full shadow-sm transition flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Job
          </button>
        </div> */}

         {/* Top Header Row with Title and + Add Job button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Jobs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage  the jobs that you have posted on our company portal.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Job
        </button>
      </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Content */}
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
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No jobs created yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 p-5"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#dbeafe] text-[#2563eb] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {getInitials(job.title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h2 className="font-semibold text-slate-900 text-base truncate">{job.title}</h2>
                          {statusBadge(job.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-sm text-slate-500">{job.company_name}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-sm text-slate-500">{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                            {job.job_type?.replace('_', ' ')}
                          </span>
                          {job.category && (
                            <span className="inline-flex items-center gap-1 text-xs bg-[#eff6ff] text-[#2563eb] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
                              <Folder className="w-3 h-3" />
                              {job.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{job.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                          <span className="inline-flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                            NPR {formatSalary(job.min_salary)} – {formatSalary(job.max_salary)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-rose-500" />
                            {job.experience_required || 'Any'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                            {job.qualification || 'N/A'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-purple-500" />
                            {job.vacancy_count}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            Expires: {job.expiry_date?.substring(0, 10) || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setViewingJob(job)}
                        className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(job)}
                        className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(job)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
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
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 z-10 h-16 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] rounded-t-2xl flex items-center px-6">
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
                  icon={<Search className="w-4 h-4 text-gray-400" />}
                />

                {/* Description – full width */}
                <TextArea
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="sm:col-span-2 lg:col-span-3"
                  icon={<AlignLeft className="w-4 h-4 text-gray-400" />}
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
                  icon={<MapPin className="w-4 h-4 text-gray-400" />}
                />

                {/* Job type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-gray-400" />
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
                  icon={<Tag className="w-4 h-4 text-gray-400" />}
                />

                {/* Experience required */}
                <Field
                  label="Experience"
                  name="experience_Required"
                  value={form.experience_Required}
                  onChange={handleChange}
                  placeholder="e.g. 3-5 years"
                  icon={<Clock className="w-4 h-4 text-gray-400" />}
                />

                {/* Status (only when editing) – can be in same row */}
                {editingJob && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
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
                  icon={<BookOpen className="w-4 h-4 text-gray-400" />}
                />

                {/* Skills required – full width */}
                <Field
                  label="Skills required"
                  name="skills_Required"
                  value={form.skills_Required}
                  onChange={handleChange}
                  placeholder="Comma separated"
                  className="sm:col-span-2 lg:col-span-3"
                  icon={<Zap className="w-4 h-4 text-gray-400" />}
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
                  icon={<DollarSign className="w-4 h-4 text-gray-400" />}
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
                  icon={<DollarSign className="w-4 h-4 text-gray-400" />}
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
                  icon={<Users className="w-4 h-4 text-gray-400" />}
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
                  icon={<CalendarDays className="w-4 h-4 text-gray-400" />}
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
            <div className="h-20 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] rounded-t-2xl flex items-center justify-between px-6">
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
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
                    <Folder className="w-3 h-3 text-blue-500" />
                    {viewingJob.category}
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
                <Info className="w-4 h-4 text-gray-400" />
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
    </>
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