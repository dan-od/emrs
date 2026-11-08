import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/common';
import { PageLoader, EmptyState } from '@/components/feedback';
import { FieldReportStatusBadge, ReviewActions } from '../components';
import { useFieldReport } from '../hooks/useFieldReports';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/formatters';
import { FileText, ChevronLeft } from 'lucide-react';

const APPROVER_ROLES = ['Super_Admin', 'Admin', 'IT_Support', 'Operations_Manager', 'Maintenance_Manager'];
const OPEN_STATUSES = ['Submitted', 'Reviewed'];

const Field = ({ label, value }) => (
  value ? (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-white mt-0.5 whitespace-pre-wrap">{value}</dd>
    </div>
  ) : null
);

const FieldReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { report, isLoading, refresh } = useFieldReport(id);

  const canReview = useMemo(
    () => APPROVER_ROLES.includes(user?.role) && OPEN_STATUSES.includes(report?.status),
    [user?.role, report?.status]
  );

  if (isLoading) return <PageLoader />;
  if (!report) return <PageWrapper title="Field Report"><EmptyState icon={FileText} title="Report not found" /></PageWrapper>;

  return (
    <PageWrapper title="Field Report">
      <button onClick={() => navigate('/field-reports')} className="mb-4 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400">
        <ChevronLeft className="w-4 h-4" />Back to reports
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{report.job_title}</CardTitle>
                <FieldReportStatusBadge status={report.status} />
                {report.report_type && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">{report.report_type}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <Field label="Client" value={report.client_name} />
                <Field label="Location" value={report.job_location} />
                <Field label="Report Date" value={formatDate(report.report_date)} />
                <Field label="Submitted By" value={report.submitted_by_name} />
                <Field label="Weather" value={report.weather_conditions} />
                <Field label="Crew" value={report.crew_count != null ? String(report.crew_count) : null} />
              </dl>
              <dl className="space-y-4">
                <Field label="Report Content" value={report.content} />
                <Field label="Equipment Used" value={report.equipment_used} />
                <Field label="Issues Encountered" value={report.issues_encountered} />
                <Field label="Next Day Plan" value={report.next_day_plan} />
              </dl>
            </CardContent>
          </Card>

          {(report.status === 'Approved' || report.status === 'Rejected' || report.review_comments) && (
            <Card className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-white/10">
              <CardHeader><CardTitle>Review Outcome</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <Field label="Decision" value={report.status} />
                  <Field label="Reviewed By" value={report.reviewed_by_name} />
                  <Field label="Reviewed At" value={report.reviewed_at ? formatDate(report.reviewed_at) : null} />
                  <Field label="Comments" value={report.review_comments} />
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {canReview && <ReviewActions reportId={report.id} onDone={refresh} />}
        </div>
      </div>
    </PageWrapper>
  );
};

export default FieldReportDetail;
