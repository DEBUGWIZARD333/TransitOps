import { Bell, LogOut, Menu, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { getRoleLabel } from '../../config/rolePermissions';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const roleLabel = getRoleLabel(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="rounded-full border border-slate-200 p-2 text-slate-600 lg:hidden">
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Operations Console</h1>
          <p className="text-sm text-slate-500">{user?.name || 'Operations User'} • <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{roleLabel}</span></p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex">
          <Search size={16} />
          <input className="w-32 bg-transparent outline-none md:w-40" placeholder="Search" />
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
