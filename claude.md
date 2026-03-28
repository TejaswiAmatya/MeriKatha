# MannSathi — Claude Code Rules

## What This Project Is
MannSathi is a women-first Nepali mental health platform. It is culturally grounded, trauma-informed, and built specifically for Nepali women in Nepal and the diaspora. Every technical decision must serve that mission.

---

## Stack
- **Framework:** Express + TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Validation:** Zod (on all incoming request bodies, no exceptions)
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Dev server:** ts-node-dev

---

## Folder Structure
```
backend/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── lib/
│   └── types/
├── prisma/
│   └── schema.prisma
```

---

## API Response Shape
Every single endpoint must return this shape — no exceptions:
```ts
{ success: boolean, data: T, error?: string }
```

---

## Cultural Rules — Non-Negotiable
These apply to code comments, seed data, error messages, bot prompts, and any user-facing string:

- **No clinical words anywhere** — never use: depression, trauma, assault, therapy, mental illness, disorder, suicide, PTSD
- **Use Nenglish** — the natural Nepali-English codemix diaspora women actually speak. Example: "Stress lagyo yaar" not "I am stressed"
- **Bot never advises** — the Aangan Bot only witnesses and validates. It never says "you should", "have you tried", "I recommend"
- **Always believes first** — harassment mode never questions the experience, never asks "are you sure?"
- **Warm, not clinical** — error messages, loading states, empty states should feel like a friend, not a system

---

## Naming Conventions
- Route files: `feature.ts` (e.g. `stories.ts`, `mood.ts`)
- Controller files: `feature.controller.ts`
- Zod schemas: `featureSchema` (e.g. `storySchema`, `moodSchema`)
- Database models: PascalCase (Prisma default)
- Environment variables: SCREAMING_SNAKE_CASE

---

## Prisma + Supabase Rules
- Always use `DATABASE_URL` for app queries (pooler, port 6543)
- Always use `DIRECT_URL` for migrations (port 5432)
- Both must be set in `.env` — never hardcode connection strings
- Use `prisma db push` for schema changes during development
- Never commit `.env`

---

## What NOT To Build
- ❌ Authentication system — everything is anonymous
- ❌ Native mobile app — web only
- ❌ Didi Circles backend — show as mockup only
- ❌ Real-time features — out of scope
- ❌ Video/voice — out of scope
- ❌ Matching algorithm — seed circles manually
