'use client';

import { useEffect, useState } from 'react';
import { WidgetCard } from './WidgetCard';

type Props = { id: string; title?: string };

type KPI = { label: string; value: number };

export function KpiWidget({ id, title = 'KPI Overview' }: Props) {
  const [data, setData] = useState<KPI[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/data/kpis', { signal: ac.signal, cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: { stats: KPI[] } = await res.json();
        setData(json.stats);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          setError('Unable to load KPIs');
        }
      }
    })();
    return () => ac.abort();
  }, []);

  return (
    <WidgetCard id={id} title={title}>
      {!data && !error ? (
        // Skeleton
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-0 animate-pulse rounded-lg border p-5">
              <div className="h-3 w-20 rounded bg-[hsl(var(--muted))]" />
              <div className="mt-2 h-7 w-24 rounded bg-[hsl(var(--muted))]" />
              <div className="mt-2 h-4 w-16 rounded bg-[hsl(var(--muted))]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-sm text-[hsl(var(--muted-foreground))]" role="alert">
          {error}
        </div>
      ) : (
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          {data!.map((k) => (
            <div key={k.label} className="min-w-0 rounded-lg border p-5">
              <div className="text-[11px] tracking-wide text-[hsl(var(--muted-foreground))] uppercase">
                {k.label}
              </div>
              <div
                className="mt-1 leading-tight font-semibold whitespace-nowrap tabular-nums"
                style={{ fontSize: 'clamp(1.5rem, 2.2vw, 1.75rem)' }}
              >
                {k.label === 'Revenue' ? `$${k.value.toLocaleString()}` : k.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
