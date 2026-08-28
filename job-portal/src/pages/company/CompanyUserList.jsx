import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/usersApi';

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

    //if (
    //  ['firstName', 'middleName', 'lastName', 'first_Name', 'middle_Name', 'last_Name'].includes(name)
    // ) {
    //  if (!/^[A-Za-z\s'-]{0,50}$/.test(value)) return;
    // }
    // if (name === 'age') {
    //  if (value !== '' && (Number(value) < 18 || Number(value) > 100)) return;
    // }
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

  const userTypeBadge = (type) => {
    const config = {
      ADMIN: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      CUSTOMER: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      COMPANY_ADMIN: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    };
    const style = config[type] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    return (
      <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
        {type?.replace('_', ' ') || 'Unknown'}
      </span>
    );
  };

  return (   
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header — gradient preserved */}
        <div className="h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <button
            onClick={openAddModal}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-4 py-2 rounded-full shadow-sm transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <input
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="COMPANY_ADMIN">Company Admin</option>
          </select>
        </div>

        {/* Table – simplified but with color accents preserved in action buttons */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : visibleUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visibleUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                          {getInitials(user.full_name)}
                        </div>
                        <span className="font-medium text-gray-900">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{userTypeBadge(user.user_type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone_number || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setViewingUser(user)}
                        className="text-blue-600 hover:text-blue-800 transition px-2 py-1 rounded-full hover:bg-blue-50 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-amber-600 hover:text-amber-800 transition px-2 py-1 rounded-full hover:bg-amber-50 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-800 transition px-2 py-1 rounded-full hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    

      {/* Add / Edit Modal — with gradient header and button colors */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 animate-fade-in-up">
            <div className="h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6">
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
                    <Field label="Age" name="age" type="number" min={18} max={100} value={form.age} onChange={handleFormChange} placeholder="25" required />
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
            </form>
          </div>
        </div>
      )}

      {/* View Modal — gradient header */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 animate-fade-in-up">
            <div className="h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-2xl flex items-center px-6">
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition"
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
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
    </div>
  );
}

// Helper components (unchanged)
function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', minLength, maxLength }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
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