'use client';

import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { WidgetCard } from './WidgetCard';

export function NotesWidget({ id, title = 'Notes' }: { id: string; title?: string }) {
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
        value={val}
        onChange={(e) => {
          const v = e.target.value;
          setVal(v);
          if (typeof window !== 'undefined') localStorage.setItem(storageKey, v);
        }}
      />
    </WidgetCard>
  );
}
