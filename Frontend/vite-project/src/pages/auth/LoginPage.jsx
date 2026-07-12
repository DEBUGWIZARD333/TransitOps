import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Form from '../../components/common/Form';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes/routeConstants';

const LoginPage = () => {
  const [email, setEmail] = useState('fleet.manager@transitops.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
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
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ops@transitops.com" />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
