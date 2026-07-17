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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-4 sm:px-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="rounded-full border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition lg:hidden">
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Operations Console</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.name || 'Operations User'} • <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">{roleLabel}</span></p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 sm:flex transition-all">
          <Search size={16} />
          <input className="w-32 bg-transparent outline-none md:w-40 placeholder-slate-400 dark:placeholder-slate-500" placeholder="Search" />
        </label>
        <button className="rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Bell size={18} />
        </button>
        <button className="rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Settings size={18} />
        </button>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 text-sm font-medium hover:from-red-600 hover:to-rose-600 shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
