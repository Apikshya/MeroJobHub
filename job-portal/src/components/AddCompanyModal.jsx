import { useState } from 'react'
import toast from 'react-hot-toast'
import { addCompany } from '../api/companiesApi'
import { INDUSTRY_TYPES, COMPANY_TYPES, COMPANY_SIZES } from '../api/companyOptions'
import { X } from 'lucide-react'

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
  logo: '',
  description: '',
  linkedin_url: '',
  facebook_url: '',
  twitter_url: '',
}

export default function AddCompanyModal({ isOpen, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const nameParts = form.contact_person_name.trim().split(/\s+/)
    if (nameParts.length < 2) {
      toast.error('Please enter at least first and last name for Contact Person')
      return false
    }
    return true
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'founded_year' && value.length > 4) return

    if (name === 'contact_person_name') {
      const trimmedValue = value.replace(/\s+/g, ' ').trim()
      setForm({ ...form, [name]: trimmedValue })
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        employee_count: Number(form.employee_count),
        founded_year: Number(form.founded_year),
      }
      await addCompany(payload)
      toast.success('Company registered successfully!')
      setForm(emptyForm)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add company')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* ——— Gradient header ——— */}
        <div className="sticky top-0 z-10 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl flex items-center justify-between px-6">
          <h2 className="text-xl font-bold text-white">Register a New Company</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ——— Form ——— */}
        <form onSubmit={handleSubmit} className="p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full width fields */}
            <Field
              label="Company name"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              placeholder="Acme Technologies Pvt. Ltd."
              required
              className="sm:col-span-2 lg:col-span-3"
            />

            <Field
              label="Email"
              name="email_id"
              type="email"
              value={form.email_id}
              onChange={handleChange}
              placeholder="hr@acme.com"
              required
            />

            <Field
              label="Phone number"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
              required
            />

            <Field
              label="Website"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://www.acme.com"
            />

            <Field
              label="Logo URL"
              name="logo"
              value={form.logo}
              onChange={handleChange}
              placeholder="https://www.acme.com/logo.png"
            />

            <Select
              label="Industry type"
              name="industry_type"
              value={form.industry_type}
              onChange={handleChange}
              required
              options={INDUSTRY_TYPES}
            />

            <Select
              label="Company type"
              name="company_type"
              value={form.company_type}
              onChange={handleChange}
              required
              options={COMPANY_TYPES}
            />

            <Field
              label="Registration number"
              name="registration_number"
              value={form.registration_number}
              onChange={handleChange}
              placeholder="REG-2026-001234"
            />

            <Field
              label="Tax number"
              name="tax_number"
              value={form.tax_number}
              onChange={handleChange}
              placeholder="TX123456789"
            />

            <Select
              label="Company size"
              name="company_size"
              value={form.company_size}
              onChange={handleChange}
              required
              options={COMPANY_SIZES}
            />

            <Field
              label="Employee count"
              name="employee_count"
              type="number"
              value={form.employee_count}
              onChange={handleChange}
              placeholder="150"
              min={1}
              required
            />

            <Field
              label="Founded year"
              name="founded_year"
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={form.founded_year}
              onChange={handleChange}
              placeholder="2020"
              required
            />

            <Field
              label="Contact person name"
              name="contact_person_name"
              value={form.contact_person_name}
              onChange={handleChange}
              placeholder="John Smith"
              required
              pattern="^\s*\S+(?:\s+\S+)+\s*$"
              title="Please enter at least first and last name."
            />

            <Field
              label="Contact person designation"
              name="contact_person_designation"
              value={form.contact_person_designation}
              onChange={handleChange}
              placeholder="HR Manager"
              required
            />

            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              required
              className="sm:col-span-2 lg:col-span-3"
            />

            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="New York"
            />

            <Field
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="California"
            />

            <Field
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="United States"
              required
            />

            <Field
              label="Postal code"
              name="postal_code"
              value={form.postal_code}
              onChange={handleChange}
              placeholder="10001"
            />

            <TextArea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe the company, products, services, and work culture."
              className="sm:col-span-2 lg:col-span-3"
            />

            <Field
              label="LinkedIn URL"
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/company/acme"
              className="sm:col-span-2 lg:col-span-3"
            />

            <Field
              label="Facebook URL"
              name="facebook_url"
              value={form.facebook_url}
              onChange={handleChange}
              placeholder="https://www.facebook.com/acme"
            />

            <Field
              label="Twitter/X URL"
              name="twitter_url"
              value={form.twitter_url}
              onChange={handleChange}
              placeholder="https://x.com/acme"
            />

            {/* Buttons – full width */}
            <div className="flex gap-2 mt-4 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
              >
                {saving ? 'Registering...' : 'Register Company'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

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
  )
}

function Select({ label, name, value, onChange, options, required = false, className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <select
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value
          const optLabel = typeof opt === 'string' ? opt : opt.label
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          )
        })}
      </select>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', className = '', min = 0 }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
      />
    </div>
  )
}

function TextArea({ label, name, value, onChange, required = false, className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        rows={3}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
      />
    </div>
  )
}
