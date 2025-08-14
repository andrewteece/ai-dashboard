import "@testing-library/jest-dom/vitest";
import "whatwg-fetch";

import { expect, beforeAll, afterEach, afterAll } from "vitest";
import { toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

// --- Browser-ish shims for jsdom ---

// matchMedia (used by next-themes)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// ResizeObserver (used by charts/layout libs)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserver;

// crypto.randomUUID (used in store)
if (!("crypto" in globalThis)) (globalThis as any).crypto = {};
if (!(globalThis.crypto as any).randomUUID) {
  (globalThis.crypto as any).randomUUID = () => "test-uuid";
}

// Stable localStorage for jsdom
class LocalStorageMock {
  private store = new Map<string, string>();
  clear() { this.store.clear(); }
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, String(v)); }
  removeItem(k: string) { this.store.delete(k); }
  key(i: number) { return Array.from(this.store.keys())[i] ?? null; }
  get length() { return this.store.size; }
}
Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
  configurable: true,
});

// --- MSW: mock /api/assistant ---
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
  http.post("/api/assistant", async ({ request }) => {
    const { prompt } = (await request.json()) as { prompt?: string };
    if (!prompt) return HttpResponse.json({ error: "Invalid request" }, { status: 400 });
    return HttpResponse.json({ answer: `Echo: ${prompt}` });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
