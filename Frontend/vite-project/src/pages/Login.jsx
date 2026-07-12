import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Driver'); // Default role
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const payload = { email, password, role };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 200) {
        if (isLogin) {
          navigate('/dashboard', { state: { user: data.user } });
        } else {
          setMessage('Registered successfully');
          setIsLogin(true);
          setPassword(''); // Clear password for them to login
        }
      } else if (response.status === 401) {
        setError(data.message || 'Authentication failed');
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      setError('Could not connect to the backend server. Please make sure it is running.');
    }
  };

  return (
    <div className="glass-card">
      <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Fleet Manager">Fleet Manager</option>
            <option value="Driver">Driver</option>
            <option value="Financial Analyst">Financial Analyst</option>
            <option value="Safety Officer">Safety Officer</option>
          </select>
        </div>
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        {error && <p className="error message">{error}</p>}
        {message && <p className="message" style={{color: '#10b981'}}>{message}</p>}
        
        <button type="submit" className="btn">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold'}}
          onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </span>
      </p>
    </div>
  );
};

export default Login;
