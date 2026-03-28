# MannSathi — Claude Code Rules

## What This Project Is
MannSathi is a women-first Nepali mental health platform. It is culturally grounded, trauma-informed, and built specifically for Nepali women in Nepal and the diaspora. Every technical decision must serve that mission.

---

## Stack

### Backend
- **Framework:** Express + TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL) via PgBouncer pooler
- **ORM:** Prisma 7 (wasm-based, no query engine binary)
- **Validation:** Zod (on all incoming request bodies, no exceptions)
- **Auth:** bcrypt + JWT in httpOnly cookie (30-day expiry)
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`) — not yet wired up
- **Dev server:** ts-node-dev (`--respawn --transpile-only`)

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v3 with custom design tokens
- **Routing:** React Router DOM v6
- **Fonts:** Playfair Display (serif) + Hind (sans)
- **Dev server:** `vite` (`npm run dev` inside `frontend/`)
- **API base:** `VITE_API_URL` env var (falls back to `http://localhost:3001`)
- **No Firebase** — removed; all data goes through the Express backend

---

## Folder Structure

```
backend/
├── index.ts                  # Express entry point (CORS, cookies, routes, Swagger)
├── prisma.config.ts          # Prisma 7 config — datasource URL lives here (not in schema)
├── config/
│   └── swagger.ts            # OpenAPI 3.0 spec
├── controller/
│   └── auth.controller.ts    # signup / login / logout / me
├── controllers/
│   └── meriKathaControllers.ts  # getStories / setStories / suneinStory
├── generated/
│   └── prisma/               # Auto-generated Prisma client — do not edit
├── lib/
│   ├── jwt.ts                # signToken / verifyToken (30d expiry)
│   └── prisma.ts             # PrismaClient singleton via PrismaPg adapter
├── middleware/
│   └── auth.ts               # requireAuth middleware
├── prisma/
│   ├── schema.prisma         # User + Story models (NO url/directUrl — Prisma 7)
│   └── seed.ts               # DB seeding script
├── routes/
│   ├── auth.ts               # /api/auth/* with Zod signup validation
│   └── meriKathaRoutes.ts    # /api/stories/* with Swagger JSDoc
├── schema/
│   └── storySchema.ts        # z.object({ content: string.min(10).max(500) })
├── src/
│   └── storyContentCheck.ts  # Content moderation (crisis / abuse / clinical flags)
├── types/
│   └── express.d.ts          # Augments Express Request with user?: JwtPayload
└── tsconfig.json

frontend/
├── src/
│   ├── App.tsx               # Router + ProtectedRoute + AuthProvider wrapper
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── feed/             # PostCard, FeedList, StoryInput, Topbar, BottomNav,
│   │   │                     # LeftSidebar, RightSidebar, BentoBlock
│   │   └── ui/
│   │       ├── DhakaBand.tsx
│   │       └── SOSButton.tsx
│   ├── context/
│   │   └── AuthContext.tsx   # AuthProvider + useAuth hook
│   ├── data/
│   │   └── mockStories.ts    # Seed stories + circle/flair definitions + relativeTime()
│   ├── hooks/
│   │   └── useReveal.ts      # IntersectionObserver for scroll-triggered fadeUp
│   ├── pages/
│   │   ├── Landing.tsx       # Public home — bilingual, diyo hero, wisdom card
│   │   ├── Login.tsx         # Split-panel: maroon identity panel + cream form
│   │   ├── Signup.tsx        # Split-panel: Didi Circles preview + form
│   │   ├── Stories.tsx       # /feed — sidebar layout, fetches from /api/stories
│   │   ├── Feed.tsx          # /story — create + view stories (simple layout)
│   │   ├── Sahara.tsx        # Crisis resources (Nepal + diaspora + US)
│   │   └── Bot.tsx           # Aangan Bot — placeholder
│   └── types/
│       └── feed.ts           # Circle, Flair, Story interfaces
├── public/assets/            # diyo.png, other Nepali cultural images
├── tailwind.config.js
└── vite.config.ts            # Proxy: /api/* → http://localhost:3001
```

---

## Frontend Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | `Landing` | public | Home page with hero, features, wisdom card |
| `/login` | `Login` | public | Split-panel login form |
| `/signup` | `Signup` | public | Split-panel signup form |
| `/feed` | `Stories` | protected | Main Meri Katha feed (sidebar layout) |
| `/story` | `Feed` | protected | Create + view stories (simple layout) |
| `/sahara` | `Sahara` | protected | Crisis resources directory |
| `/bot` | `Bot` | protected | Aangan Bot — placeholder |

After login/signup `navigate('/feed')` is called. `ProtectedRoute` redirects unauthenticated users to `/signup`.

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | none | Email + password (min 8 chars), sets JWT cookie |
| POST | `/api/auth/login` | none | Verify credentials, sets JWT cookie |
| POST | `/api/auth/logout` | none | Clears cookie |
| GET | `/api/auth/me` | `requireAuth` | Returns `{ userId, email }` |

