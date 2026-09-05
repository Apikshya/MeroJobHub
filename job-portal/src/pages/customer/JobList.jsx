import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getJobs, applyToJob } from '../../api/jobsApi';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  CheckCircle,
  X,
  Banknote,
  Target,
  GraduationCap,
  CalendarDays,
  Briefcase,
  MapPin,
  Building2,
  Send,
  Users,
} from 'lucide-react';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);
  const [applyForm, setApplyForm] = useState({ resume_File_Name: '', cover_Letter: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getJobs()
      .then((res) => setJobs(res.data?.data?.jobs || []))
      .catch(() => toast.error('Could not load jobs'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return [...new Set(jobs.map((j) => j.category).filter(Boolean))];
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    const openJobs = jobs.filter((j) => j.status === 'OPEN');
    return openJobs.filter((j) => {
      const matchesSearch =
        !term ||
        j.title?.toLowerCase().includes(term) ||
        j.company_name?.toLowerCase().includes(term) ||
        j.location?.toLowerCase().includes(term) ||
        j.category?.toLowerCase().includes(term);
      const matchesCategory = !categoryFilter || j.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [jobs, search, categoryFilter]);

  const openApplyModal = (job) => {
    setApplyingJob(job);
    setApplyForm({ resume_File_Name: '', cover_Letter: '' });
  };

  const handleApplyFormChange = (e) =>
    setApplyForm({ ...applyForm, [e.target.name]: e.target.value });

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applyToJob({
        job_Id: applyingJob.id,
        applicant_Id: user.id,
        applicant_Name: user.full_name,
        applicant_Email: user.email,
        applicant_Phone: user.phone_number,
        resume_File_Name: applyForm.resume_File_Name,
        cover_Letter: applyForm.cover_Letter,
      });
      toast.success('Application submitted successfully!');
      setApplyingJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to get initials for avatar
  const getInitials = (name) => name?.charAt(0).toUpperCase() || '?';

  // Helper to format date to "time ago" style (simple)
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Browse Jobs</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Find the right job opportunity matching your skills and interests.
          </p>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400"
            placeholder="Search by job title, company, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative flex items-center w-full sm:w-60">
          <Filter className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <select
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 font-medium"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Filter by Category: All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                Filter by Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4 mt-1.5"></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mt-4"></div>
              </div>
            ))}
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">No jobs match your search</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or searching with different keywords.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 p-6"
              >
                {/* Top: Avatar, Company, Location, Type Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner">
                      {getInitials(job.company_name)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{job.company_name}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                        <span>·</span>
                        <span>{timeAgo(job.posted_date)}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] whitespace-nowrap">
                    {job.job_type?.replace('_', ' ') || 'FULL TIME'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Metadata Chips */}
                <div className="flex flex-wrap gap-2 mt-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    NPR {job.min_salary?.toLocaleString()} – {job.max_salary?.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    {job.experience_required || 'Any experience'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    {job.qualification || 'Any qualification'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
                    Apply by: {job.expiry_date?.substring(0, 10) || 'Open'}
                  </span>
                </div>

                {/* Skills tags */}
                {job.skills_required && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills_required.split(',').map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#eff6ff] text-[#2563eb] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: vacancies + apply button */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {job.vacancy_count} {job.vacancy_count > 1 ? 'vacancies' : 'vacancy'} available
                  </span>
                  <button
                    onClick={() => openApplyModal(job)}
                    className="inline-flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 animate-fade-in-up overflow-hidden">
            {/* Royal blue modal header */}
            <div className="h-16 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] flex items-center justify-between px-6">
              <h2 className="text-lg font-bold text-white">Apply for Position</h2>
              <button
                onClick={() => setApplyingJob(null)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Job summary pill */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900">{applyingJob.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{applyingJob.company_name}</span>
                  <span>·</span>
                  <span>{applyingJob.location}</span>
                </p>
              </div>

              {/* Applicant info card */}
              <div className="bg-[#eff6ff] rounded-xl p-4 border border-[#bfdbfe]">
                <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider mb-2">
                  Applicant Details
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center font-bold text-sm">
                    {getInitials(user?.full_name)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{user?.full_name}</p>
                    <p className="text-xs text-slate-600">{user?.email} · {user?.phone_number || 'No phone'}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={submitApplication} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Cover Letter <span className="text-xs text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                    name="cover_Letter"
                    rows={5}
                    placeholder="Tell the employer why you are a great fit for this position..."
                    value={applyForm.cover_Letter}
                    onChange={handleApplyFormChange}
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition text-sm"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
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