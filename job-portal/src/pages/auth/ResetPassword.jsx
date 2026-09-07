import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPasswordWithOtp, requestPasswordOtp, buildRequestContext } from '../../api/passwordResetApi';
import { KeyRound, Lock, ShieldCheck, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validatePassword, evaluatePasswordStrength } from '../../utils/validators';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

export default function ResetPassword() {
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({ token: '', newPassword: '', confirmPassword: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('passwordResetContext');
    if (stored) setContext(JSON.parse(stored));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const passwordsMatch = form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.newPassword !== form.confirmPassword;
  const strength = evaluatePasswordStrength(form.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate strong password
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    setSaving(true);
    try {
      await resetPasswordWithOtp({
        contact: context.contact,
        purpose: 'FORGOT_PASSWORD',
        referenceId: context.referenceId,
        ipAddress: context.ipAddress,
        deviceInfo: context.deviceInfo,
        new_password: form.newPassword,
        conform_password: form.confirmPassword,
        token: form.token,
      });
      toast.success('Password reset successfully. Please log in.');
      localStorage.removeItem('passwordResetContext');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reset password');
    } finally {
      setSaving(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { referenceId, ipAddress, deviceInfo } = await buildRequestContext();
      await requestPasswordOtp({
        purpose: 'FORGOT_PASSWORD',
        referenceId,
        ipAddress,
        deviceInfo,
        user_name: context.contact,
      });
      const updated = { ...context, referenceId, ipAddress, deviceInfo };
      setContext(updated);
      localStorage.setItem('passwordResetContext', JSON.stringify(updated));
      toast.success('A new OTP has been sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  // No context state
  if (!context) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Link to="/" className="block w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 transition-transform hover:scale-105">
              <img
                src="/images/logo_png1.png"
                alt="MeroJobHub"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset password</h1>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't find a pending password reset request in this browser. Please start from the forgot
              password page first.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition text-center"
            >
              Go to forgot password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#4f46e5] flex items-center justify-center p-1.5 shadow-md">
            <img src="/images/logo_png1.png" alt="MeroJobHub" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">MeroJobHub</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Reset password</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter the OTP sent to <span className="font-semibold text-gray-700">{context.contact}</span> and create a new password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* OTP */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-gray-400" />
                OTP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="token"
                required
                value={form.token}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                placeholder="Enter the code from your email"
              />
            </div>

            {/* New password */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-400" />
                  New password <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  required
                  value={form.newPassword}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 transition bg-white ${
                    strength.isValid
                      ? 'border-emerald-300 focus:ring-emerald-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator password={form.newPassword} showCriteria={true} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  Confirm new password <span className="text-red-500">*</span>
                </span>
                {passwordsMatch && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Do not match
                  </span>
                )}
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 transition bg-white ${
                    passwordsMismatch
                      ? 'border-red-300 focus:ring-red-500'
                      : passwordsMatch
                      ? 'border-emerald-300 focus:ring-emerald-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || (form.newPassword && !strength.isValid)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl shadow-md transition mt-2"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Resetting...
                </span>
              ) : (
                'Reset password'
              )}
            </button>
          </form>

          {/* Resend OTP link */}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition text-center w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? 'Resending...' : "Didn't get a code? Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}