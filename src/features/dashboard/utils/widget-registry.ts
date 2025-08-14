import type { ReactNode } from 'react';
import type { WidgetInstance } from '../model/dashboard.store';

export type WidgetRenderer = (w: WidgetInstance) => ReactNode;

// We’ll fill this in after we create the concrete widgets.
export const WIDGETS: Record<string, WidgetRenderer> = {};
