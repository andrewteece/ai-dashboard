'use client';

import { cn } from '@/lib/utils';
import { WidgetCard } from './WidgetCard';

type Props = { id: string; title?: string };

type KpiItem = {
  label: string;
  value: string;
  delta?: string; // e.g. "+8.4%" or "-2.1%"
  up?: boolean; // true = up/positive, false = down/negative
};

export function KpiWidget({ id, title = 'KPI Overview' }: Props) {
  // Replace with real data later
  const items: KpiItem[] = [
    { label: 'Visitors', value: '4,982', delta: '+8.4%', up: true },
    { label: 'Signups', value: '212', delta: '+2.1%', up: true },
    { label: 'Revenue', value: '$12,480', delta: '+5.7%', up: true },
  ];

  return (
    <WidgetCard id={id} title={title}>
      {/* Auto-fit grid: each tile is at least 220px wide */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
      >
        {items.map((k) => (
          <div key={k.label} className="min-w-0 rounded-lg border p-5">
            {/* Label */}
            <div className="text-[11px] tracking-wide text-[hsl(var(--muted-foreground))] uppercase">
              {k.label}
            </div>

            {/* Big value: responsive clamp, never wraps or clips */}
            <div
              className="mt-1 leading-tight font-semibold whitespace-nowrap tabular-nums"
              style={{
                // 24px → 28px based on viewport; keeps $12,480 inside 220px tiles
                fontSize: 'clamp(1.5rem, 2.2vw, 1.75rem)',
              }}
            >
              {k.value}
            </div>

            {/* Delta under value */}
            {k.delta && (
              <span
                className={cn(
                  'mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  'border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                  k.up === true && 'text-emerald-600 dark:text-emerald-400',
                  k.up === false && 'text-rose-600 dark:text-rose-400',
                )}
                aria-label={`Change ${k.delta}`}
                title={`Change ${k.delta}`}
              >
                {k.delta}
              </span>
            )}
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
