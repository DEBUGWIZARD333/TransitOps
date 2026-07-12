import { Outlet, useLocation } from 'react-router-dom';

const AuthLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className={`min-h-screen ${isLanding ? 'bg-transparent' : 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_#020617,_#0f172a)]'} transition-all duration-500`}>
      {isLanding ? (
        <Outlet />
      ) : (
        <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/95 p-7 shadow-2xl shadow-slate-950/20 backdrop-blur sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">TO</div>
              <div>
                <p className="text-lg font-semibold text-slate-900">TransitOps</p>
                <p className="text-sm text-slate-500">Secure operations portal</p>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
