# Health Quiz Funnel

睿迄科技（Arkon Tech）前端开发挑战 · 健康测评获客漏斗。

## Stack

- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4 (CSS-based theme config)
- Framer Motion · Zustand (with localStorage persist)
- Deployed on Vercel

## Develop

```bash
npm run dev
```

Opens at http://localhost:3000.

## Structure

- `src/app/quiz/step-[1-5]/` — quiz routes
- `src/store/` — Zustand store + persistence
- `src/components/` — shared UI

See [CLAUDE.md](./CLAUDE.md) for full project brief and development order.