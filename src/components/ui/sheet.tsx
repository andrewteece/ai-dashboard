// src/components/ui/sheet.tsx
'use client';

import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import * as React from 'react';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export const SheetPortal = Dialog.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <Dialog.Overlay
      ref={ref}
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-50 bg-black/40',
        className,
      )}
      {...props}
    />
  );
});

type Side = 'top' | 'bottom' | 'left' | 'right';

const sideClasses: Record<Side, string> = {
  right:
    'inset-y-0 right-0 w-3/4 sm:w-[560px] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
  left: 'inset-y-0 left-0 w-3/4 sm:w-[560px] data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
  top: 'inset-x-0 top-0 h-5/6 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
  bottom:
    'inset-x-0 bottom-0 h-5/6 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
};

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: Side }
>(function SheetContent({ side = 'right', className, children, ...props }, ref) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          'fixed z-50 grid gap-4 border bg-[hsl(var(--card))] p-4 text-[hsl(var(--card-foreground))] shadow-2xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          sideClasses[side],
          'sm:rounded-2xl',
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </SheetPortal>
  );
});

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
}

// These MUST be Dialog.Title/Description so Radix can detect them
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
