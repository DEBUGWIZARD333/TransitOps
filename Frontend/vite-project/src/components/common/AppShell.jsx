import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';

const AppShell = () => {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Sidebar />
      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppShell;
