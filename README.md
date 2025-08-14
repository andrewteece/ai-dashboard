# AI Dashboard

[![CI](https://github.com/andrewteece/ai-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewteece/ai-dashboard/actions/workflows/ci.yml)

A modern, feature-first **Next.js 15** app using **Tailwind CSS v4**, **TypeScript**, **Zustand**, and manual ShadCN-style UI (v4-compatible). The goal is a customizable, AI-assisted analytics dashboard with draggable widgets and an assistant side panel.

**Live:** https://ai-dashboard-1acrwhndz-andrewteeces-projects.vercel.app/

---

## Project status

- ✅ Scaffold & structure (feature-first, senior layout)
- ✅ Tailwind **v4** via PostCSS; global tokens; light/dark themes
- ✅ Root layout + basic dashboard page
- ✅ UI primitives (Button, Card, Input, Textarea, Sheet)
- ✅ Theme provider (**next-themes**) + header toggle
- ✅ API `/api/assistant` with **Zod** request validation (echo for now)
- ✅ Testing: **Vitest**, React Testing Library, **MSW**, **jest-axe**
- ✅ CI: GitHub Actions (typecheck → lint → test → build)
- ⏳ Assistant: connect to OpenAI (non-stream → streaming)
- ⏳ Widgets: KPI / Line / Notes polish & settings
- ⏳ Drag-and-drop layout (dnd-kit) + persistence
- ⏳ Blog: daily build posts to portfolio site

---

## ✨ Features

- ⚡️ **Next.js 15** (App Router) + **TypeScript**
- 🎨 **Tailwind v4** with a single `@import "tailwindcss"` and CSS variable tokens
- 🧩 ShadCN-style UI primitives (Radix + CVA + tailwind-merge)
- 🧠 **Zustand** store with `localStorage` persistence
- 📈 Charts via **Recharts**
- 🤖 Assistant sheet UI (echo today; OpenAI next)
- 🔀 DnD with **dnd-kit** (planned)

---

## 🧰 Tech stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** Radix UI, class-variance-authority, tailwind-merge, lucide-react
- **State:** Zustand
- **Testing:** Vitest, @testing-library/react, MSW, jest-axe
- **Runtime:** Node 20 · **Package manager:** pnpm 10 (Corepack)

---

## 🚀 Getting started

### Prerequisites
- Node **20**
- pnpm **10** (via Corepack)

```bash
node -v
corepack enable
corepack prepare pnpm@10 --activate
pnpm -v
