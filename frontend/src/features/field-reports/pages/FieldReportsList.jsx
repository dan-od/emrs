import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { Button, Select, Input } from '@/components/common';
import { PageLoader, EmptyState } from '@/components/feedback';
import { FieldReportCard, FieldReportStatusBadge } from '../components';
import { SafetyStatCard as StatCard } from '@/features/safety/components';
import { useFieldReports, useMyFieldReports, useFieldReportStats } from '../hooks/useFieldReports';
import { useAuthStore } from '@/store/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, FileText, Clock, CheckCircle, CalendarDays } from 'lucide-react';

// Roles that review reports and therefore see the full list + stats.
const REVIEWER_ROLES = ['Super_Admin', 'Admin', 'IT_Support', 'Operations_Manager', 'Maintenance_Manager', 'Safety_Officer'];
const STATUSES = ['Submitted', 'Reviewed', 'Approved', 'Rejected'];

const FieldReportsList = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const canReview = useMemo(() => REVIEWER_ROLES.includes(user?.role), [user?.role]);

  const [filters, setFilters] = useState({ status: '', search: '' });
  const debounced = useDebounce(filters, 300);

  const query = useMemo(() => {
    const q = {};
    if (debounced.status) q.status = debounced.status;
    return q;
  }, [debounced.status]);

  const { reports: allReports, isLoading: loadingAll } = useFieldReports(canReview ? query : null);
  const { reports: myReports, isLoading: loadingMy } = useMyFieldReports();
  const { stats } = useFieldReportStats(canReview);

  const baseReports = canReview ? allReports : myReports;
  const isLoading = canReview ? loadingAll : loadingMy;

  const reports = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    if (!term) return baseReports;
    return baseReports.filter(r =>
      [r.job_title, r.client_name, r.job_location].some(v => v?.toLowerCase().includes(term))
    );
  }, [baseReports, filters.search]);

  if (isLoading) return <PageLoader />;

  return (
    <PageWrapper
      title="Field Reports"
      actions={
        <Button onClick={() => navigate('/field-reports/new')}>
          <Plus className="w-4 h-4 mr-2" />New Report
        </Button>
      }
    >
      {canReview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Reports" value={stats.total_reports || 0} icon={FileText} color="info" />
          <StatCard title="Pending Review" value={stats.pending_review || 0} icon={Clock} color="warning" />
          <StatCard title="Approved" value={stats.approved || 0} icon={CheckCircle} color="success" />
          <StatCard title="This Week" value={stats.this_week || 0} icon={CalendarDays} color="primary" />
        </div>
      )}

      {canReview && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by job, client, location..."
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <Select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="w-full sm:w-48"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      )}

      {!canReview && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 rounded-lg flex items-center gap-2">
          <p className="text-sm text-blue-700 dark:text-blue-300">Showing reports you submitted.</p>
          <FieldReportStatusBadge status="Submitted" />
        </div>
      )}

      {reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No field reports"
          description={canReview ? 'No reports match your filters.' : "You haven't submitted any field reports yet."}
        />
      ) : (
        <div className="space-y-4">
          {reports.map(r => <FieldReportCard key={r.id} report={r} />)}
        </div>
      )}
    </PageWrapper>
  );
};

export default FieldReportsList;
