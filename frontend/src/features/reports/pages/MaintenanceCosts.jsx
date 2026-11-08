import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { PageLoader } from '@/components/feedback';
import { SafetyStatCard as StatCard } from '@/features/safety/components';
import { ReportChart, ReportExport, ReportFilters } from '../components';
import { useMaintenanceCosts } from '../hooks/useReports';
import { formatCurrency } from '@/utils/formatters';
import { Wrench, Banknote, CheckCircle, Clock, ChevronLeft } from 'lucide-react';

const MaintenanceCosts = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ department: '', dateFrom: '', dateTo: '' });
  const { data, isLoading } = useMaintenanceCosts(filters);

  const t = data?.totals || {};
  // Cost charts want numbers keyed as `value`; the queries alias cost columns.
  const mapCost = (rows, nameField) => (rows || []).map(r => ({
    label: r[nameField], value: Number(r.total_cost) || 0, work_order_count: Number(r.work_order_count) || 0
  }));
  const byDept = mapCost(data?.byDepartment, 'department');
  const byVendor = mapCost(data?.byVendor, 'vendor_name');
  const byService = mapCost(data?.byServiceType, 'service_type');
  const money = (v) => formatCurrency(Number(v) || 0);

  return (
    <PageWrapper
      title="Maintenance Costs"
      actions={<ReportExport rows={data?.byDepartment || []} filename="maintenance-costs-by-department.csv" />}
    >
      <button onClick={() => navigate('/reports')} className="mb-4 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400">
        <ChevronLeft className="w-4 h-4" />Back to reports
      </button>

      <ReportFilters filters={filters} onChange={setFilters} />

      {isLoading ? <PageLoader /> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Work Orders" value={t.total_work_orders || 0} icon={Wrench} color="info" />
            <StatCard title="Actual Cost" value={money(t.total_actual_cost)} icon={Banknote} color="primary" />
            <StatCard title="Total Paid" value={money(t.total_paid)} icon={CheckCircle} color="success" />
            <StatCard title="This Month" value={money(t.this_month_cost)} icon={Clock} color="warning" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChart title="Cost by Department" type="bar" data={byDept} valueFormatter={money} />
            <ReportChart title="Cost by Vendor" type="bar" data={byVendor} valueFormatter={money} />
            <ReportChart title="Cost by Service Type" type="pie" data={byService} valueFormatter={money} />
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default MaintenanceCosts;
