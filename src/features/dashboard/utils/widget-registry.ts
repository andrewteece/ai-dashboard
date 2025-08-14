import type { WidgetInstance } from "../model/dashboard.store";
export type WidgetRenderer = (w: WidgetInstance) => JSX.Element;
// Filled when we add concrete widgets
export const WIDGETS: Record<string, WidgetRenderer> = {};
