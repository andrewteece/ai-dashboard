# AI Dashboard

A modern, feature-first **Next.js 15** app using **Tailwind CSS v4**, **TypeScript**, **Zustand**, **dnd-kit**, and **manual ShadCN-style UI** (v4-compatible). The goal is a customizable, AI-assisted analytics dashboard with draggable widgets and an assistant side panel.

> Status: Scaffold complete (Tailwind v4, senior file structure, UI primitives, dashboard store). Next up: header, grid, widgets, and AI panel.

---

## ✨ Features (planned & in-progress)

- ⚡️ Next.js 15 (App Router) + TypeScript
- 🎨 Tailwind **v4** (single import) with CSS variables for theming
- 🧩 Manual ShadCN-style UI primitives (no CLI; Radix + CVA + tailwind-merge)
- 🧠 Zustand store with localStorage persistence for widget layout
- 🔀 Drag & drop layout with **dnd-kit**
- 📈 Charts via **Recharts**
- 🤖 AI Assistant (sheet UI + `/api/assistant` route; OpenAI integration to follow)
- ♻️ Feature-first structure for clean boundaries and scale

---

## 🧰 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, design tokens via CSS variables
- **UI Primitives:** Radix UI + class-variance-authority + tailwind-merge (ShadCN-style)
- **State:** Zustand
- **DnD:** dnd-kit
- **Charts:** Recharts
- **Icons:** lucide-react
- **Node:** 20 · **pnpm:** 9

---

## 🚀 Getting Started

### Prerequisites
- Node **20**
- pnpm **9**
```bash
node -v
corepack enable
corepack prepare pnpm@9 --activate
pnpm -v
