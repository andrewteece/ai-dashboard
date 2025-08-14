import "@testing-library/jest-dom/vitest";
import "whatwg-fetch";

import { expect, beforeAll, afterEach, afterAll } from "vitest";
import { toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

// ---- Browser-ish shims for jsdom ----

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
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
Object.defineProperty(globalThis, "ResizeObserver", {
  value: ResizeObserverMock,
  configurable: true,
});

// crypto.randomUUID (used in store)
type CryptoWithUUID = Crypto & { randomUUID?: () => string };
if (typeof globalThis.crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", { value: {} });
}
const cryptoObj = globalThis.crypto as CryptoWithUUID;
if (typeof cryptoObj.randomUUID !== "function") {
  Object.defineProperty(cryptoObj, "randomUUID", {
    value: () => "test-uuid",
    configurable: true,
  });
}

// Stable localStorage for jsdom
class LocalStorageMock {
  private store = new Map<string, string>();
  clear(): void { this.store.clear(); }
  getItem(k: string): string | null { return this.store.get(k) ?? null; }
  setItem(k: string, v: string): void { this.store.set(k, String(v)); }
  removeItem(k: string): void { this.store.delete(k); }
  key(i: number): string | null { return Array.from(this.store.keys())[i] ?? null; }
  get length(): number { return this.store.size; }
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
