import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { FIELD_REPORT_CREATE_ROLES } from '../routeRoles';

const FieldReportsList = lazy(() => import('@/features/field-reports/pages/FieldReportsList'));
const CreateFieldReport = lazy(() => import('@/features/field-reports/pages/CreateFieldReport'));
const FieldReportDetail = lazy(() => import('@/features/field-reports/pages/FieldReportDetail'));

// List and detail are open to any authenticated user (the backend scopes what
// each role can see). Creating a report is limited to submitter roles.
export const fieldReportRoutes = [
  <Route key="fr-list" path="/field-reports" element={
    <ProtectedRoute><FieldReportsList /></ProtectedRoute>
  } />,
  <Route key="fr-new" path="/field-reports/new" element={
    <ProtectedRoute allowedRoles={FIELD_REPORT_CREATE_ROLES}><CreateFieldReport /></ProtectedRoute>
  } />,
  <Route key="fr-detail" path="/field-reports/:id" element={
    <ProtectedRoute><FieldReportDetail /></ProtectedRoute>
  } />,
];
