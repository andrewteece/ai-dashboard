'use client';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo } from 'react';
import { initDashboardClient, useDashboard } from '../model/dashboard.store';
import { WIDGETS } from '../utils/widget-registry';
import { DragHandleProvider } from './dnd/drag-context';

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleProps = {
    ...attributes,
    ...listeners,
  } as React.HTMLAttributes<HTMLButtonElement>;

  return (
    <div ref={setNodeRef} style={style} data-testid={`sortable-${id}`} data-sortable-item>
      <DragHandleProvider value={handleProps}>{children}</DragHandleProvider>
    </div>
  );
}

export function DashboardGrid() {
  // Seed defaults on first client mount (covers fresh tabs / cleared storage)
  useEffect(() => {
    initDashboardClient();
  }, []);

  const widgets = useDashboard((s) => s.widgets);
  const setWidgets = useDashboard((s) => s.setWidgets);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const items = useMemo(() => widgets.map((w) => w.id), [widgets]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((w) => w.id === String(active.id));
    const newIndex = widgets.findIndex((w) => w.id === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    setWidgets(arrayMove(widgets, oldIndex, newIndex));
  }

  if (!widgets || widgets.length === 0) {
    // Friendly empty state so the page never looks “blank”
    return (
      <div className="rounded-lg border p-6 text-sm text-[hsl(var(--muted-foreground))]">
        No widgets yet. Use <span className="font-medium">Add KPI</span>,{' '}
        <span className="font-medium">Add Line</span>, or{' '}
        <span className="font-medium">Add Notes</span> to get started.
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {widgets.map((w) => {
            const Renderer = WIDGETS[w.type];
            if (!Renderer) return null;
            return (
              <SortableItem key={w.id} id={w.id}>
                <Renderer {...w} />
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
