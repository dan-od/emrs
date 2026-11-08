import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { JOBS_ROLES, PURCHASING_ROLES } from '../routeRoles';

const JobList = lazy(() => import('@/features/jobs/pages/JobList'));
const JobDetail = lazy(() => import('@/features/jobs/pages/JobDetail'));
const CreateJob = lazy(() => import('@/features/jobs/pages/CreateJob'));
const EditJob = lazy(() => import('@/features/jobs/pages/EditJob'));
const PurchasingQueue = lazy(() => import('@/features/jobs/pages/purchasing/PurchasingQueuePage'));

export const jobsRoutes = [
  <Route key="jobs-list" path="/jobs" element={
    <ProtectedRoute allowedRoles={JOBS_ROLES}><JobList /></ProtectedRoute>
  } />,
  <Route key="jobs-new" path="/jobs/new" element={
    <ProtectedRoute allowedRoles={JOBS_ROLES}><CreateJob /></ProtectedRoute>
  } />,
  <Route key="jobs-pq" path="/jobs/purchasing-queue" element={
    <ProtectedRoute allowedRoles={PURCHASING_ROLES}><PurchasingQueue /></ProtectedRoute>
  } />,
  <Route key="jobs-edit" path="/jobs/:id/edit" element={
    <ProtectedRoute allowedRoles={JOBS_ROLES}><EditJob /></ProtectedRoute>
  } />,
  <Route key="jobs-detail" path="/jobs/:id" element={
    <ProtectedRoute allowedRoles={JOBS_ROLES}><JobDetail /></ProtectedRoute>
  } />,
];
