import { memo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common';

// Categorical palette — brand gold first, then distinct hues that hold up in
// both light and dark themes.
export const PALETTE = ['#FF6B00', '#2563EB', '#059669', '#D946EF', '#F59E0B', '#0891B2', '#DC2626', '#64748B'];

const AXIS_TICK = { fill: '#94a3b8', fontSize: 12 };

const EmptyNote = () => (
  <div className="h-[260px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
    No data for this period yet.
  </div>
);

export const ReportChart = memo(({ title, type = 'bar', data = [], dataKey = 'value', nameKey = 'label', valueFormatter }) => {
  const hasData = Array.isArray(data) && data.some(d => Number(d[dataKey]) > 0);

  return (
    <Card className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-white/10">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {!hasData ? <EmptyNote /> : (
          <ResponsiveContainer width="100%" height={260}>
            {type === 'pie' ? (
              <PieChart>
                <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={90} label>
                  {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip formatter={valueFormatter} />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey={nameKey} tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK} allowDecimals={false} />
                <Tooltip formatter={valueFormatter} cursor={{ fill: '#94a3b815' }} />
                <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

ReportChart.displayName = 'ReportChart';
