import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { PageLoader } from '@/components/feedback';
import { SafetyStatCard as StatCard } from '@/features/safety/components';
import { ReportChart, ReportExport, ReportFilters } from '../components';
import { useEquipmentUtilization } from '../hooks/useReports';
import { Package, Boxes, Wrench, Activity, ChevronLeft } from 'lucide-react';

const EquipmentUtilization = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ department: '', dateFrom: '', dateTo: '' });
  const { data, isLoading } = useEquipmentUtilization(filters);

  const t = data?.totals || {};
  const byStatus = data?.byStatus || [];
  const byDept = data?.byDepartment || [];

  return (
    <PageWrapper
      title="Equipment Utilization"
      actions={<ReportExport rows={byDept} filename="equipment-by-department.csv" />}
    >
      <button onClick={() => navigate('/reports')} className="mb-4 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400">
        <ChevronLeft className="w-4 h-4" />Back to reports
      </button>

      <ReportFilters filters={filters} onChange={setFilters} />

      {isLoading ? <PageLoader /> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Assets" value={t.total || 0} icon={Package} color="info" />
            <StatCard title="Available" value={t.available || 0} icon={Boxes} color="success" />
            <StatCard title="In Use" value={t.in_use || 0} icon={Activity} color="primary" />
            <StatCard title="In Maintenance" value={t.maintenance || 0} icon={Wrench} color="warning" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChart title="By Status" type="pie" data={byStatus} />
            <ReportChart title="By Department" type="bar" data={byDept} />
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default EquipmentUtilization;
