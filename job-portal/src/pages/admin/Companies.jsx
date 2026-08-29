import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { addCompany, getAllCompanies, updateCompany, deleteCompany } from '../../api/companiesApi'
import { INDUSTRY_TYPES, COMPANY_TYPES, COMPANY_SIZES } from '../../api/companyOptions'
import { Plus } from 'lucide-react'
import { validatePhoneNumber } from '../../utils/validators'

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

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [viewingCompany, setViewingCompany] = useState(null)
  const [deletingCompany, setDeletingCompany] = useState(null)
  const [deleteRemarks, setDeleteRemarks] = useState('')
  const [deleting, setDeleting] = useState(false)

  const loadCompanies = () => {
    setLoading(true)
    getAllCompanies()
      .then((res) => setCompanies(res.data?.data?.dtos || []))
      .catch(() => toast.error('Could not load companies'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  const visibleCompanies = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return companies
    return companies.filter(
      (c) =>
        c.company_name?.toLowerCase().includes(term) ||
        c.company_code?.toLowerCase().includes(term) ||
        c.email_id?.toLowerCase().includes(term) ||
        c.city?.toLowerCase().includes(term)
    )
  }, [companies, search])

  const openAddModal = () => {
    setEditingCompany(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (company) => {
    setEditingCompany(company)
    setForm({ ...emptyForm, ...company })
    setModalOpen(true)
  }

  const validateForm = () => {
    const phoneError = validatePhoneNumber(form.phone_number)
    if (phoneError) {
      toast.error(phoneError)
      return false
    }

    const nameParts = form.contact_person_name.trim().split(/\s+/)
    if (nameParts.length < 2) {
      toast.error('Please enter at least first and last name at Contact Person')
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

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        employee_count: Number(form.employee_count),
        founded_year: Number(form.founded_year),
      }
      if (editingCompany) {
        const { postal_code, ...rest } = payload
        await updateCompany({ id: editingCompany.id, postalCode: postal_code, ...rest })
        toast.success('Company updated')
      } else {
        await addCompany(payload)
        toast.success('Company added')
      }
      setModalOpen(false)
      loadCompanies()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const openDeleteModal = (company) => {
    setDeletingCompany(company)
    setDeleteRemarks('')
  }

  const confirmDelete = async () => {
    if (!deleteRemarks.trim()) {
      toast.error('Please give a reason for deleting this company')
      return
    }
    setDeleting(true)
    try {
      await deleteCompany(deletingCompany.id, deleteRemarks)
      toast.success('Company deleted')
      setDeletingCompany(null)
      loadCompanies()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* ——— Gradient header ——— */}
      <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6 rounded-t-2xl mb-4">
        <h1 className="text-2xl font-bold text-white">Company Info</h1>
        <button
          onClick={openAddModal}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-4 py-2 rounded-full shadow-sm transition flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* ——— Search bar ——— */}
      <div className="m-4">
        <input
          className="input-field w-full sm:max-w-xs rounded-full pl-10 pr-4 py-2 bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name, code, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ——— Company cards ——— */}
      {loading ? (
        <p className="text-slate-500 m-4">Loading companies...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
          {visibleCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-gray-800">{company.company_name}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">
                  {company.company_code}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {company.city}, {company.country}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {company.industry_type} · {company.company_type}
              </p>
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{company.description}</p>
              <div className="text-xs text-gray-500 mt-3 space-y-0.5">
                <p>Contact: {company.contact_person_name}</p>
                <p>Email: {company.email_id}</p>
                <p>Employees: {company.employee_count}</p>
              </div>
              <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setViewingCompany(company)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition px-2 py-1 rounded-full hover:bg-blue-50"
                >
                  View
                </button>
                <button
                  onClick={() => openEditModal(company)}
                  className="text-amber-600 hover:text-amber-800 text-sm font-semibold transition px-2 py-1 rounded-full hover:bg-amber-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(company)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold transition px-2 py-1 rounded-full hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {visibleCompanies.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-8">No companies found.</p>
          )}
        </div>
      )}

      {/* ——— Add / Edit Modal (gradient header) ——— */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 z-10 h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6 m-4">
              <h2 className="text-xl font-bold text-white">
                {editingCompany ? 'Update Company' : 'Add Company'}
              </h2>
            </div>
            <form onSubmit={handleSave} className="p-6 bg-gray-50/50">
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
                  placeholder="Briefly describe your company, products, services, and work culture."
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

      {/* ——— View Modal (gradient header) ——— */}
      {viewingCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 z-10 h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-white">{viewingCompany.company_name}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  {viewingCompany.company_code}
                </span>
              </div>
            </div>
            <div className="p-6 bg-gray-50/50">
              <p className="text-sm text-gray-500 mb-4">
                {viewingCompany.address}, {viewingCompany.city}, {viewingCompany.state}, {viewingCompany.country}{' '}
                {viewingCompany.postal_code}
              </p>
              <p className="text-sm text-gray-700 mb-5">{viewingCompany.description}</p>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="Email" value={viewingCompany.email_id} />
                <DetailRow label="Phone" value={viewingCompany.phone_number} />
                <DetailRow label="Website" value={viewingCompany.website} />
                <DetailRow label="Industry type" value={viewingCompany.industry_type} />
                <DetailRow label="Company type" value={viewingCompany.company_type} />
                <DetailRow label="Company size" value={viewingCompany.company_size} />
                <DetailRow label="Employee count" value={viewingCompany.employee_count} />
                <DetailRow label="Founded year" value={viewingCompany.founded_year} />
                <DetailRow label="Registration number" value={viewingCompany.registration_number} />
                <DetailRow label="Tax number" value={viewingCompany.tax_number} />
                <DetailRow label="Contact person" value={viewingCompany.contact_person_name} />
                <DetailRow label="Contact designation" value={viewingCompany.contact_person_designation} />
                <DetailRow label="LinkedIn" value={viewingCompany.linkedin_url} className="sm:col-span-2" />
                <DetailRow label="Facebook" value={viewingCompany.facebook_url} />
                <DetailRow label="Twitter" value={viewingCompany.twitter_url} />
              </dl>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setViewingCompany(null)
                    openEditModal(viewingCompany)
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  Edit this company
                </button>
                <button
                  onClick={() => setViewingCompany(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ——— Delete Modal (red gradient header) ——— */}
      {deletingCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-t-2xl flex items-center px-6">
              <h2 className="text-xl font-bold text-white">Delete this company?</h2>
            </div>
            <div className="p-6 bg-gray-50/50">
              <p className="text-sm text-gray-600 mb-4">
                You're about to delete{' '}
                <span className="font-semibold text-gray-800">“{deletingCompany.company_name}”</span>. This can't be undone.
              </p>
              <label className="text-sm font-medium text-gray-700">Reason for deletion</label>
              <textarea
                className="input-field mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                rows={3}
                value={deleteRemarks}
                onChange={(e) => setDeleteRemarks(e.target.value)}
                placeholder="e.g. Duplicate entry, company closed"
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  {deleting ? 'Deleting...' : 'Delete company'}
                </button>
                <button
                  onClick={() => setDeletingCompany(null)}
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
    </div>
  )
}

// ——— Helper components (styled consistently) ———

function Select({ label, name, value, onChange, options, required = false, className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', className = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  )
}

function DetailRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{label}</dt>
      <dd className="text-sm text-gray-800 mt-0.5 break-words">{value || '-'}</dd>
    </div>
  )
}