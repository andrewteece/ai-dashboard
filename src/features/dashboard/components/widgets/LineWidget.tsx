'use client';

import { useEffect, useState } from 'react';
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

type Props = { id: string; title?: string };
type Point = { day: string; value: number };

export function LineWidget({ id, title = 'Traffic' }: Props) {
  const [data, setData] = useState<Point[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const gradId = `line-grad-${id}`;

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/data/traffic?days=14', {
          signal: ac.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: { series: Point[] } = await res.json();
        setData(json.series);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          setError('Unable to load traffic');
        }
      }
    })();
    return () => ac.abort();
  }, []);

  return (
    <WidgetCard id={id} title={title}>
      {!data && !error ? (
        <div className="h-48 w-full min-w-0 animate-pulse rounded-md border" aria-busy="true" />
      ) : error ? (
        <div className="text-sm text-[hsl(var(--muted-foreground))]" role="alert">
          {error}
        </div>
      ) : (
        <div className="h-48 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data!} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(var(--primary))`} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={`hsl(var(--primary))`} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke={`hsl(var(--border))`} strokeOpacity={0.4} vertical={false} />
              <XAxis
                dataKey="day"
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
                labelFormatter={(l) => `Day: ${l}`}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke={`hsl(var(--primary))`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                fill={`url(#${gradId})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
