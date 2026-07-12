import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Form from '../../components/common/Form';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes/routeConstants';

const roles = ['Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

const LoginPage = () => {
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [role, setRole] = useState('Fleet Manager');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ username, password, role });
      navigate(ROUTES.dashboard);
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
        <ArrowLeft size={16} />
        Back to home
      </Link>
      <Form title="Welcome back">
        <p className="-mt-2 text-sm text-slate-500">Sign in to access your transport operations workspace.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username or Email" type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your user ID or email" />
          <label className="block text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-slate-400"
            >
              {roles.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-center text-sm text-slate-500">
            New here?{' '}
            <Link to={ROUTES.signup} className="font-medium text-orange-500 transition hover:text-orange-600">
              Create an account
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
