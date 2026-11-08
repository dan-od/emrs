import { useState } from 'react';
import { Card, CardContent, Textarea, Button } from '@/components/common';
import { useFieldReportActions } from '../hooks/useFieldReports';
import { useUiStore } from '@/store/uiStore';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Manager review panel. Shown only for reports still awaiting a decision
 * (Submitted / Reviewed). Approve and Reject hit their dedicated endpoints.
 */
export const ReviewActions = ({ reportId, onDone }) => {
  const { approveReport, rejectReport, isLoading } = useFieldReportActions();
  const { addNotification } = useUiStore();
  const [comment, setComment] = useState('');

  const act = async (kind) => {
    if (kind === 'reject' && !comment.trim()) {
      addNotification({ type: 'error', message: 'A reason is required to reject a report.' });
      return;
    }
    try {
      if (kind === 'approve') await approveReport(reportId, comment || undefined);
      else await rejectReport(reportId, comment);
      addNotification({ type: 'success', message: `Report ${kind === 'approve' ? 'approved' : 'rejected'}.` });
      onDone?.();
    } catch (e) {
      addNotification({ type: 'error', message: e.message || 'Action failed' });
    }
  };

  return (
    <Card className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-white/10">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-white">Review</h3>
        <Textarea
          label="Comments (required to reject)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add review comments..."
          rows={3}
        />
        <div className="flex gap-3">
          <Button variant="primary" isLoading={isLoading} onClick={() => act('approve')} className="flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />Approve
          </Button>
          <Button variant="danger" isLoading={isLoading} onClick={() => act('reject')} className="flex-1">
            <XCircle className="w-4 h-4 mr-2" />Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
