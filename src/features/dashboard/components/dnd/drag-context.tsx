'use client';

import * as React from 'react';

/** Props we’ll spread onto the drag handle button */
export type DragHandleProps = React.HTMLAttributes<HTMLButtonElement> | null;

const DragHandleCtx = React.createContext<DragHandleProps>(null);

export function DragHandleProvider({
  value,
  children,
}: {
  value: DragHandleProps;
  children: React.ReactNode;
}) {
  return <DragHandleCtx.Provider value={value}>{children}</DragHandleCtx.Provider>;
}

export function useDragHandleProps() {
  return React.useContext(DragHandleCtx);
}
