import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordOtp, buildRequestContext } from '../../api/passwordResetApi';
import { CheckCircle, Mail, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { referenceId, ipAddress, deviceInfo } = await buildRequestContext();
      await requestPasswordOtp({
        purpose: 'FORGOT_PASSWORD',
        referenceId,
        ipAddress,
        deviceInfo,
        user_name: userName,
      });

      localStorage.setItem(
        'passwordResetContext',
        JSON.stringify({ contact: userName, referenceId, ipAddress, deviceInfo })
      );

      toast.success('OTP sent to your registered email');
      setSent(true);
      window.open('/reset-password', '_blank');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center mb-8">
  <Link to="/" className="block w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 transition-transform hover:scale-105">
    <img
      src="/images/logo_png1.png"
      alt="JobPortal"
      className="w-full h-full object-cover"
    />
  </Link>
</div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Forgot password</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your username or email and we'll send a one‑time code to reset your password.
          </p>

          {sent ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-center gap-2 justify-center text-green-700 text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>OTP sent to your email</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                A new tab has opened where you can enter the code and set a new password.
                If the tab didn't open, use the link below.
              </p>
              <Link
                to="/reset-password"
                target="_blank"
                className="inline-block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition text-center"
              >
                Open reset password page
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Username or email
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          <p className="text-sm text-gray-500 text-center mt-6">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}