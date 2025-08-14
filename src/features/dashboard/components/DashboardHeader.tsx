'use client';

import { Button } from '@/components/ui/button';
import { useDashboard } from '../model/dashboard.store';

export function DashboardHeader() {
  const add = useDashboard((s) => s.addWidget);

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold">AI Dashboard</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => add('kpi')}>
          Add KPI
        </Button>
        <Button variant="outline" onClick={() => add('line')}>
          Add Line
        </Button>
        <Button variant="outline" onClick={() => add('notes')}>
          Add Notes
        </Button>
      </div>
    </header>
  );
}
