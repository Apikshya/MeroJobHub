import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyApplications } from '../../api/applicationsApi';
import { Search, CalendarDays, Clock, Send, Star, Award, XCircle, Undo2, Folder, Pin } from 'lucide-react';

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
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    icon: Undo2,
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
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
      .filter((a) => !term || a.job_title?.toLowerCase().includes(term) || a.category?.toLowerCase().includes(term))
      .filter((a) => !statusFilter || a.status === statusFilter)
      .sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date));
  }, [applications, search, statusFilter]);

  const getInitials = (title) => title?.charAt(0).toUpperCase() || '?';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header with controls */}    
     <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              className="w-full sm:w-56 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Search jobs or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select
            className="w-full sm:w-44 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
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
      </div>

      {/* Application list */}
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
              <div className="flex justify-between items-center mt-3">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : visibleApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleApplications.map((app) => {
            const status = app.status;
            const config = STATUS_CONFIG[status] || { label: status, icon: Pin, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' };
            const StatusIcon = config.icon || Pin;
            return (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border border-gray-100 m-4"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {getInitials(app.job_title)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-800 text-lg truncate">{app.job_title}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} whitespace-nowrap`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </div>
                    {/* Category and Description */}
                    <div className="mt-2 space-y-1">
                      {app.category && (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-200">
                          <Folder className="w-3 h-3 text-gray-500" />
                          {app.category}
                        </span>
                      )}
                      {app.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(app.applied_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(app.applied_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}