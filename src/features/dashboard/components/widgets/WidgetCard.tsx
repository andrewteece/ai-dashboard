'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '../../model/dashboard.store';

type Props = {
  id: string;
  title?: string;
  children: React.ReactNode;
};

export function WidgetCard({ id, title, children }: Props) {
  const remove = useDashboard((s) => s.removeWidget);

  return (
    <Card className="relative shadow-sm transition hover:shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => remove(id)}>
          Remove
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
