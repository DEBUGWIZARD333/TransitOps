import { Menu, UserCircle2, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { getRoleLabel, getSidebarItems } from '../../config/rolePermissions';

const Sidebar = () => {
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const items = getSidebarItems(user?.role);
  const roleLabel = getRoleLabel(user?.role);

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-slate-950/95 px-4 py-5 text-slate-100 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0'}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className={`truncate text-lg font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>TransitOps</h2>
            <p className={`mt-1 text-sm text-slate-400 ${isCollapsed ? 'hidden' : 'block'}`}>Smart Transport Operations</p>
          </div>
          <button onClick={toggleSidebar} className="rounded-full border border-slate-800 p-2 text-slate-300 transition hover:bg-slate-900 hover:text-white lg:hidden">
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-2">
          {items.map(({ id, label, icon: Icon, path, viewOnly }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-orange-500/15 text-orange-300 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]' : 'text-slate-300 hover:bg-slate-900 hover:text-white'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon size={18} />
              {!isCollapsed ? <span>{label}</span> : null}
              {viewOnly ? <span className={`rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] ${isCollapsed ? 'hidden' : 'ml-auto'}`}>View</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <UserCircle2 size={20} className="text-orange-400" />
            {!isCollapsed ? (
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-200">{user?.name || 'Operations User'}</p>
                <p className="truncate text-xs text-slate-400">{roleLabel}</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      {!isCollapsed ? (
        <button onClick={toggleSidebar} className="fixed left-4 top-4 z-50 rounded-full border border-slate-800 bg-slate-950/90 p-2 text-slate-100 shadow-lg lg:hidden">
          <Menu size={18} />
        </button>
      ) : null}
    </>
  );
};

export default Sidebar;
