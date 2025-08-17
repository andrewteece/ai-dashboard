'use client';

import { Button } from '@/components/ui/button';
import { Plus, RotateCcw } from 'lucide-react';
import { useDashboard } from '../model/dashboard.store';

import { ThemeToggle } from './ThemeToggle';

export function DashboardHeader() {
  const add = useDashboard((s) => s.addWidget);
  const setWidgets = useDashboard((s) => s.setWidgets);

  // Inline defaults so this file doesn’t depend on store exports
  const DEFAULTS = [
    { id: 'kpi-1', type: 'kpi' as const, title: 'KPI Overview' },
    { id: 'line-1', type: 'line' as const, title: 'Traffic' },
    { id: 'notes-1', type: 'notes' as const, title: 'Notes' },
  ];

  const onReset = () => setWidgets(DEFAULTS);

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">AI Dashboard</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Reorder widgets, track KPIs, and take notes.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          title="Reset to default layout"
          className="gap-1.5"
        >
          <RotateCcw className="size-4" />
          <span>Reset</span>
        </Button>

        <Button variant="outline" size="sm" onClick={() => add('kpi')} className="gap-1.5">
          <Plus className="size-4" />
          <span>KPI</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => add('line')} className="gap-1.5">
          <Plus className="size-4" />
          <span>Line</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => add('notes')} className="gap-1.5">
          <Plus className="size-4" />
          <span>Notes</span>
        </Button>
      </div>
    </header>
  );
}
