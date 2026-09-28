import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCompanyByCode } from '../../api/companiesApi';
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
  FileText,
  Receipt,
  User,
  Briefcase,
  Link2,
  Share2,
  MapPin,
  Edit3,
} from 'lucide-react';

export default function MyCompany() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const companyCode = user?.system_code;
    if (!companyCode) {
      setLoading(false);
      setError(true);
      return;
    }
    getCompanyByCode(companyCode)
      .then((res) => setCompany(res.data?.data?.dto || null))
      .catch(() => toast.error('Could not load your company details'))
      .finally(() => setLoading(false));
  }, [user?.system_code]);

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

  if (error || !company) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <h1 className="text-xl font-bold text-slate-800 mb-2">My Company</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your account isn't linked to a company code yet, so we can't look up your company automatically.
          Please contact an administrator to have your account associated with a company.
        </p>
      </div>
    );
  }

  const fields = [
    { label: 'EMAIL', value: company.email_id, icon: <Mail className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'PHONE', value: company.phone_number, icon: <Phone className="w-4 h-4 text-[#059669]" /> },
    { label: 'INDUSTRY', value: company.industry_type, icon: <Factory className="w-4 h-4 text-[#d97706]" /> },
    { label: 'COMPANY TYPE', value: company.company_type, icon: <Building2 className="w-4 h-4 text-[#7c3aed]" /> },
    { label: 'COMPANY SIZE', value: company.company_size, icon: <PieChart className="w-4 h-4 text-[#0284c7]" /> },
    { label: 'EMPLOYEES', value: company.employee_count, icon: <Users className="w-4 h-4 text-[#ec4899]" /> },
    { label: 'CONTACT PERSON', value: company.contact_person_name, icon: <User className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'CONTACT DESIGNATION', value: company.contact_person_designation, icon: <Briefcase className="w-4 h-4 text-[#7c3aed]" /> },
    { label: 'FOUNDED', value: company.founded_year, icon: <Calendar className="w-4 h-4 text-[#ea580c]" /> },
    { label: 'REGISTRATION NO.', value: company.registration_number, icon: <FileText className="w-4 h-4 text-[#64748b]" /> },
    { label: 'TAX NO.', value: company.tax_number, icon: <Receipt className="w-4 h-4 text-[#10b981]" /> },
    { label: 'WEBSITE', value: company.website, icon: <Globe className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'LINKEDIN', value: company.linkedin_url, icon: <Link2 className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'FACEBOOK', value: company.facebook_url, icon: <Share2 className="w-4 h-4 text-[#2563eb]" /> },
    { label: 'TWITTER', value: company.twitter_url, icon: <Share2 className="w-4 h-4 text-[#0284c7]" /> },
  ].filter(f => f.value !== undefined);

  return (
    <div className="space-y-6">
      {/* Top Company Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{company.company_name}</h1>
              {company.company_code && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {company.company_code}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1.5">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                {[company.address, company.city, company.state, company.country]
                  .filter(Boolean)
                  .join(', ') || 'Tilottama-3, Nepal'}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/company/edit-company')}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors self-start sm:self-center"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            Edit Company
          </button>
        </div>

        {company.description && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
            {company.description}
          </div>
        )}
      </div>

      {/* Company Overview Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-900 mb-6">Company Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          {fields.map(({ label, value, icon, className }) => (
            <div key={label} className={className || ''}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 tracking-wider">
                {icon}
                <span>{label}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-1 break-words">
                {value || '-'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}