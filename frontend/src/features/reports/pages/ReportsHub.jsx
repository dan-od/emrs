import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { Card, CardContent } from '@/components/common';
import { Package, FileText, Wrench, AlertTriangle, ChevronRight } from 'lucide-react';

const REPORTS = [
  { path: '/reports/equipment', title: 'Equipment Utilization', desc: 'Status mix, hours logged, and department distribution.', icon: Package, color: 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-500/20' },
  { path: '/reports/requests', title: 'Request Analytics', desc: 'Volume by type, status, and priority across the request pipeline.', icon: FileText, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20' },
  { path: '/reports/maintenance-costs', title: 'Maintenance Costs', desc: 'Spend by department, vendor, and service type.', icon: Wrench, color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20' },
  { path: '/reports/safety', title: 'Safety Overview', desc: 'Incidents by type, severity, and resolution status.', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20' }
];

const ReportsHub = () => {
  const navigate = useNavigate();
  return (
    <PageWrapper title="Reports & Analytics" subtitle="Operational reporting across the platform">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORTS.map(({ path, title, desc, icon: Icon, color }) => (
          <Card
            key={path}
            className="cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-white/10"
            onClick={() => navigate(path)}
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`p-3 rounded-lg ${color}`}><Icon className="w-6 h-6" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};

export default ReportsHub;
