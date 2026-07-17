import { Menu, UserCircle2, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { getRoleLabel, getSidebarItems } from '../../config/rolePermissions';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const items = getSidebarItems(user?.role);
  const roleLabel = getRoleLabel(user?.role);

  return (
    <>
      <motion.aside 
        animate={{ width: isCollapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl px-4 py-5 shadow-lg transition-transform duration-300 ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <h2 className="truncate text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">TransitOps</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Smart Transport</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={toggleSidebar} className="rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden">
            <X size={16} />
          </button>
          {isCollapsed && (
            <div className="mx-auto hidden lg:block text-indigo-600 dark:text-indigo-400">
               <Menu size={24} />
            </div>
          )}
        </div>

        <nav className="space-y-2 relative">
          {items.map(({ id, label, icon: Icon, path, viewOnly }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) => `group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon size={20} className="transition-transform group-hover:scale-110" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isCollapsed && viewOnly && (
                <span className="ml-auto rounded-full bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest shadow-sm">View</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserCircle2 size={24} className="text-indigo-500" />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900"></span>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-200">{user?.name || 'Operations User'}</p>
                  <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{roleLabel}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {!isCollapsed ? (
        <button onClick={toggleSidebar} className="fixed left-4 top-4 z-50 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-950/90 p-2 text-slate-700 dark:text-slate-100 shadow-lg backdrop-blur-sm lg:hidden transition-transform hover:scale-105">
          <Menu size={18} />
        </button>
      ) : null}
    </>
  );
};

export default Sidebar;
