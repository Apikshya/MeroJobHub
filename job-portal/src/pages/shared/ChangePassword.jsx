import { useState } from 'react';
import toast from 'react-hot-toast';
import { resetPassword } from '../../api/profileApi';
import { Lock, KeyRound, CheckCircle2, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { validatePassword, evaluatePasswordStrength } from '../../utils/validators';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({ old: false, new: false, confirm: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const passwordsMatch = form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.newPassword !== form.confirmPassword;
  const sameAsOld = form.oldPassword && form.newPassword && form.oldPassword === form.newPassword;
  const strength = evaluatePasswordStrength(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check current password
    if (!form.oldPassword.trim()) {
      toast.error('Please enter your current password');
      return;
    }

    // 2. Check if new password is same as old
    if (form.oldPassword === form.newPassword) {
      toast.error('New password cannot be the same as your current password');
      return;
    }

    // 3. Check password strength
    const passwordError = validatePassword(form.newPassword, form.oldPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // 4. Check confirmation match
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
      setTouched({ old: false, new: false, confirm: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password. Please check your current password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-200" />
              <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
            </div>
            <p className="text-blue-100 text-sm max-w-xl">
              Keep your account protected by choosing a strong password with a combination of uppercase, lowercase, numbers, and special characters.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>High Security Standard</span>
          </div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Account Credentials</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter your current password and set a new strong password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Current Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Current Password
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showOld ? 'text' : 'password'}
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('old')}
                  required
                  placeholder="Enter current password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showOld ? 'Hide password' : 'Show password'}
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-gray-400" />
                  New Password
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('new')}
                  required
                  placeholder="Create a strong new password"
                  className={`w-full border rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 transition bg-white ${
                    sameAsOld
                      ? 'border-red-300 focus:ring-red-500'
                      : strength.isValid
                      ? 'border-emerald-300 focus:ring-emerald-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Warning if same as old password */}
              {sameAsOld && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  New password cannot be the same as current password
                </p>
              )}

              {/* Real-time Strength Indicator & Checklist */}
              <PasswordStrengthIndicator password={form.newPassword} showCriteria={true} />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  Confirm New Password
                  <span className="text-red-500">*</span>
                </span>
                {passwordsMatch && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                  </span>
                )}
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirm')}
                  required
                  placeholder="Re-enter your new password"
                  className={`w-full border rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 transition bg-white ${
                    passwordsMismatch
                      ? 'border-red-300 focus:ring-red-500'
                      : passwordsMatch
                      ? 'border-emerald-300 focus:ring-emerald-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || sameAsOld || (form.newPassword && !strength.isValid)}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips Sidebar Card */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Password Security Tips
            </div>
            <ul className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>Use at least 8 characters with a mix of letters, numbers, and special symbols.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>Avoid common passwords, sequential characters, or your personal name/birthdate.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>Do not reuse passwords from your email, banking, or social media accounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>After updating, your new password will be active across all logged-in devices.</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 text-xs text-blue-900 space-y-1.5">
            <p className="font-semibold flex items-center gap-1.5 text-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Need help?
            </p>
            <p className="text-blue-700/80 leading-relaxed">
              If you suspect any unauthorized access to your account, please contact our support team immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}