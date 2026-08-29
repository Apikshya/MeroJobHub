import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCompanyByCode, updateCompany } from '../../api/companiesApi';
import { useAuth } from '../../context/AuthContext';
import { INDUSTRY_TYPES, COMPANY_TYPES, COMPANY_SIZES } from '../../api/companyOptions';
import { validatePhoneNumber } from '../../utils/validators';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Receipt,
  User,
  Briefcase,
  Calendar,
  Users,
  PieChart,
  Factory,
  Share2,
  Link2,
  ArrowLeft,
  Save,
} from 'lucide-react';

const emptyForm = {
  company_name: '',
  email_id: '',
  phone_number: '',
  website: '',
  industry_type: '',
  company_type: '',
  registration_number: '',
  tax_number: '',
  company_size: '',
  employee_count: '',
  founded_year: '',
  contact_person_name: '',
  contact_person_designation: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  description: '',
  linkedin_url: '',
  facebook_url: '',
  twitter_url: '',
};

export default function EditCompany() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const companyCode = user?.system_code;
    if (!companyCode) {
      setLoading(false);
      toast.error('No company code linked with this account');
      return;
    }

    getCompanyByCode(companyCode)
      .then((res) => {
        const data = res.data?.data?.dto;
        if (data) {
          setCompanyId(data.id);
          setForm({
            company_name: data.company_name || '',
            email_id: data.email_id || '',
            phone_number: data.phone_number || '',
            website: data.website || '',
            industry_type: data.industry_type || '',
            company_type: data.company_type || '',
            registration_number: data.registration_number || '',
            tax_number: data.tax_number || '',
            company_size: data.company_size || '',
            employee_count: data.employee_count ?? '',
            founded_year: data.founded_year ?? '',
            contact_person_name: data.contact_person_name || '',
            contact_person_designation: data.contact_person_designation || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            postal_code: data.postal_code || data.postalCode || '',
            description: data.description || '',
            linkedin_url: data.linkedin_url || '',
            facebook_url: data.facebook_url || '',
            twitter_url: data.twitter_url || '',
          });
        }
      })
      .catch(() => toast.error('Could not load company details'))
      .finally(() => setLoading(false));
  }, [user?.system_code]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'founded_year' && value.length > 4) return;
    if (name === 'phone_number' && !/^\+?\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const phoneError = validatePhoneNumber(form.phone_number);
    if (phoneError) {
      toast.error(phoneError);
      return false;
    }

    const nameParts = form.contact_person_name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      toast.error('Please enter at least first and last name for Contact Person');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        id: companyId,
        ...form,
        employee_count: form.employee_count ? Number(form.employee_count) : null,
        founded_year: form.founded_year ? Number(form.founded_year) : null,
        postalCode: form.postal_code,
      };

      await updateCompany(payload);
      toast.success('Company updated successfully');
      navigate('/company/company-info');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update company');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-2xl w-full"></div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/company/company-info')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563eb] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Company Info
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Company Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Update your organization details, contact information, and public presence.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Basic Company Info */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2563eb]" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Company Name"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                required
                placeholder="e.g. Acme Corporation"
                icon={<Building2 className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="Official Email"
                name="email_id"
                type="email"
                value={form.email_id}
                onChange={handleChange}
                required
                placeholder="contact@company.com"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                placeholder="+977 98XXXXXXXX / 071XXXXXX"
                icon={<Phone className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="Website URL"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
                icon={<Globe className="w-4 h-4 text-slate-400" />}
              />
            </div>
          </div>

          {/* Section 2: Industry & Organization */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Factory className="w-4 h-4 text-[#2563eb]" />
              Organization Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                  <Factory className="w-4 h-4 text-slate-400" />
                  Industry Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="industry_type"
                  value={form.industry_type}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                >
                  <option value="">Select industry</option>
                  {INDUSTRY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Company Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="company_type"
                  value={form.company_type}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                >
                  <option value="">Select company type</option>
                  {COMPANY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                  <PieChart className="w-4 h-4 text-slate-400" />
                  Company Size
                </label>
                <select
                  name="company_size"
                  value={form.company_size}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                >
                  <option value="">Select company size</option>
                  {COMPANY_SIZES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="Employee Count"
                name="employee_count"
                type="number"
                min={1}
                value={form.employee_count}
                onChange={handleChange}
                placeholder="e.g. 50"
                icon={<Users className="w-4 h-4 text-slate-400" />}
              />

              <Field
                label="Founded Year"
                name="founded_year"
                type="number"
                min={1800}
                max={new Date().getFullYear()}
                value={form.founded_year}
                onChange={handleChange}
                placeholder="e.g. 2018"
                icon={<Calendar className="w-4 h-4 text-slate-400" />}
              />

              <Field
                label="Registration No."
                name="registration_number"
                value={form.registration_number}
                onChange={handleChange}
                placeholder="e.g. REG-12345"
                icon={<FileText className="w-4 h-4 text-slate-400" />}
              />

              <Field
                label="Tax / PAN No."
                name="tax_number"
                value={form.tax_number}
                onChange={handleChange}
                placeholder="e.g. PAN-98765"
                icon={<Receipt className="w-4 h-4 text-slate-400" />}
              />
            </div>
          </div>

          {/* Section 3: Contact Person */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#2563eb]" />
              Primary Contact Person
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Contact Person Name"
                name="contact_person_name"
                value={form.contact_person_name}
                onChange={handleChange}
                required
                placeholder="First and Last Name"
                icon={<User className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="Designation"
                name="contact_person_designation"
                value={form.contact_person_designation}
                onChange={handleChange}
                placeholder="e.g. HR Manager / Director"
                icon={<Briefcase className="w-4 h-4 text-slate-400" />}
              />
            </div>
          </div>

          {/* Section 4: Location */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2563eb]" />
              Location & Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Street Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. Ward-3, Main Street"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Butwal / Kathmandu"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="State / Province"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. Lumbini Province"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="e.g. Nepal"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
              />
              <Field
                label="Postal Code"
                name="postal_code"
                value={form.postal_code}
                onChange={handleChange}
                placeholder="e.g. 32900"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
              />
            </div>
          </div>

          {/* Section 5: Description & Socials */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#2563eb]" />
              Description & Online Profiles
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Company Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what your organization does..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field
                  label="LinkedIn URL"
                  name="linkedin_url"
                  value={form.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/..."
                  icon={<Link2 className="w-4 h-4 text-slate-400" />}
                />
                <Field
                  label="Facebook URL"
                  name="facebook_url"
                  value={form.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  icon={<Share2 className="w-4 h-4 text-slate-400" />}
                />
                <Field
                  label="Twitter / X URL"
                  name="twitter_url"
                  value={form.twitter_url}
                  onChange={handleChange}
                  placeholder="https://x.com/..."
                  icon={<Share2 className="w-4 h-4 text-slate-400" />}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/company/company-info')}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-5 py-2.5 rounded-xl text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', icon, min, max }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
      />
    </div>
  );
}
