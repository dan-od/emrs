import { Button } from '@/components/common';
import { Download } from 'lucide-react';

const toCsv = (rows) => {
  if (!rows?.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
};

/**
 * Exports an array of flat objects as a downloaded CSV. No-ops with a disabled
 * button when there is nothing to export.
 */
export const ReportExport = ({ rows = [], filename = 'report.csv', label = 'Export CSV' }) => {
  const handleExport = () => {
    const csv = toCsv(rows);
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={!rows?.length}>
      <Download className="w-4 h-4 mr-2" />{label}
    </Button>
  );
};
