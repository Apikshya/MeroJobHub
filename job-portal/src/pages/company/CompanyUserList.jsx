import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Info, Eye, Pencil, Trash2 } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/usersApi';
import { validatePhoneNumber } from '../../utils/validators';

const emptyAddForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  age: '',
  address: '',
  email: '',
  phoneNumber: '',
  password: '',
};

function userToUpdateForm(user) {
  return {
    id: user.id,
    first_Name: user.first_name || '',
    middle_Name: user.middle_name || '',
    last_Name: user.last_name || '',
    age: user.age ?? '',
    address: user.address || '',
    phone_Number: user.phone_number || '',
    user_type: user.user_type || '',
  };
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyAddForm);
  const [saving, setSaving] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteRemarks, setDeleteRemarks] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    getUsers()
      .then((res) => setUsers(res.data?.data?.users || []))
      .catch(() => toast.error('Could not load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !term ||
        u.full_name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);
      const matchesUserType = userType === 'ALL' || u.user_type === userType;
      return matchesSearch && matchesUserType;
    });
  }, [users, search, userType]);

  const openAddModal = () => {
    setEditingUser(null);
    setForm(emptyAddForm);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm(userToUpdateForm(user));
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber' || name === 'phone_Number') {
      if (!/^\+?\d{0,15}$/.test(value)) return;
    }
    if (name === 'address' && value.length > 255) return;
    if (name === 'password' && value.length > 64) return;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const phoneToValidate = editingUser ? form.phone_Number : form.phoneNumber;
    const phoneError = validatePhoneNumber(phoneToValidate);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        await updateUser({ ...form, age: Number(form.age) });
        toast.success('User updated');
      } else {
        await createUser({ ...form, age: Number(form.age) });
        toast.success('User added');
      }
      setModalOpen(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setDeleteRemarks('');
  };

  const confirmDelete = async () => {
    if (!deleteRemarks.trim()) {
      toast.error('Please give a reason for deleting this user');
      return;
    }
    setDeleting(true);
    try {
      await deleteUser(deletingUser.id, deleteRemarks);
      toast.success('User deleted');
      setDeletingUser(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <>
    <div className="space-y-6">
      {/* Top Header Row with Title and + Add User button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage individuals who have access to your company portal.</p>
        </div>
        {/* DISABLED since its wrongly working */}
        {/* <button
          onClick={openAddModal}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Company Staff
        </button> */}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-48 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="COMPANY_ADMIN">Company Admin</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading users...</div>
          ) : visibleUsers.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No users found.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {visibleUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#dbeafe] text-[#2563eb] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {getInitials(u.full_name)}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
                        {u.user_type?.replace('_', ' ') || 'COMPANY ADMIN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{u.phone_number || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingUser(u)}
                          title="View"
                          className="text-[#3b82f6] hover:text-[#1d4ed8] p-1.5 rounded-lg hover:bg-blue-50 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          title="Edit"
                          className="text-[#f59e0b] hover:text-[#d97706] p-1.5 rounded-lg hover:bg-amber-50 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(u)}
                          title="Delete"
                          className="text-[#ef4444] hover:text-[#dc2626] p-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">1</span> to{' '}
            <span className="font-semibold text-slate-700">{visibleUsers.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{users.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-400 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 animate-fade-in-up">
            <div className="h-20 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] rounded-t-2xl flex items-center px-6">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Update User' : 'Add User'}
              </h2>
            </div>
            <form onSubmit={handleSave} className="p-6 bg-gray-50/50">
              <div className="space-y-4">
                {editingUser ? (
                  <>
                    <Field label="First name" name="first_Name" value={form.first_Name} onChange={handleFormChange} placeholder="John" required />
                    <Field label="Middle name" name="middle_Name" value={form.middle_Name} onChange={handleFormChange} placeholder="Michael" />
                    <Field label="Last name" name="last_Name" value={form.last_Name} onChange={handleFormChange} placeholder="Smith" required />
                    <Field label="Age" name="age" type="number" min={16} max={100} value={form.age} onChange={handleFormChange} placeholder="25" required />
                    <Field label="Phone number" name="phone_Number" type="tel" value={form.phone_Number} onChange={handleFormChange} placeholder="+1 555 123 4567" required />
                    <Field label="Address" name="address" value={form.address} onChange={handleFormChange} placeholder="123 Main Street" required />
                  </>
                ) : (
                  <>
                    <Field label="First name" name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="John" required />
                    <Field label="Middle name" name="middleName" value={form.middleName} onChange={handleFormChange} placeholder="Michael" />
                    <Field label="Last name" name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Smith" required />
                    <Field label="Age" name="age" type="number" min={18} max={100} value={form.age} onChange={handleFormChange} placeholder="25" required />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="john@example.com" required />
                    <Field label="Phone number" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleFormChange} placeholder="+1 555 123 4567" required />
                    <Field label="Address" name="address" value={form.address} onChange={handleFormChange} placeholder="123 Main Street" required />
                    <Field label="Password" name="password" type="password" value={form.password} onChange={handleFormChange} placeholder="Min 8 chars" minLength={8} required />
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
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
            </form>
          </div>
        </div>
      )}

      {/* View Modal — gradient header */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 animate-fade-in-up">
            <div className="h-20 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] rounded-t-2xl flex items-center px-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(viewingUser.full_name)}
                </div>
                <h2 className="text-xl font-bold text-white">{viewingUser.full_name}</h2>
              </div>
            </div>
            <div className="p-6 bg-gray-50/50">
              <dl className="grid grid-cols-2 gap-4">
                <DetailRow label="User ID" value={viewingUser.id} />
                <DetailRow label="User Type" value={viewingUser.user_type} />
                <DetailRow label="First name" value={viewingUser.first_name} />
                <DetailRow label="Middle name" value={viewingUser.middle_name} />
                <DetailRow label="Last name" value={viewingUser.last_name} />
                <DetailRow label="Age" value={viewingUser.age} />
                <DetailRow label="Email" value={viewingUser.email} className="col-span-2" />
                <DetailRow label="Phone" value={viewingUser.phone_number} />
                <DetailRow label="Address" value={viewingUser.address} className="col-span-2" />
              </dl>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => { setViewingUser(null); openEditModal(viewingUser); }}
                  className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  Edit this user
                </button>
                <button
                  onClick={() => setViewingUser(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal — red gradient header */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-t-2xl flex items-center px-6">
              <h2 className="text-xl font-bold text-white">Delete this user?</h2>
            </div>
            <div className="p-6 bg-gray-50/50">
              <p className="text-sm text-gray-600 mb-4">
                You're about to delete <span className="font-semibold text-gray-800">“{deletingUser.full_name}”</span>. This action cannot be undone.
              </p>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-gray-400" />
                Reason for deletion
              </label>
              <textarea
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                rows={3}
                value={deleteRemarks}
                onChange={(e) => setDeleteRemarks(e.target.value)}
                placeholder="e.g. Duplicate account, requested by user"
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
                >
                  {deleting ? 'Deleting...' : 'Delete user'}
                </button>
                <button
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes (unchanged) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

// Helper components (unchanged)
function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', minLength, maxLength, min=0, max=99 }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  );
}

function DetailRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{label}</dt>
      <dd className="text-sm font-medium text-gray-800 mt-0.5">{value || '-'}</dd>
    </div>
  );
}