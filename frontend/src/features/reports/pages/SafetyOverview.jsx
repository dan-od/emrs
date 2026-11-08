import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { PageLoader } from '@/components/feedback';
import { SafetyStatCard as StatCard } from '@/features/safety/components';
import { ReportChart, ReportExport, ReportFilters } from '../components';
import { useSafetyOverview } from '../hooks/useReports';
import { AlertTriangle, ShieldAlert, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';

const sum = (rows) => (rows || []).reduce((a, r) => a + (Number(r.value) || 0), 0);
const countFor = (rows, label) => Number((rows || []).find(r => r.label === label)?.value) || 0;

const SafetyOverview = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ department: '', dateFrom: '', dateTo: '' });
  const { data, isLoading } = useSafetyOverview(filters);

  const byType = data?.byType || [];
  const bySeverity = data?.bySeverity || [];
  const byStatus = data?.byStatus || [];

  return (
    <PageWrapper
      title="Safety Overview"
      actions={<ReportExport rows={byType} filename="safety-by-type.csv" />}
    >
      <button onClick={() => navigate('/reports')} className="mb-4 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400">
        <ChevronLeft className="w-4 h-4" />Back to reports
      </button>

      <ReportFilters filters={filters} onChange={setFilters} />

      {isLoading ? <PageLoader /> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Reports" value={sum(byType)} icon={AlertTriangle} color="info" />
            <StatCard title="Incidents" value={countFor(byType, 'Incident')} icon={ShieldAlert} color="error" />
            <StatCard title="Critical" value={countFor(bySeverity, 'Critical')} icon={AlertCircle} color="warning" />
            <StatCard title="Resolved" value={countFor(byStatus, 'Resolved')} icon={CheckCircle} color="success" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChart title="By Type" type="pie" data={byType} />
            <ReportChart title="By Severity" type="bar" data={bySeverity} />
            <ReportChart title="By Status" type="bar" data={byStatus} />
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default SafetyOverview;
