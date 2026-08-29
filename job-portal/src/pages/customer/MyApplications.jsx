import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyApplications } from '../../api/applicationsApi';
import {
  Search,
  CalendarDays,
  Clock,
  Send,
  Star,
  Award,
  XCircle,
  Undo2,
  Folder,
  Pin,
  FileText,
  Briefcase,
} from 'lucide-react';

const STATUS_CONFIG = {
  APPLIED: {
    label: 'Applied',
    icon: Send,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    icon: Star,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  SELECTED: {
    label: 'Selected',
    icon: Award,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    icon: Undo2,
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data?.data?.recent_applications || []))
      .catch((err) => {
        console.error('Failed to load applications:', err);
        toast.error('Could not load your applications');
      })
      .finally(() => setLoading(false));
  }, []);

  const statuses = useMemo(() => [...new Set(applications.map((a) => a.status))], [applications]);

  const visibleApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications
      .filter(
        (a) =>
          !term ||
          a.job_title?.toLowerCase().includes(term) ||
          a.category?.toLowerCase().includes(term)
      )
      .filter((a) => !statusFilter || a.status === statusFilter)
      .sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date));
  }, [applications, search, statusFilter]);

  const getInitials = (title) => title?.charAt(0).toUpperCase() || '?';

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor the progress and hiring status of all your submitted job applications.
          </p>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400"
            placeholder="Search by job title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-48 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => {
            const config = STATUS_CONFIG[s] || { label: s };
            return (
              <option key={s} value={s}>
                {config.label || s}
              </option>
            );
          })}
        </select>
      </div>

      {/* Applications List */}
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
              </div>
            ))}
          </div>
        ) : visibleApplications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">No applications found</p>
            <p className="text-xs text-slate-400 mt-1">
              You haven't submitted applications matching the selected criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleApplications.map((app) => {
              const status = app.status;
              const config = STATUS_CONFIG[status] || {
                label: status,
                icon: Pin,
                bg: 'bg-slate-50',
                text: 'text-slate-700',
                border: 'border-slate-200',
                dot: 'bg-slate-400',
              };
              const StatusIcon = config.icon || Pin;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner">
                      {getInitials(app.job_title)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title & Status Badge */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-lg leading-snug truncate">
                          {app.job_title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} whitespace-nowrap`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                      </div>

                      {/* Category */}
                      {app.category && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-xs bg-[#eff6ff] text-[#2563eb] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
                            <Folder className="w-3 h-3" />
                            {app.category}
                          </span>
                        </div>
                      )}

                      {/* Description snippet */}
                      {app.description && (
                        <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {app.description}
                        </p>
                      )}

                      {/* Footer Details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          Applied on{' '}
                          {new Date(app.applied_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(app.applied_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {app.resume_file_name && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <FileText className="w-3.5 h-3.5 text-[#2563eb]" />
                              {app.resume_file_name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}