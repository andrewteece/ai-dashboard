// src/features/dashboard/model/dashboard.store.ts
import { z } from 'zod';
import { create } from 'zustand';

export type WidgetType = 'kpi' | 'line' | 'notes';
export type WidgetInstance = { id: string; type: WidgetType; title?: string };

type DashboardState = {
  widgets: WidgetInstance[];
  setWidgets: (w: WidgetInstance[]) => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
};

const STORAGE_KEY = 'ai_dashboard_widgets_v1';

const WidgetSchema = z.object({
  id: z.string(),
  type: z.enum(['kpi', 'line', 'notes']),
  title: z.string().optional(),
});
const WidgetsSchema = z.array(WidgetSchema);

const DEFAULTS: WidgetInstance[] = [
  { id: 'kpi-1', type: 'kpi', title: 'KPI Overview' },
  { id: 'line-1', type: 'line', title: 'Traffic' },
  { id: 'notes-1', type: 'notes', title: 'Notes' },
];

const load = (): WidgetInstance[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = WidgetsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

export const useDashboard = create<DashboardState>((set, get) => ({
  widgets: [],
  setWidgets: (w) => {
    set({ widgets: w });
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(w));
  },
  addWidget: (type) => {
    const id = `${type}-${crypto.randomUUID().slice(0, 8)}`;
    const next = [...get().widgets, { id, type }];
    get().setWidgets(next);
  },
  removeWidget: (id) => {
    const next = get().widgets.filter((w) => w.id !== id);
    get().setWidgets(next);
  },
}));

export const initDashboardClient = () => {
  if (typeof window === 'undefined') return;
  const { setWidgets } = useDashboard.getState();
  const initial = load();
  if (initial.length) setWidgets(initial);
};
