import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AuthLayout from '../components/layouts/AuthLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import LandingPage from '../pages/auth/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VehicleListPage from '../pages/vehicles/VehicleListPage';
import DriverListPage from '../pages/drivers/DriverListPage';
import MaintenanceDashboardPage from '../pages/maintenance/MaintenanceDashboardPage';
import TripListPage from '../pages/trips/TripListPage';
import FleetAnalyticsPage from '../pages/reports/FleetAnalyticsPage';
import AdminPage from '../pages/admin/AdminPage';
import { ROUTES } from './routeConstants';

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Route>

    <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
      <Route path={ROUTES.root} element={<Navigate to={ROUTES.dashboard} replace />} />
      <Route path={ROUTES.dashboard} element={<DashboardPage />} />
      <Route path={ROUTES.vehicles} element={<VehicleListPage />} />
      <Route path={ROUTES.drivers} element={<DriverListPage />} />
      <Route path={ROUTES.maintenance} element={<MaintenanceDashboardPage />} />
      <Route path={ROUTES.trips} element={<TripListPage />} />
      <Route path={ROUTES.reports} element={<FleetAnalyticsPage />} />
      <Route path={ROUTES.admin} element={<AdminPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
