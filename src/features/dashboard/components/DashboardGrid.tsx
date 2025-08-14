'use client';

import { useEffect } from 'react';
import { initDashboardClient, useDashboard } from '../model/dashboard.store';
import { WIDGETS } from '../utils/widget-registry';

export function DashboardGrid() {
  const widgets = useDashboard((s) => s.widgets);

  useEffect(() => {
    initDashboardClient();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {widgets.map((w) => {
        const render = WIDGETS[w.type];
        return <div key={w.id}>{render(w)}</div>;
      })}
    </div>
  );
}
