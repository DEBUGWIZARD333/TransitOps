import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppShell = () => (
  <div className="flex min-h-screen bg-slate-50">
    <Sidebar />
    <div className="flex min-h-screen flex-1 flex-col">
      <Navbar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
);

export default AppShell;
