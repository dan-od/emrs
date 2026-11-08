import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { MANAGER_ROLES } from '../routeRoles';

const ReportsHub = lazy(() => import('@/features/reports/pages/ReportsHub'));
const EquipmentUtilization = lazy(() => import('@/features/reports/pages/EquipmentUtilization'));
const RequestAnalytics = lazy(() => import('@/features/reports/pages/RequestAnalytics'));
const MaintenanceCosts = lazy(() => import('@/features/reports/pages/MaintenanceCosts'));
const SafetyOverview = lazy(() => import('@/features/reports/pages/SafetyOverview'));

// Reporting is a management function; MANAGER_ROLES matches the backend
// /reports/* role gate.
const g = (el) => <ProtectedRoute allowedRoles={MANAGER_ROLES}>{el}</ProtectedRoute>;

export const reportsRoutes = [
  <Route key="reports-hub" path="/reports" element={g(<ReportsHub />)} />,
  <Route key="reports-equipment" path="/reports/equipment" element={g(<EquipmentUtilization />)} />,
  <Route key="reports-requests" path="/reports/requests" element={g(<RequestAnalytics />)} />,
  <Route key="reports-maintenance" path="/reports/maintenance-costs" element={g(<MaintenanceCosts />)} />,
  <Route key="reports-safety" path="/reports/safety" element={g(<SafetyOverview />)} />,
];
