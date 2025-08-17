'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Light' : 'Dark';
  const aria = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={aria}
      className="gap-1.5"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {/* Hide label on xs; show from sm+ */}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
