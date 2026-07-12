import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/common/AppShell';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AuthLayout from '../components/layouts/AuthLayout';
import AdminPage from '../pages/admin/AdminPage';
import LandingPage from '../pages/auth/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import SignupPage from '../pages/auth/SignupPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import DriverListPage from '../pages/drivers/DriverListPage';
import FuelExpensesPage from '../pages/fuel/FuelExpensesPage';
import MaintenanceDashboardPage from '../pages/maintenance/MaintenanceDashboardPage';
import ModulePage from '../pages/modules/ModulePage';
import SettingsPage from '../pages/settings/SettingsPage';
import TripListPage from '../pages/trips/TripListPage';
import VehicleListPage from '../pages/vehicles/VehicleListPage';
import { ROUTES } from './routeConstants';

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Route>

    <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
      <Route path={ROUTES.root} element={<Navigate to={ROUTES.dashboard} replace />} />
      <Route path={ROUTES.dashboard} element={<DashboardPage />} />
      <Route path={ROUTES.fleet} element={<VehicleListPage />} />
      <Route path={ROUTES.vehicles} element={<VehicleListPage />} />
      <Route path={ROUTES.drivers} element={<DriverListPage />} />
      <Route path={ROUTES.maintenance} element={<MaintenanceDashboardPage />} />
      <Route path={ROUTES.trips} element={<TripListPage />} />
      <Route path={ROUTES.reports} element={<AnalyticsPage />} />
      <Route path={ROUTES.analytics} element={<AnalyticsPage />} />
      <Route path={ROUTES.fuelExpenses} element={<FuelExpensesPage />} />
      <Route path={ROUTES.settings} element={<SettingsPage />} />
      <Route path={ROUTES.userManagement} element={<AdminPage />} />
      <Route path={ROUTES.safetyReports} element={<ModulePage title="Safety Reports" subtitle="Incident and compliance visibility" summary="Safety incident reports and alerts will appear here." />} />
      <Route path={ROUTES.licenseMonitoring} element={<ModulePage title="License Monitoring" subtitle="Driver license validity checks" summary="License monitoring data will appear here." />} />
      <Route path={ROUTES.admin} element={<AdminPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
