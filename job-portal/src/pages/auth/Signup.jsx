import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signup } from '../../api/authApi';
import { User, Briefcase, Mail, Lock, Phone, MapPin, Loader2, Eye, EyeOff } from 'lucide-react';
import { validatePhoneNumber, validatePassword, evaluatePasswordStrength } from '../../utils/validators';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

const initialForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  password: '',
  age: '',
  address: '',
  phoneNumber: '',
};

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      if (!/^\+?\d*$/.test(value)) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneError = validatePhoneNumber(form.phoneNumber);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, age: Number(form.age) };
      await signup(payload);
      toast.success('Account created. Please log in.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10">
      <div className="w-full max-w-lg">
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
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Create your customer account</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              icon={<User className="w-4 h-4 text-gray-400" />}
              placeholder="John"
            />
            <Field
              label="Middle name"
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              icon={<User className="w-4 h-4 text-gray-400" />}
              placeholder="(optional)"
            />
            <Field
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              icon={<User className="w-4 h-4 text-gray-400" />}
              placeholder="Doe"
            />
            <Field
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
              icon={<Briefcase className="w-4 h-4 text-gray-400" />}
              placeholder="25"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="sm:col-span-2"
              icon={<Mail className="w-4 h-4 text-gray-400" />}
              placeholder="you@example.com"
            />
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Password <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={form.password} showCriteria={true} />
            </div>
            <Field
              label="Phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              icon={<Phone className="w-4 h-4 text-gray-400" />}
              placeholder="+977 98XXXXXXXX"
            />
            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="sm:col-span-2"
              icon={<MapPin className="w-4 h-4 text-gray-400" />}
              placeholder="Kathmandu, Nepal"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md transition mt-2 sm:col-span-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Creating account...
                </span>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false, className = '', icon, placeholder = '' }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}