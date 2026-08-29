import { useState } from 'react';
import toast from 'react-hot-toast';
import { resetPassword } from '../../api/profileApi';
import { Lock, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    setSaving(true);
    try {
      await resetPassword({
        old_Password: form.oldPassword,
        new_Password: form.newPassword,
        conform_Password: form.confirmPassword,
      });
      toast.success('Password changed successfully');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

        {/* Title */}
        <div className="px-6 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
          <p className="text-sm text-gray-500">Update your account security</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 bg-gray-50/50">
          <div className="space-y-4">
            <Field
              label="Current Password"
              name="oldPassword"
              value={form.oldPassword}
              required
              onChange={handleChange}
              icon={<Lock className="w-4 h-4 text-gray-400" />}
            />
            <Field
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              icon={<KeyRound className="w-4 h-4 text-gray-400" />}
            />
            <Field
              label="Confirm New Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              icon={<CheckCircle2 className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-full shadow-sm transition"
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, icon, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {icon && <span className="text-base">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
      />
    </div>
  );
}