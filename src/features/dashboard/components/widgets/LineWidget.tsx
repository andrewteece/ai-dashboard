'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { WidgetCard } from './WidgetCard';

const data = Array.from({ length: 24 }, (_, i) => ({
  x: i,
  y: Math.round(20 + Math.random() * 80),
}));

export function LineWidget({ id, title = 'Traffic' }: { id: string; title?: string }) {
  return (
    <WidgetCard id={id} title={title}>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="y" dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
