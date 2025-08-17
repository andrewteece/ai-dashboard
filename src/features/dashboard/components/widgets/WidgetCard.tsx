'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useDashboard } from '../../model/dashboard.store';
import { useDragHandleProps } from '../dnd/drag-context';

type Props = {
  id: string;
  title?: string;
  children: ReactNode;
};

export function WidgetCard({ id, title, children }: Props) {
  const remove = useDashboard((s) => s.removeWidget);
  const dragHandleProps = useDragHandleProps();

  return (
    <Card className="relative border transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <div className="flex items-center gap-1">
          {dragHandleProps && (
            <Button
              variant="ghost"
              size="icon"
              className="focus-visible:ring-focused hover:text-foreground size-8 cursor-grab text-[hsl(var(--muted-foreground))] active:cursor-grabbing"
              aria-label="Drag to reorder"
              title="Drag to reorder"
              {...dragHandleProps}
            >
              <GripVertical className="size-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hover:text-foreground focus-visible:ring-focused size-8 text-[hsl(var(--muted-foreground))]"
            onClick={() => remove(id)}
            aria-label="Remove widget"
            title="Remove widget"
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
