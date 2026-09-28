import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCompanyByCode, getAllCompanies } from '../../api/companiesApi';
import { getJobs, applyToJob, JOB_TYPES } from '../../api/jobsApi';
import { getMyApplications } from '../../api/applicationsApi';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Phone,
  Globe,
  Factory,
  Building2,
  PieChart,
  Users,
  Calendar,
  User,
  Briefcase,
  Link2,
  Share2,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Banknote,
  Target,
  GraduationCap,
  CalendarDays,
  Send,
  X
} from 'lucide-react';
import UserAvatar from '../../components/UserAvatar';

export default function CompanyDetail() {
  const { companyCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  
  const [applyingJob, setApplyingJob] = useState(null);
  const [applyForm, setApplyForm] = useState({ resume_File_Name: '', cover_Letter: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Try to get company by code, fallback to fetching all and finding
    getCompanyByCode(companyCode)
      .then((res) => setCompany(res.data?.data?.dto))
      .catch(() => {
        // Fallback
        getAllCompanies()
          .then((res) => {
            const all = res.data?.data?.dtos || [];
            const found = all.find(c => 
              c.company_code === companyCode || 
              String(c.id) === companyCode || 
              c.company_name?.toLowerCase() === companyCode?.toLowerCase()
            );
            if (found) setCompany(found);
            else toast.error('Company not found');
          })
          .catch(() => toast.error('Could not load company details'));
      })
      .finally(() => setLoading(false));
  }, [companyCode]);

  useEffect(() => {
    if (!company) return;
    setJobsLoading(true);
    Promise.allSettled([getJobs(), getMyApplications()])
      .then(([jobsRes, appsRes]) => {
        if (jobsRes.status === 'fulfilled') {
          const allJobs = jobsRes.value.data?.data?.jobs || [];
          // Filter jobs for this company
          const companyJobs = allJobs.filter(j => 
            j.company_code === company.company_code || 
            j.company_name === company.company_name
          );
          setJobs(companyJobs);
        }
        if (appsRes.status === 'fulfilled') {
          const apps = appsRes.value.data?.data?.recent_applications || [];
          const ids = new Set();
          apps.forEach((a) => {
            const jId = a.job_id ?? a.jobId;
            if (jId != null) ids.add(Number(jId));
          });
          setAppliedJobIds(ids);
        }
      })
      .catch(() => console.error('Could not load jobs or applications'))
      .finally(() => setJobsLoading(false));
  }, [company]);

  const isJobApplied = (job) => {
    if (!job || !job.id) return false;
    return appliedJobIds.has(Number(job.id));
  };

  const isJobExpired = (job) => {
    if (!job) return false;
    if (job.status === 'EXPIRED' || job.is_expired) return true;
    if (job.expiry_date) {
      const exp = new Date(job.expiry_date);
      return exp.getTime() < Date.now();
    }
    return false;
  };

  const openApplyModal = (job) => {
    if (isJobExpired(job)) {
      toast.error('This job has expired and is no longer accepting applications');
      return;
    }
    if (isJobApplied(job)) {
      toast.error('You have already applied for this job');
      return;
    }
    setApplyingJob(job);
    setApplyForm({ resume_File_Name: '', cover_Letter: '' });
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applyingJob) return;
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
      if (applyingJob?.id) setAppliedJobIds((prev) => new Set([...prev, Number(applyingJob.id)]));
      setApplyingJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Sort visible jobs: non-expired first, most recent first
  const visibleJobs = useMemo(() => {
    const displayableJobs = jobs.filter((j) => j.status !== 'CLOSED');
    return displayableJobs.sort((a, b) => {
      const aStr = String(a.posted_date || a.postedDate || '');
      const bStr = String(b.posted_date || b.postedDate || '');
      if (aStr && bStr && aStr !== bStr) {
        return aStr > bStr ? -1 : 1;
      }
      const dateA = new Date(aStr).getTime();
      const dateB = new Date(bStr).getTime();
      const vA = isNaN(dateA) ? 0 : dateA;
      const vB = isNaN(dateB) ? 0 : dateB;
      if (vB !== vA) return vB - vA;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  }, [jobs, appliedJobIds]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-72"></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-36 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-slate-800 mb-2">Company Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
          The company you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  // Explicitly excluding registration_number and tax_number (Private details)
  const fields = [
    { label: 'EMAIL', value: company.email_id || company.email, icon: <Mail className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'PHONE', value: company.phone_number || company.phone, icon: <Phone className="w-4 h-4 text-[#059669]" /> },
    { label: 'INDUSTRY', value: company.industry_type, icon: <Factory className="w-4 h-4 text-[#d97706]" /> },
    { label: 'COMPANY TYPE', value: company.company_type, icon: <Building2 className="w-4 h-4 text-[#7c3aed]" /> },
    { label: 'COMPANY SIZE', value: company.company_size, icon: <PieChart className="w-4 h-4 text-[#0284c7]" /> },
    { label: 'EMPLOYEES', value: company.employee_count, icon: <Users className="w-4 h-4 text-[#ec4899]" /> },
    { label: 'CONTACT PERSON', value: company.contact_person_name, icon: <User className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'CONTACT DESIGNATION', value: company.contact_person_designation, icon: <Briefcase className="w-4 h-4 text-[#7c3aed]" /> },
    { label: 'FOUNDED', value: company.founded_year, icon: <Calendar className="w-4 h-4 text-[#ea580c]" /> },
    { label: 'WEBSITE', value: company.website, icon: <Globe className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'LINKEDIN', value: company.linkedin_url, icon: <Link2 className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'FACEBOOK', value: company.facebook_url, icon: <Share2 className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'TWITTER', value: company.twitter_url, icon: <Share2 className="w-4 h-4 text-[#0284c7]" /> },
  ].filter(f => f.value !== undefined && f.value !== null && f.value !== '');

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Top Company Profile Card */}
      <div className="bg-[#4169E1] rounded-xl p-8 text-white shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{company.company_name}</h1>
          {company.company_code && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-sm">
              {company.company_code}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-blue-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-200" />
            <span>
              {[company.address, company.city, company.state, company.country]
                .filter(Boolean)
                .join(', ') || 'Location not specified'}
            </span>
          </div>
          {(company.email_id || company.email) && (
            <a
              href={`mailto:${company.email_id || company.email}`}
              className="flex items-center gap-1.5 text-blue-100 hover:text-white hover:underline transition"
              title={`Send email to ${company.email_id || company.email}`}
            >
              <Mail className="w-4 h-4 text-blue-200" />
              <span>{company.email_id || company.email}</span>
            </a>
          )}
          {(company.phone_number || company.phone) && (
            <a
              href={`tel:${company.phone_number || company.phone}`}
              className="flex items-center gap-1.5 text-blue-100 hover:text-white hover:underline transition"
            >
              <Phone className="w-4 h-4 text-blue-200" />
              <span>{company.phone_number || company.phone}</span>
            </a>
          )}
        </div>
      </div>

      {company.description && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6 text-sm text-slate-600 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900 mb-2">About Us</h3>
          {company.description}
        </div>
      )}

      {/* Overview Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-900 mb-6">Company Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          {fields.map(({ label, value, icon }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 tracking-wider">
                {icon}
                <span>{label}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-1 break-words">
                {label === 'WEBSITE' || label === 'LINKEDIN' || label === 'FACEBOOK' || label === 'TWITTER' ? (
                  <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {value}
                  </a>
                ) : label === 'EMAIL' ? (
                  <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>
                ) : label === 'PHONE' ? (
                  <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>
                ) : (
                  value
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          Open Positions at {company.company_name}
        </h2>
        {jobsLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mt-4"></div>
              </div>
            ))}
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">No active positions</p>
            <p className="text-xs text-slate-400 mt-1">Check back later for open roles.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span>·</span>
                      <span>{timeAgo(job.posted_date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] whitespace-nowrap">
                      {job.job_type?.replace('_', ' ') || 'FULL TIME'}
                    </span>
                  </div>
                </div>

                {/* Job Description */}
                {job.description && (
                  <p className="text-slate-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    NPR {job.min_salary?.toLocaleString()} – {job.max_salary?.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    {job.experience_required || 'Any experience'}
                  </span>
                  {job.qualification && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      {job.qualification}
                    </span>
                  )}
                  {isJobExpired(job) ? (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full">
                      <CalendarDays className="w-3.5 h-3.5 text-red-500" />
                      Expired: {job.expiry_date?.substring(0, 10) || 'Date passed'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
                      Apply by: {job.expiry_date?.substring(0, 10) || 'Open'}
                    </span>
                  )}
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

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {job.vacancy_count} {job.vacancy_count > 1 ? 'vacancies' : 'vacancy'}
                  </span>
                  {isJobApplied(job) ? (
                    <button disabled className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold px-5 py-2 rounded-xl cursor-not-allowed shadow-none select-none">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Applied
                    </button>
                  ) : isJobExpired(job) ? (
                    <button disabled className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold px-5 py-2 rounded-xl cursor-not-allowed shadow-none select-none">
                      Expired
                    </button>
                  ) : (
                    <button
                      onClick={() => openApplyModal(job)}
                      className="inline-flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm transition"
                    >
                      <Send className="w-3.5 h-3.5" /> Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setApplyingJob(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 animate-fade-in-up overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-16 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] flex items-center justify-between px-6">
              <h2 className="text-lg font-bold text-white">Apply for Position</h2>
              <button onClick={() => setApplyingJob(null)} className="text-white/80 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900">{applyingJob.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{company.company_name}</span><span>·</span><span>{applyingJob.location}</span>
                </p>
              </div>
              <div className="bg-[#eff6ff] rounded-xl p-4 border border-[#bfdbfe]">
                <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider mb-2">Applicant Details</p>
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} size="md" className="w-10 h-10 ring-2 ring-blue-100 shadow-sm" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{user?.full_name}</p>
                    <p className="text-xs text-slate-600">{user?.email} · {user?.phone_number || 'No phone'}</p>
                  </div>
                </div>
              </div>
              <form onSubmit={submitApplication} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Cover Letter <span className="text-xs text-slate-400 font-normal">(optional)</span></label>
                  <textarea
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                    name="cover_Letter" rows={5} placeholder="Tell the employer why you are a great fit for this position..."
                    value={applyForm.cover_Letter} onChange={(e) => setApplyForm({ ...applyForm, cover_Letter: e.target.value })}
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button type="submit" disabled={submitting} className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition text-sm">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" onClick={() => setApplyingJob(null)} className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
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
