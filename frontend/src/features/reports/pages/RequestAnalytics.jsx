import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { PageLoader } from '@/components/feedback';
import { SafetyStatCard as StatCard } from '@/features/safety/components';
import { ReportChart, ReportExport } from '../components';
import { useRequestAnalytics } from '../hooks/useReports';
import { FileText, Clock, CheckCircle, Send, ChevronLeft } from 'lucide-react';

const RequestAnalytics = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useRequestAnalytics();
  if (isLoading) return <PageLoader />;

  const t = data?.totals || {};
  const byType = data?.byType || [];
  const byStatus = data?.byStatus || [];
  const byPriority = data?.byPriority || [];

  return (
    <PageWrapper
      title="Request Analytics"
      actions={<ReportExport rows={byStatus} filename="requests-by-status.csv" />}
    >
      <button onClick={() => navigate('/reports')} className="mb-4 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400">
        <ChevronLeft className="w-4 h-4" />Back to reports
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Requests" value={t.total || 0} icon={FileText} color="info" />
        <StatCard title="Pending" value={t.pending || 0} icon={Clock} color="warning" />
        <StatCard title="Approved" value={(t.approved || 0) + (t.manager_approved || 0)} icon={CheckCircle} color="success" />
        <StatCard title="Disbursed" value={t.disbursed || 0} icon={Send} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportChart title="By Type" type="pie" data={byType} />
        <ReportChart title="By Status" type="bar" data={byStatus} />
        <ReportChart title="By Priority" type="bar" data={byPriority} />
      </div>
    </PageWrapper>
  );
};

export default RequestAnalytics;