### Stories (`/api`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/stories` | none | Latest 50 APPROVED stories, newest first |
| POST | `/api/stories` | none | Submit story — runs content check before saving |
| POST | `/api/stories/:id/sunein` | none | Increment suneinCount |

Swagger docs at `/api-docs`.

---

## API Response Shape
Every single endpoint must return this shape — no exceptions:
```ts
{ success: boolean, data: T, error?: string }
```

Story POST may also include:
```ts
{ success: false, showResources: true }   // crisis content blocked
{ success: true, flags: ['clinical_language'] }  // gentle nudge
```

---

## Prisma 7 Rules

Prisma 7 changed several things — do not apply Prisma 5/6 patterns:

- **No `url` or `directUrl` in `schema.prisma`** — datasource has only `provider`. URLs live in `prisma.config.ts`.
- **`prisma.config.ts`** sets `datasource.url` to `DIRECT_URL` (port 5432) for migrations.
- **`lib/prisma.ts`** handles the app connection via `PrismaPg` adapter (port 6543 pooler), stripping `sslmode` to avoid Supabase SSL cert rejection.
- **Generated client** lives at `backend/generated/prisma/` — import via `lib/prisma` (singleton), never directly.
- Run `npx prisma generate` after any schema change.
- Run `npx prisma db push` to sync schema to Supabase during development.
- Never commit `.env`.

---

## Auth Rules
- JWT stored in httpOnly cookie named `token`, 30-day expiry
- `req.user` typed via `types/express.d.ts` — augments Express `Request` with `user?: JwtPayload`
- `requireAuth` middleware from `middleware/auth.ts` — apply to mood, circle, bot routes
- Stories routes are currently **open** (no auth required) by design
- CORS: `credentials: true`, explicit `CLIENT_URL` origin (never `*`)
- All frontend fetches use `credentials: 'include'`

---

## Content Moderation (`src/storyContentCheck.ts`)

Three levels, applied in order on every POST `/api/stories`:

1. **CRISIS_CONTENT** — blocks submission, `showResources: true`
   - Explicit self-harm phrases in English + transliterated Nepali
   - Saved to DB with `status: DELETED` for review

2. **ABUSIVE_CONTENT** — blocks submission, no resources shown
   - Slurs against women in English, Nepali, Hindi
   - Saved to DB with `status: DELETED` for review

3. **clinical_language** — non-blocking flag
   - Returns `flags: ['clinical_language']` alongside saved story
   - Frontend shows a warm nudge to use "heart language" instead

---

## Design Tokens (Tailwind)
| Token | Hex | Use |
|-------|-----|-----|
| `pageBg` | `#F5F0E6` | Page background (warm cream) |
| `feedBg` | `#EDE8DC` | Card / feed background |
| `ink` | `#1A1410` | Primary text / buttons |
| `sindoor` | `#C0392B` | Accent red (CTA pulses, highlights) |
| `marigold` | `#E8A020` | Accent yellow |
| `maroon` | `#7B3F2B` | Dark section backgrounds (Login/Signup left panel) |
| `himalayan` | `#4A9B7E` | Green accent |
| `sand` | `#D4C5A9` | Borders, dividers |
| `cardWhite` | `#FFFFFF` | Card surfaces |
| `peach` | `#F4D9C6` | Soft accent |
| `textBody` | `#5C4A35` | Body copy |
| `textMuted` | `#9A7B5A` | Muted / secondary text |

Custom animations: `animate-fadeUp`, `animate-flicker`, `animate-ripple`

---

## UI Components
- **DhakaBand** — repeating-linear-gradient horizontal stripe in sindoor/marigold/himalayan/sand; used as section dividers and in Login/Signup panels
- **SOSButton** — fixed bottom-right "सहारा" button; opens crisis resources modal (Saathi Nepal, TPO Nepal, 988, Emergency 100); always rendered regardless of auth state
- **useReveal** — IntersectionObserver hook; adds `animate-fadeUp` class when element scrolls into view

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
- Route files: `feature.ts` (e.g. `auth.ts`, `meriKathaRoutes.ts`)
- Controller files: `feature.controller.ts` or `featureControllers.ts`
- Zod schemas: `featureSchema` (e.g. `storySchema`, `moodSchema`)
- Database models: PascalCase (Prisma default)
- Environment variables: SCREAMING_SNAKE_CASE

---

## What NOT To Build
- ❌ Native mobile app — web only
- ❌ Didi Circles backend — show as mockup only
- ❌ Real-time features — out of scope
- ❌ Video/voice — out of scope
- ❌ Matching algorithm — seed circles manually
- ❌ Firebase / Firestore — removed; do not re-add
