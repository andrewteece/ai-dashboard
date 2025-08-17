'use client';

import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { WidgetCard } from './WidgetCard';

type Props = { id: string; title?: string };

export function NotesWidget({ id, title = 'Notes' }: Props) {
  const storageKey = `notes_${id}`;
  const [val, setVal] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(storageKey);
    if (saved) setVal(saved);
  }, [storageKey]);

  return (
    <WidgetCard id={id} title={title}>
      <Textarea
        placeholder="Write notes…"
        className="min-h-28"
        value={val}
        onChange={(e) => {
          const v = e.target.value;
          setVal(v);
          if (typeof window !== 'undefined') localStorage.setItem(storageKey, v);
        }}
        aria-label="Notes"
      />
    </WidgetCard>
  );
}
