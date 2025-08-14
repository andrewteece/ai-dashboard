"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

export default function AssistantSheet() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAsk(e?: React.FormEvent) {
    e?.preventDefault();
    const p = prompt.trim();
    if (!p || loading) return;
    setLoading(true);
    setError(null);
    setChat((c) => [...c, { role: "user", content: p }]);
    setPrompt("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Request failed");
      const answer = String(json.answer ?? "");
      setChat((c) => [...c, { role: "assistant", content: answer }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onClear() {
    setChat([]);
    setPrompt("");
    setError(null);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">Ask AI</Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[520px]">
        <SheetHeader>
          <SheetTitle>AI Assistant</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex h-[70vh] flex-col gap-3">
          <div className="flex-1 overflow-auto rounded-md border p-3 text-sm">
            {chat.length === 0 ? (
              <p className="text-[hsl(var(--muted-foreground))]">Ask a question about your dashboard…</p>
            ) : (
              <div className="space-y-3">
                {chat.map((m, i) => (
                  <div key={i}>
                    <div className="mb-1 text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                      {m.role === "user" ? "You" : "Assistant"}
                    </div>
                    <div className="whitespace-pre-wrap rounded-md border bg-[hsl(var(--card))] p-3">
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onAsk} className="space-y-2">
            <Textarea
              placeholder="Write your prompt…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading || !prompt.trim()}>
                {loading ? "Thinking…" : "Send"}
              </Button>
              <Button type="button" variant="ghost" onClick={onClear}>Clear</Button>
            </div>
          </form>
        </div>

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
