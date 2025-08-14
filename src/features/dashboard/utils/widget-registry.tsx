import type { ReactElement } from 'react';
import type { WidgetInstance } from '../model/dashboard.store';

import { KpiWidget } from '../components/widgets/KpiWidget';
import { LineWidget } from '../components/widgets/LineWidget';
import { NotesWidget } from '../components/widgets/NotesWidget';

export type WidgetRenderer = (w: WidgetInstance) => ReactElement;

export const WIDGETS: Record<WidgetInstance['type'], WidgetRenderer> = {
  kpi: (w) => <KpiWidget id={w.id} title={w.title ?? 'KPI Overview'} />,
  line: (w) => <LineWidget id={w.id} title={w.title ?? 'Traffic'} />,
  notes: (w) => <NotesWidget id={w.id} title={w.title ?? 'Notes'} />,
};
