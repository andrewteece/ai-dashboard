'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '../../model/dashboard.store';
import { useDragHandleProps } from '../dnd/drag-context';

type Props = {
  id: string;
  title?: string;
  children: React.ReactNode;
};

export function WidgetCard({ id, title, children }: Props) {
  const remove = useDashboard((s) => s.removeWidget);
  const dragHandleProps = useDragHandleProps();

  return (
    <Card className="relative shadow-sm transition hover:shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-1">
          {/* Drag handle appears when DnD provides props */}
          {dragHandleProps && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
              {...dragHandleProps}
            >
              ⇅
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => remove(id)}>
            Remove
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
