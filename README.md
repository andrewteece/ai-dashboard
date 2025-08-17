# AI Dashboard

[![CI](https://github.com/andrewteece/ai-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewteece/ai-dashboard/actions/workflows/ci.yml)

A modern, feature-first **Next.js 15** app using **Tailwind CSS v4**, **TypeScript**, **Zustand**, and Radix-based UI. Build a customizable, AI-assisted analytics dashboard with draggable widgets and an assistant side panel.

**Live:** https://ai-dashboard-hpggof8xs-andrewteeces-projects.vercel.app/

---

## Project status

- ✅ App scaffold (App Router) + senior file structure
- ✅ Styling: **Tailwind v4** (single `@import "tailwindcss"`) + theme tokens + light/dark
- ✅ UI primitives: Button, Card, Input, Textarea, Sheet (Radix-based)
- ✅ Dashboard: header, theme toggle, responsive layout
- ✅ Widgets: **KPI**, **Line**, **Notes** (clean, modern visuals)
- ✅ **Drag & Drop**: reorder widgets (dnd-kit) + keyboard a11y + tests
- ✅ State: **Zustand** store (with `localStorage` persistence)
- ✅ Assistant: side sheet UI with **streaming**, **abort/cancel**, **mock mode**
- ✅ API: `/api/assistant` — health check, **mock streaming** (default), OpenAI hookup ready
- ✅ Tooling: TypeScript, ESLint, Prettier, Vitest + RTL + MSW + jest-axe
- ✅ CI: GitHub Actions (Node 20 + Corepack pnpm, typecheck → lint → test → build)
- ⏳ Next: settings panel per widget, saved layouts, blog posts, real data sources

---

## Features

- ⚡️ **Next.js 15** + **TypeScript**
- 🎨 **Tailwind v4** with CSS variables for theme tokens (v4-ready, no v3 shims)
- 🧩 Radix primitives + class-variance-authority + tailwind-merge
- 🧠 **Zustand** store for layout/widgets (persisted)
- 🔀 **dnd-kit** sortable grid (mouse + keyboard a11y)
- 📈 **Recharts** for sparkline/line visuals
- 🤖 Assistant sheet with **streamed responses**, **AbortController** for “Stop”, and **Copy** last answer
- 🧪 Vitest + React Testing Library + **MSW** + jest-axe

---

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI, class-variance-authority, tailwind-merge, lucide-react
- **State**: Zustand (+ persist)
- **Charts**: Recharts
- **Testing**: Vitest, RTL, MSW, jest-axe
- **Package manager**: pnpm 10 (via Corepack)
- **Node**: 20.x

---









