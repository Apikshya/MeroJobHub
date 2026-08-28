import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPasswordWithOtp, requestPasswordOtp, buildRequestContext } from '../../api/passwordResetApi';

export default function ResetPassword() {
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({ token: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('passwordResetContext');
    if (stored) setContext(JSON.parse(stored));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  <Link to="/" className="block w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 transition-transform hover:scale-105">
    <img
      src="/images/logo_png1.png"
      alt="JobPortal"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            JP
          </div>
          <span className="text-3xl font-extrabold text-gray-800 tracking-tight">JobPortal</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Reset password</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter the OTP sent to <span className="font-medium text-gray-700">{context.contact}</span> and choose a
            new password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                OTP
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
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                required
                value={form.newPassword}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Confirm new password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                placeholder="Re‑enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md transition"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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