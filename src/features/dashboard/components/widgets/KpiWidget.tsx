// src/features/dashboard/components/widgets/KpiWidget.tsx
'use client';

import { WidgetCard } from './WidgetCard';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function KpiWidget({ id, title = 'KPI Overview' }: { id: string; title?: string }) {
  const visitors = Math.floor(100 + Math.random() * 900);
  const signups = Math.floor(10 + Math.random() * 90);
  const revenue = Math.floor(1000 + Math.random() * 9000);

  const metrics = [
    { label: 'Visitors', value: visitors },
    { label: 'Signups', value: signups },
    { label: 'Revenue', value: currency.format(revenue) }, // format AFTER math
  ];

  return (
    <WidgetCard id={id} title={title}>
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-md border p-3">
            <div className="text-xs text-[hsl(var(--muted-foreground))]">{m.label}</div>
            <div className="mt-1 text-2xl font-semibold">{m.value}</div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
