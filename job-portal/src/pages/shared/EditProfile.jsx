import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyProfile, updateMyProfile } from '../../api/profileApi';
import { useAuth } from '../../context/AuthContext';
import { User, Type, Calendar, Phone, MapPin } from 'lucide-react';
import { validatePhoneNumber } from '../../utils/validators';

export default function EditProfile() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    getMyProfile()
      .then((res) => setForm(res.data.data.my_profile))
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone_number') {
      if (!/^\+?\d*$/.test(value)) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneError = validatePhoneNumber(form.phone_number);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        first_Name: form.first_name,
        middle_Name: form.middle_name,
        last_Name: form.last_name,
        age: Number(form.age),
        address: form.address,
        phone_Number: form.phone_number,
      };
      await updateMyProfile(payload);
      setUser(form);
      localStorage.setItem('user', JSON.stringify(form));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

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
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg">Profile not found.</p>
      </div>
    );
  }

  // Helper for avatar initial
  const initial = form.first_name?.[0]?.toUpperCase() || '?';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

        {/* Avatar & heading */}
        <div className="relative px-6 pb-4">
          <div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:gap-5">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {initial}
            </div>
            <div className="mt-3 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
              <p className="text-sm text-gray-500">{form.email}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="border-t border-gray-100 px-6 py-6 bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <Field
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              icon={<User className="w-4 h-4 text-gray-400" />}
            />
            <Field
              label="Middle Name"
              name="middle_name"
              value={form.middle_name}

              onChange={handleChange}
              icon={<Type className="w-4 h-4 text-gray-400" />}
            />
            <Field
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              icon={<User className="w-4 h-4 text-gray-400" />}
            />
            <Field
              label="Age"
              name="age"
              type="number"
              value={form.age}
              min={1}
              max={99}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            <Field
              label="Phone Number"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              icon={<Phone className="w-4 h-4 text-gray-400" />}
            />
            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              icon={<MapPin className="w-4 h-4 text-gray-400" />}
              className="sm:col-span-2"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-full shadow-sm transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-full transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced field with icon
function Field({ label, name, value, onChange, type = 'text', icon, className = '', min = 0, max = 99, required }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {icon && <span className="text-base">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        min={min}
        max={max}
        required={required}
        onChange={onChange}
        className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
      />
    </div>
  );
}