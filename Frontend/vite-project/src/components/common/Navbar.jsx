import { Bell, LogOut, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Operations Console</h1>
        <p className="text-sm text-slate-500">Role-aware access for {user?.role || 'Fleet Manager'}</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Search size={16} />
          <input className="w-40 bg-transparent outline-none" placeholder="Search" />
        </label>
        <button className="rounded-full border border-slate-200 p-2 text-slate-600">
          <Bell size={18} />
        </button>
        <button className="rounded-full border border-slate-200 p-2 text-slate-600">
          <Settings size={18} />
        </button>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
