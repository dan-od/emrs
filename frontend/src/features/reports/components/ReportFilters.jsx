import { Select, Input, Button } from '@/components/common';
import { DEPARTMENTS } from '@/utils/constants';
import { X } from 'lucide-react';

const DEPT_NAMES = Object.values(DEPARTMENTS).map(d => d.name);

/**
 * Department + date-range filters for the report pages. Emits the full filter
 * object on every change; empty fields are ignored by the API.
 */
export const ReportFilters = ({ filters, onChange }) => {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  const hasAny = filters.department || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 mb-6">
      <div className="w-full sm:w-48">
        <Select label="Department" value={filters.department || ''} onChange={(e) => set('department', e.target.value)}>
          <option value="">All Departments</option>
          {DEPT_NAMES.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      <div className="w-full sm:w-40">
        <Input label="From" type="date" value={filters.dateFrom || ''} onChange={(e) => set('dateFrom', e.target.value)} />
      </div>
      <div className="w-full sm:w-40">
        <Input label="To" type="date" value={filters.dateTo || ''} onChange={(e) => set('dateTo', e.target.value)} />
      </div>
      {hasAny && (
        <Button variant="ghost" onClick={() => onChange({ department: '', dateFrom: '', dateTo: '' })}>
          <X className="w-4 h-4 mr-1" />Clear
        </Button>
      )}
    </div>
  );
};
