import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getJobs, applyToJob } from '../../api/jobsApi';
import { useAuth } from '../../context/AuthContext';
import { Search, CheckCircle, X, Banknote, Target, GraduationCap, CalendarDays } from 'lucide-react';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const visibleJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    const openJobs = jobs.filter((j) => j.status === 'OPEN');
    if (!term) return openJobs;
    return openJobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(term) ||
        j.company_name?.toLowerCase().includes(term) ||
        j.location?.toLowerCase().includes(term) ||
        j.category?.toLowerCase().includes(term)
    );
  }, [jobs, search]);

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
      toast.success('Application submitted');
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header with search */}
       {/* ——— Gradient header ——— */}
       <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-white">Job Feed</h1>
        <div className="relative">
          <input
            className="w-full sm:w-72 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Job list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-5 animate-pulse m-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mt-1"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mt-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-1"></div>
            </div>
          ))}
        </div>
      ) : visibleJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jobs available right now.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {visibleJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border border-gray-100 m-4"
            >
              {/* Header: avatar + company info + badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {getInitials(job.company_name)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{job.company_name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <span>{timeAgo(job.posted_date)}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                  {job.job_type?.replace('_', ' ')}
                </span>
              </div>

              {/* Job title */}
              <h2 className="text-xl font-bold text-gray-800 mt-2">{job.title}</h2>

              {/* Description */}
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{job.description}</p>

              {/* Details as chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" /> NPR {job.min_salary?.toLocaleString()} – {job.max_salary?.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  <Target className="w-3.5 h-3.5 text-rose-500" /> {job.experience_required || 'No exp.'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> {job.qualification || 'Not specified'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  <CalendarDays className="w-3.5 h-3.5 text-amber-500" /> Apply by {job.expiry_date?.substring(0, 10) || 'N/A'}
                </span>
              </div>

              {/* Skills */}
              {job.skills_required && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.skills_required.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: vacancies + apply button */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {job.vacancy_count} {job.vacancy_count > 1 ? 'vacancies' : 'vacancy'}
                </span>
                <button
                  onClick={() => openApplyModal(job)}
                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-full transition shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal - styled like a direct message popup */}
    {/* Apply Modal - enlarged and clearer */}
{applyingJob && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 m-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in-up">
      {/* Close button */}
      <button
        onClick={() => setApplyingJob(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
          {getInitials(applyingJob.company_name)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{applyingJob.title}</h2>
          <p className="text-sm text-gray-500">{applyingJob.company_name}</p>
        </div>
      </div>

      {/* Applicant info - styled like a profile card */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
            {getInitials(user?.full_name)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.full_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-500">{user?.phone_number}</p>
          </div>
        </div>
      </div>

      {/* Application form */}
      <form onSubmit={submitApplication} className="space-y-4">
        {/* Resume file name (hidden as per original) */}
        <div className="hidden">
          <label className="text-sm font-medium text-gray-700">Resume file name</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="resume_File_Name"
            placeholder="e.g. john_sharma_resume.pdf"
            value={applyForm.resume_File_Name}
            onChange={handleApplyFormChange}
          />
          <p className="text-xs text-gray-400 mt-1">
            Upload your CV from the "Upload CV" page first, then enter its file name here.
          </p>
        </div>

        {/* Cover letter - enlarged */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Cover Letter <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[150px]"
            name="cover_Letter"
            rows={6}
            placeholder="Why are you a good fit for this role? Describe your relevant experience, skills, and motivation."
            value={applyForm.cover_Letter}
            onChange={handleApplyFormChange}
          />
          <p className="text-xs text-gray-400 mt-1">Write a compelling cover letter to impress the employer.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            type="button"
            onClick={() => setApplyingJob(null)}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* Animation keyframes (if not already in global) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}