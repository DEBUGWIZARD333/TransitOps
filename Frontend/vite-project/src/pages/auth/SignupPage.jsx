import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routeConstants';
import { useAuth } from '../../contexts/AuthContext';

const roles = ['Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

const initialForm = {
  userId: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Fleet Manager',
  termsAccepted: false,
};

const SignupPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.userId.trim()) nextErrors.userId = 'User ID is required';
    if (!form.email.trim()) nextErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Invalid email';
    if (form.password.length < 8) nextErrors.password = 'Password too short';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match';
    if (!form.role) nextErrors.role = 'Role not selected';
    if (!form.termsAccepted) nextErrors.termsAccepted = 'Terms not accepted';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setMessage('');

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.userId,
          name: form.userId,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      navigate(ROUTES.login, {
        state: {
          message: 'Account created successfully. Please sign in with your new credentials.',
          username: form.userId,
          password: form.password,
        },
      });
    } catch (error) {
      setErrors((current) => ({ ...current, submit: error.message || 'Unable to register account' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to={ROUTES.login} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
        <ArrowLeft size={16} />
        Back to login
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Create your account</h1>
          <p className="text-sm text-slate-500">Register to access the TransitOps platform.</p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Available roles</div>
            <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              {roles.map((role) => (
                <li key={role} className="rounded-2xl bg-white px-3 py-2 shadow-sm">{role}</li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-slate-700 md:col-span-2">
                <span className="mb-2 block font-medium">User ID</span>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  placeholder="Enter user ID"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                {errors.userId ? <p className="mt-2 text-sm text-rose-500">{errors.userId}</p> : null}
              </label>

              <label className="block text-sm text-slate-700 md:col-span-2">
                <span className="mb-2 block font-medium">Email Address</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@transitops.com"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                {errors.email ? <p className="mt-2 text-sm text-rose-500">{errors.email}</p> : null}
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-medium">Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                {errors.password ? <p className="mt-2 text-sm text-rose-500">{errors.password}</p> : null}
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-medium">Confirm Password</span>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-500">{errors.confirmPassword}</p> : null}
              </label>

              <label className="block text-sm text-slate-700 md:col-span-2">
                <span className="mb-2 block font-medium">Role</span>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role ? <p className="mt-2 text-sm text-rose-500">{errors.role}</p> : null}
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={form.termsAccepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-orange-500 focus:ring-orange-500"
              />
              <span>I agree to the Terms & Conditions</span>
            </label>
            {errors.termsAccepted ? <p className="text-sm text-rose-500">{errors.termsAccepted}</p> : null}
            {errors.submit ? <p className="text-sm text-rose-500">{errors.submit}</p> : null}
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to={ROUTES.login} className="font-medium text-orange-500 transition hover:text-orange-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
