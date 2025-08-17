// src/features/dashboard/components/DashboardHeader.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useDashboard } from '../model/dashboard.store';
import { ThemeToggle } from './ThemeToggle';

export function DashboardHeader() {
  const add = useDashboard((s) => s.addWidget);
  const setWidgets = useDashboard((s) => s.setWidgets);

  // Inline defaults so this works regardless of store exports
  const DEFAULTS = [
    { id: 'kpi-1', type: 'kpi' as const, title: 'KPI Overview' },
    { id: 'line-1', type: 'line' as const, title: 'Traffic' },
    { id: 'notes-1', type: 'notes' as const, title: 'Notes' },
  ];

  const onReset = () => {
    // Optional confirm:
    // if (!confirm('Reset dashboard layout to defaults?')) return;
    setWidgets(DEFAULTS);
  };

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold">AI Dashboard</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button variant="outline" onClick={onReset} title="Reset to default layout">
          Reset layout
        </Button>

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
