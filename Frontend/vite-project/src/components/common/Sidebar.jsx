import { BarChart3, Bell, Fuel, LayoutDashboard, Route, ReceiptText, Shield, Truck, UserCircle2, Users, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes/routeConstants';

const navByRole = {
  Admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.dashboard },
    { label: 'Admin', icon: Shield, to: ROUTES.admin },
  ],
  'Fleet Manager': [
    { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.dashboard },
    { label: 'Vehicles', icon: Truck, to: ROUTES.vehicles },
    { label: 'Drivers', icon: Users, to: ROUTES.drivers },
    { label: 'Maintenance', icon: Wrench, to: ROUTES.maintenance },
  ],
  Driver: [
    { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.dashboard },
    { label: 'Trips', icon: Route, to: ROUTES.trips },
  ],
  'Safety Officer': [
    { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.dashboard },
    { label: 'Drivers', icon: Users, to: ROUTES.drivers },
  ],
  'Financial Analyst': [
    { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.dashboard },
    { label: 'Reports', icon: BarChart3, to: ROUTES.reports },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const items = navByRole[user?.role] || navByRole['Fleet Manager'];

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-950/95 p-6 text-slate-100 lg:flex">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">TransitOps</h2>
        <p className="mt-1 text-sm text-slate-400">Smart Transport Operations</p>
      </div>
      <nav className="space-y-2">
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink key={label} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900'}`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400">
        <div className="flex items-center gap-3">
          <UserCircle2 size={18} />
          <div>
            <p className="font-medium text-slate-200">{user?.name || 'Operations User'}</p>
            <p>{user?.role || 'Fleet Manager'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
