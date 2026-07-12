import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { email: 'Guest', role: 'Unknown' };

  return (
    <div className="glass-card dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user.email}</strong>!</p>
      <p>Your role is: <span style={{color: 'var(--primary)', textTransform: 'capitalize'}}>{user.role}</span></p>
      <p style={{marginTop: '2rem'}}>The specific dashboard features will be uploaded later as per instructions.</p>
      
      <button className="btn" onClick={() => navigate('/login')}>Logout</button>
    </div>
  );
};

export default Dashboard;
