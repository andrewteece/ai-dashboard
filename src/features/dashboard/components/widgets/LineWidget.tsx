'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WidgetCard } from './WidgetCard';

const data = Array.from({ length: 24 }, (_, i) => ({
  x: i,
  y: Math.round(20 + Math.random() * 80),
}));

type Props = { id: string; title?: string };

export function LineWidget({ id, title = 'Traffic' }: Props) {
  const gradId = `line-grad-${id}`;

  return (
    <WidgetCard id={id} title={title}>
      {/* min-w-0 prevents Recharts from collapsing in grid/flex contexts */}
      <div className="h-48 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`hsl(var(--primary))`} stopOpacity={0.35} />
                <stop offset="100%" stopColor={`hsl(var(--primary))`} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke={`hsl(var(--border))`} strokeOpacity={0.4} vertical={false} />
            <XAxis
              dataKey="x"
              stroke={`hsl(var(--muted-foreground))`}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              width={28}
              stroke={`hsl(var(--muted-foreground))`}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />

            <Tooltip
              cursor={{ stroke: `hsl(var(--primary))`, strokeOpacity: 0.2 }}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: `1px solid hsl(var(--border))`,
                borderRadius: 8,
                color: 'hsl(var(--card-foreground))',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
              labelFormatter={(v) => `Hour ${v}`}
            />

            <Line
              type="monotone"
              dataKey="y"
              stroke={`hsl(var(--primary))`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              fill={`url(#${gradId})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
