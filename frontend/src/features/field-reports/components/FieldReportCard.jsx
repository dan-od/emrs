import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/common';
import { formatDate } from '@/utils/formatters';
import { FileText, Calendar, MapPin, User, Briefcase } from 'lucide-react';
import { FieldReportStatusBadge } from './FieldReportStatusBadge';

export const FieldReportCard = memo(({ report }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-white/10"
      onClick={() => navigate(`/field-reports/${report.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-500/20">
            <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FieldReportStatusBadge status={report.status} />
              {report.report_type && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                  {report.report_type}
                </span>
              )}
            </div>

            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {report.job_title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {report.content}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(report.report_date)}</span>
              {report.client_name && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{report.client_name}</span>}
              {report.job_location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.job_location}</span>}
              {report.submitted_by_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{report.submitted_by_name}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

FieldReportCard.displayName = 'FieldReportCard';
