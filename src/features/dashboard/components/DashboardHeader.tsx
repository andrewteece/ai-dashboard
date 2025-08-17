'use client';

import { Button } from '@/components/ui/button';
import { Activity, BarChart3, RotateCcw, StickyNote } from 'lucide-react';
import { useDashboard } from '../model/dashboard.store';
import AssistantSheet from './AssistantSheet';
import { ThemeToggle } from './ThemeToggle';

export function DashboardHeader() {
  const add = useDashboard((s) => s.addWidget);
  const setWidgets = useDashboard((s) => s.setWidgets);

  const DEFAULTS = [
    { id: 'kpi-1', type: 'kpi' as const, title: 'KPI Overview' },
    { id: 'line-1', type: 'line' as const, title: 'Traffic' },
    { id: 'notes-1', type: 'notes' as const, title: 'Notes' },
  ];

  const onReset = () => setWidgets(DEFAULTS);

  return (
    <header className="mb-6">
      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">AI Dashboard</h1>
          <p className="max-w-[65ch] text-sm text-[hsl(var(--muted-foreground))]">
            Reorder widgets, track KPIs, and take notes.
          </p>
        </div>

        <div className="mt-1 flex w-full flex-wrap items-center gap-x-2 gap-y-2 sm:justify-end">
          <div className="shrink-0">
            <ThemeToggle />
          </div>

          {/* Assistant trigger */}
          <AssistantSheet />

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            title="Reset to default layout"
            aria-label="Reset to default layout"
            className="shrink-0 gap-1.5"
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => add('kpi')}
            title="Add KPI widget"
            aria-label="Add KPI widget"
            className="shrink-0 gap-1.5"
          >
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">KPI</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => add('line')}
            title="Add Line widget"
            aria-label="Add Line widget"
            className="shrink-0 gap-1.5"
          >
            <Activity className="size-4" />
            <span className="hidden sm:inline">Line</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => add('notes')}
            title="Add Notes widget"
            aria-label="Add Notes widget"
            className="shrink-0 gap-1.5"
          >
            <StickyNote className="size-4" />
            <span className="hidden sm:inline">Notes</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
