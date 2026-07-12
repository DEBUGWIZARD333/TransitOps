import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessRoute } from '../../config/rolePermissions';
import AccessDeniedPage from '../../pages/error/AccessDeniedPage';
import { ROUTES } from '../../routes/routeConstants';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (location.pathname === ROUTES.root) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  if (!canAccessRoute(user?.role, location.pathname)) {
    return <AccessDeniedPage requestedPath={location.pathname} />;
  }

  return children;
};

export default ProtectedRoute;
