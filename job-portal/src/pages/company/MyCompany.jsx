import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCompanyByCode } from '../../api/companiesApi';
import { useAuth } from '../../context/AuthContext';

// The COMPANY_ADMIN user object returns a "system_code" that maps to a company's
// company_code — that's the link used to look up their company below.
export default function MyCompany() {
  const { user } = useAuth();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.system_code]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="flex flex-col items-center -mt-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mt-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mt-2"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Company</h1>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <p className="text-sm text-gray-500">
            Your account isn't linked to a company code yet, so we can't look up your company automatically.
            Please contact an administrator to have your account associated with a company.
          </p>
        </div>
      </div>
    );
  }

  // Helper for avatar initial
  const initial = company.company_name?.charAt(0).toUpperCase() || '?';

  // Fields configuration with icons
  const fields = [
    { label: 'Email', value: company.email_id, icon: '📧' },
    { label: 'Phone', value: company.phone_number, icon: '📱' },
    { label: 'Website', value: company.website, icon: '🌐' },
    { label: 'Industry', value: company.industry_type, icon: '🏭' },
    { label: 'Company Type', value: company.company_type, icon: '🏢' },
    { label: 'Company Size', value: company.company_size, icon: '📊' },
    { label: 'Employees', value: company.employee_count, icon: '👥' },
    { label: 'Founded', value: company.founded_year, icon: '📅' },
    { label: 'Registration #', value: company.registration_number, icon: '📄' },
    { label: 'Tax #', value: company.tax_number, icon: '🧾' },
    { label: 'Contact Person', value: company.contact_person_name, icon: '👤' },
    { label: 'Contact Designation', value: company.contact_person_designation, icon: '💼' },
    { label: 'LinkedIn', value: company.linkedin_url, icon: '🔗', className: 'sm:col-span-2' },
    { label: 'Facebook', value: company.facebook_url, icon: '📘' },
    { label: 'Twitter', value: company.twitter_url, icon: '🐦' },
  ];

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

        {/* Company header */}
     {/* Company header */}
<div className="relative px-6 pb-6 m-4">   {/* 👈 added m-4 for spacing around */}
  <div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:gap-5">
    {/* Avatar */}
    <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
      {initial}
    </div>
    <div className="mt-3 sm:mt-0 text-center sm:text-left flex-1">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <h1 className="text-3xl font-bold text-gray-800">  {/* 👈 increased from text-2xl to text-3xl */}
          {company.company_name}
        </h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
          {company.company_code}
        </span>
      </div>
      <p className="text-base text-gray-500 mt-1">  {/* 👈 increased from text-sm to text-base */}
        {company.address}, {company.city}, {company.state}, {company.country} {company.postal_code}
      </p>
    </div>
  </div>
</div>
{/* Description */}
<div className="m-4 border-t border-gray-100 px-6 py-4 bg-gray-50/50">
  <p className="text-base text-gray-700">{company.description}</p>  {/* increased from text-sm */}
</div>

{/* Details grid */}
<div className="m-4 px-6 py-5 bg-white">
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
    {fields.map(({ label, value, icon, className }) => (
      <div key={label} className={className || ''}>
        <dt className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1">
          <span>{icon}</span> {label}
        </dt>
        <dd className="text-base font-medium text-gray-800 mt-0.5 break-words">  {/* increased from text-sm */}
          {value || '-'}
        </dd>
      </div>
    ))}
  </dl>
</div>
      </div>
    </div>
  );
}