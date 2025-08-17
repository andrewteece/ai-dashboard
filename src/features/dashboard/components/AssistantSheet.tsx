'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Loader2, Send, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

type Msg = { role: 'user' | 'assistant'; content: string };
const PromptSchema = z.string().trim().min(1, 'Please type a question').max(4000);

// type-safe AbortError check (no `any`)
function isAbortError(e: unknown): boolean {
  if (e instanceof DOMException && e.name === 'AbortError') return true;
  if (typeof e === 'object' && e !== null && 'name' in e) {
    const name = (e as { name?: unknown }).name;
    return typeof name === 'string' && name === 'AbortError';
  }
  return false;
}

export default function AssistantSheet() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [chat, setChat] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!boxRef.current) return;
    boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [chat]);

  useEffect(() => {
    if (!open && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setLoading(false);
    }
  }, [open]);

  async function onAsk(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    const parsed = PromptSchema.safeParse(prompt);
    if (!parsed.success || loading) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const p = parsed.data;
    setChat((c) => [...c, { role: 'user', content: p }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: p }),
        signal: abortRef.current.signal,
      });

      const ct = res.headers.get('content-type') ?? '';

      if (ct.includes('application/json')) {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? 'Request failed');
        const answer = String(json.answer ?? '');
        setChat((c) => [...c, { role: 'assistant', content: answer }]);
        return;
      }

      if (!res.ok || !res.body) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `HTTP ${res.status}`);
      }

      setChat((c) => [...c, { role: 'assistant', content: '' }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setChat((c) => {
          const copy = [...c];
          const last = copy[copy.length - 1];
          if (last?.role === 'assistant') {
            copy[copy.length - 1] = { ...last, content: last.content + chunk };
          }
          return copy;
        });
      }
    } catch (err: unknown) {
      if (!isAbortError(err)) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function onClear() {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
    setChat([]);
    setPrompt('');
    setError(null);
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Open assistant"
          title="Open assistant"
          className="shrink-0 gap-1.5"
        >
          <Sparkles className="size-4" />
          <span className="hidden sm:inline">Assistant</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[560px]">
        {/* Hidden semantic title to satisfy Radix always */}
        <VisuallyHidden>
          <SheetTitle>AI Assistant</SheetTitle>
        </VisuallyHidden>

        <SheetHeader>
          <SheetTitle>AI Assistant</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex h-[70vh] flex-col gap-3">
          <div ref={boxRef} className="flex-1 overflow-auto rounded-md border p-3 text-sm">
            {chat.length === 0 ? (
              <p className="text-[hsl(var(--muted-foreground))]">
                Ask a question about your dashboard or KPIs…
              </p>
            ) : (
              <div className="space-y-3">
                {chat.map((m, i) => (
                  <div key={i}>
                    <div className="mb-1 text-xs tracking-wide text-[hsl(var(--muted-foreground))] uppercase">
                      {m.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className="rounded-md border bg-[hsl(var(--card))] p-3 whitespace-pre-wrap">
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onAsk} className="space-y-2">
            <Textarea
              placeholder="e.g., Suggest 3 KPIs for our trial→paid funnel…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Prompt"
              className="min-h-24"
            />
            {error && (
              <p className="text-sm text-rose-500" role="alert">
                {error}
              </p>
            )}
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading || !prompt.trim()} className="gap-1.5">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="hidden sm:inline">Thinking…</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={onClear} className="gap-1.5">
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </div>
          </form>
        </div>

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
