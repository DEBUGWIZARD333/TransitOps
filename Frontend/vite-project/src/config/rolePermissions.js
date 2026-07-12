import {
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Fuel,
  Gauge,
  LayoutDashboard,
  ReceiptText,
  Route,
  Settings as SettingsIcon,
  Shield,
  Truck,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';
import { ROUTES } from '../routes/routeConstants';

export const ROLE_DEFINITIONS = {
  admin: {
    key: 'admin',
    label: 'Admin',
    displayName: 'Admin',
    menu: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.dashboard, permission: 'dashboard' },
      { id: 'users', label: 'User Management', icon: UserCog, path: ROUTES.userManagement, permission: 'user_management' },
      { id: 'fleet', label: 'Fleet', icon: Truck, path: ROUTES.fleet, permission: 'fleet' },
      { id: 'drivers', label: 'Drivers', icon: Users, path: ROUTES.drivers, permission: 'drivers' },
      { id: 'trips', label: 'Trips', icon: Route, path: ROUTES.trips, permission: 'trips' },
      { id: 'maintenance', label: 'Maintenance', icon: Wrench, path: ROUTES.maintenance, permission: 'maintenance' },
      { id: 'fuel', label: 'Fuel & Expenses', icon: Fuel, path: ROUTES.fuelExpenses, permission: 'fuel_expenses' },
      { id: 'analytics', label: 'Analytics', icon: Gauge, path: ROUTES.analytics, permission: 'analytics' },
      { id: 'reports', label: 'Reports', icon: BarChart3, path: ROUTES.reports, permission: 'reports' },
      { id: 'settings', label: 'Settings', icon: SettingsIcon, path: ROUTES.settings, permission: 'settings' },
    ],
    routePermissions: [ROUTES.dashboard, ROUTES.userManagement, ROUTES.fleet, ROUTES.drivers, ROUTES.trips, ROUTES.maintenance, ROUTES.fuelExpenses, ROUTES.analytics, ROUTES.reports, ROUTES.settings],
    actions: { create: true, edit: true, delete: true, dispatch: true, complete: true, cancel: true },
  },
  fleet_manager: {
    key: 'fleet_manager',
    label: 'Fleet Manager',
    displayName: 'Fleet Manager',
    menu: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.dashboard, permission: 'dashboard' },
      { id: 'fleet', label: 'Fleet', icon: Truck, path: ROUTES.fleet, permission: 'fleet' },
      { id: 'drivers', label: 'Drivers', icon: Users, path: ROUTES.drivers, permission: 'drivers' },
      { id: 'trips', label: 'Trips', icon: Route, path: ROUTES.trips, permission: 'trips', viewOnly: true },
      { id: 'maintenance', label: 'Maintenance', icon: Wrench, path: ROUTES.maintenance, permission: 'maintenance' },
      { id: 'fuel', label: 'Fuel & Expenses', icon: Fuel, path: ROUTES.fuelExpenses, permission: 'fuel_expenses' },
      { id: 'analytics', label: 'Analytics', icon: Gauge, path: ROUTES.analytics, permission: 'analytics' },
      { id: 'settings', label: 'Settings', icon: SettingsIcon, path: ROUTES.settings, permission: 'settings' },
    ],
    routePermissions: [ROUTES.dashboard, ROUTES.fleet, ROUTES.drivers, ROUTES.trips, ROUTES.maintenance, ROUTES.fuelExpenses, ROUTES.analytics, ROUTES.settings],
    actions: { create: false, edit: true, delete: false, dispatch: false, complete: false, cancel: false },
  },
  dispatcher: {
    key: 'dispatcher',
    label: 'Dispatcher',
    displayName: 'Dispatcher',
    menu: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.dashboard, permission: 'dashboard' },
      { id: 'trips', label: 'Trips', icon: Route, path: ROUTES.trips, permission: 'trips' },
      { id: 'fleet', label: 'Fleet', icon: Truck, path: ROUTES.fleet, permission: 'fleet', viewOnly: true },
      { id: 'drivers', label: 'Drivers', icon: Users, path: ROUTES.drivers, permission: 'drivers', viewOnly: true },
    ],
    routePermissions: [ROUTES.dashboard, ROUTES.trips, ROUTES.fleet, ROUTES.drivers],
    actions: { create: false, edit: false, delete: false, dispatch: true, complete: true, cancel: true },
  },
  safety_officer: {
    key: 'safety_officer',
    label: 'Safety Officer',
    displayName: 'Safety Officer',
    menu: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.dashboard, permission: 'dashboard' },
      { id: 'drivers', label: 'Drivers', icon: Users, path: ROUTES.drivers, permission: 'drivers' },
      { id: 'safety', label: 'Safety Reports', icon: AlertTriangle, path: ROUTES.safetyReports, permission: 'safety_reports' },
      { id: 'license', label: 'License Monitoring', icon: ClipboardCheck, path: ROUTES.licenseMonitoring, permission: 'license_monitoring' },
    ],
    routePermissions: [ROUTES.dashboard, ROUTES.drivers, ROUTES.safetyReports, ROUTES.licenseMonitoring],
    actions: { create: false, edit: true, delete: false, dispatch: false, complete: false, cancel: false },
  },
  financial_analyst: {
    key: 'financial_analyst',
    label: 'Financial Analyst',
    displayName: 'Financial Analyst',
    menu: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.dashboard, permission: 'dashboard' },
      { id: 'fuel', label: 'Fuel & Expenses', icon: Fuel, path: ROUTES.fuelExpenses, permission: 'fuel_expenses' },
      { id: 'analytics', label: 'Analytics', icon: Gauge, path: ROUTES.analytics, permission: 'analytics' },
      { id: 'reports', label: 'Reports', icon: BarChart3, path: ROUTES.reports, permission: 'reports' },
    ],
    routePermissions: [ROUTES.dashboard, ROUTES.fuelExpenses, ROUTES.analytics, ROUTES.reports],
    actions: { create: false, edit: false, delete: false, dispatch: false, complete: false, cancel: false },
  },
};

const ROLE_ALIASES = {
  admin: 'admin',
  'fleet manager': 'fleet_manager',
  fleet_manager: 'fleet_manager',
  fleet: 'fleet_manager',
  dispatcher: 'dispatcher',
  driver: 'dispatcher',
  'safety officer': 'safety_officer',
  safety_officer: 'safety_officer',
  'financial analyst': 'financial_analyst',
  financial_analyst: 'financial_analyst',
};

export const normalizeRole = (role) => {
  const normalized = String(role || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');

  return ROLE_ALIASES[normalized] || normalized || 'fleet_manager';
};

export const getRoleConfig = (role) => ROLE_DEFINITIONS[normalizeRole(role)] || ROLE_DEFINITIONS.fleet_manager;

export const getSidebarItems = (role) => getRoleConfig(role).menu;

export const canAccessRoute = (role, route) => getRoleConfig(role).routePermissions.includes(route);

export const canPerformAction = (role, action) => Boolean(getRoleConfig(role).actions[action]);

export const getRoleLabel = (role) => getRoleConfig(role).displayName;
