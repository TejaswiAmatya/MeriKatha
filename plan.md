# MannSathi — Product Requirements Document

**Project:** MannSathi (folder: MeriKatha)
**Context:** Hackathon — hard 48-hour deadline
**Date:** 2026-03-28
**Team:** 5+ devs

---

## 1. What We Are Building

MannSathi is a women-first, anonymous Nepali mental health platform. It is culturally grounded, trauma-informed, and built for Nepali women in Nepal and the diaspora. Every feature must feel like a trusted didi (elder sister), not a clinical system. No login. No judgment. No clinical language — ever.

---

## 2. Goals

- Ship a fully demo-able product within 48 hours
- The 3 hero features must be flawless: Meri Katha + Aangan Bot + Diyo Baaln
- Pass the "would a Nepali auntie feel safe here" test in every UI string
- Judges must see real data flowing (Supabase), real AI (Claude API), real emotion

---

## 3. Non-Goals (Do Not Build)

| Feature | Reason |
|---|---|
| Authentication / login | Everything is anonymous by design |
| Native mobile app | Web-only |
| Didi Circles backend | Mockup only (hardcoded UI) |
| Real-time features (sockets) | Out of scope |
| Video / voice | Out of scope |
| Matching algorithm | Seed circles manually |
| Sutkeri tracker | Future feature — mention in pitch only |
| Teej mode | Describe in pitch, do not build |
| Voice journaling | Too risky technically, cut |

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Routing | React Router v6 (multi-page, URL-based) |
| Backend | Express + TypeScript (strict mode) |
| Dev server | ts-node-dev |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Validation | Zod (all incoming request bodies — no exceptions) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Styling | CSS (marigold / deep maroon / sage green / warm cream palette) |

### Environment Variables (never hardcode, never commit)
```
DATABASE_URL=         # Supabase pooler, port 6543 — for Prisma app queries
DIRECT_URL=           # Supabase direct, port 5432 — for prisma db push
GROQ_API_KEY=         # Groq API key — backend only, never exposed to browser
```

---

## 5. API Response Contract

Every endpoint — without exception — returns:
```ts
{ success: boolean, data: T, error?: string }
```

---

## 6. Frontend Routes

| Route | Feature |
|---|---|
| `/` | Home — Mann ko Mausam mood check-in (entry point) |
| `/stories` | Meri Katha — anonymous story wall |
| `/bot` | Aangan Bot — AI companion |
| `/diyo` | Diyo Baaln — virtual diyo |
| `/sahara` | Sahara — resource map |
| `/circles` | Didi Circles — hardcoded mockup |

**Persistent across all routes:**
- SOS Whisper button (bottom-right corner, small, discreet)
- Buwa-Aama ko Guff wisdom card (header or home screen)

---

## 7. Feature Specifications

---

### 7.1 Mann ko Mausam — Mood Check-in
**Route:** `/` (home screen, first thing user sees)

**User Flow:**
1. User lands on home — sees "Aaja kasto lagdai cha?" with 5 weather icons
2. Taps a mood — gets one warm Nenglish affirmation
3. Mood + timestamp stored anonymously in Supabase
4. User can tap "Aangan maa jaau" to explore the rest of the app

**Mood Options:**
| Nepali Label | Devanagari | Weather Icon | Meaning |
|---|---|---|---|
| Sunny | घाम लागेको | ☀️ | Feeling good |
| Cloudy | बादली | ⛅ | Mixed feelings |
| Foggy | कुहिरो | 🌫️ | Uncertain / numb |
| Stormy | आँधी | ⛈️ | Very heavy |
| Drizzle | झरी | 🌧️ | Quiet sadness |

**Affirmations (Nenglish, warm):**
- Sunny: "Yasto din lai embrace gara, didi. Khushi feel garna thik cha."
- Cloudy: "Mixed feelings hunu normal ho. Sab kuch thik huncha."
- Foggy: "Confused feel garna pani ek kism ko bravery ho."
- Stormy: "Yo bhari lageko mann suneko cha. Eklai chaina."
- Drizzle: "Yo sadness lai judge nagara. Yahan safe cha."

**Backend:**
- `POST /api/mood` — stores `{ mood: string, createdAt: DateTime }` — no user ID
- Returns affirmation string based on mood value

**Database Model:**
```prisma
model MoodCheckin {
  id        String   @id @default(cuid())
  mood      String
  createdAt DateTime @default(now())
}
```

**Zod Schema:**
```ts
const moodSchema = z.object({
  mood: z.enum(['sunny', 'cloudy', 'foggy', 'stormy', 'drizzle'])
})
```

---

### 7.2 Meri Katha — Anonymous Story Wall
**Route:** `/stories`

**User Flow:**
1. User sees a wall of anonymous posts (seeded + real)
2. Reads a story — sees a "Maile Sunein" button (no count displayed)
3. Taps "Maile Sunein" — button state changes to "Suniyeko cha" (session state, not DB)
4. Scrolls to a text input at the bottom: "Tero katha share gar..."
5. Posts anonymously — story appears immediately on the wall

**Reaction Logic:**
- Tracked in React component state only
- Cannot re-tap within the same session
- Resets on page refresh (no localStorage, no fingerprinting)
- Count is NOT shown — only the button state change

**Seeded Stories (5-6 pre-loaded, written in Nenglish):**
```
1. "Sasurali maa sab kuch thik dekhaucha outta face but ghar bhitra chain chaina. Koi sunidaina lagcha."
2. "Office maa presentation gareko din — boss le appreciate gare. Tara ghar aayepachi feri eklai feel garyo."
3. "Aama sangha argue garyo aaja. Dukha lagyo. Tara bhannu pani garo cha."
4. "Visa process stress le frustrated lagyo. Sab kuch uncertain feel hunchha."
5. "Naani ko school pressure le afai stressed hunchu. Ko herna aucha mero stress?"
6. "Ghar bata टाढा bhayera sometimes Nepali food ko smell miss garchhu. Bisaune kura ho tara man lagcha."
```

**Backend:**
- `GET /api/stories` — returns all stories, newest first, limit 50
- `POST /api/stories` — creates story with `{ content: string }`
- `POST /api/stories/:id/sunein` — increments `suneinCount` in DB (no auth check)

**Database Model:**
```prisma
model Story {
  id          String   @id @default(cuid())
  content     String
  suneinCount Int      @default(0)
  createdAt   DateTime @default(now())
}
```

**Zod Schema:**
```ts
const storySchema = z.object({
  content: z.string().min(10).max(500)
})
```

**Seeding:** Use `prisma db seed` or a one-time seed script.

---

### 7.3 Aangan Bot — AI Companion
**Route:** `/bot`

**Architecture:** Frontend → Express backend → Claude API
- API key NEVER leaves the server
- Session-only history: stored in React state, cleared on refresh
- No user ID, no conversation stored in DB

**User Flow:**
1. User opens bot — sees a warm welcome: "Yahan ma cha. Ke lagdai cha aaja?"
2. Types a message — bot responds in Nenglish
3. Conversation continues in the same session
4. Refresh = clean slate (anonymous by design)

**System Prompt (strict, non-negotiable):**
```
You are Aangan Bot — a warm, non-judgmental Nepali-English AI companion for women.

LANGUAGE: Always respond in natural Nepali-English codemix (Nenglish). Example: "Yaar, stress lagyo hola teslai" not "She must have been stressed."

YOUR ROLE: You only witness and validate. You never advise, never say "you should", "have you tried", "I recommend", or suggest any course of action.

FORBIDDEN WORDS: Never use — depression, trauma, assault, therapy, mental illness, disorder, suicide, PTSD, or any clinical terminology.

ALWAYS BELIEVE: Never question or doubt what the user shares. Never say "are you sure?", "that's unusual", or imply skepticism.

TONE: Like a trusted didi (elder sister) — warm, present, unhurried.

RESPONSE LENGTH: Keep responses 2-4 sentences. Never lecture. Never list. Just be present.

If a user seems to be in immediate danger, gently say: "Tero kura sun-era maan gayo. Ek kaam garnu — Saathi Nepal ko number 16600 maa call gar na. Ma yahan nai cha."
```

**Backend:**
- `POST /api/bot/chat`
- Request: `{ messages: { role: 'user' | 'assistant', content: string }[] }`
- Passes full session history to Claude for context
- Returns: `{ reply: string }`

**Zod Schema:**
```ts
const botMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000)
  })).min(1).max(50)
})
```

**Demo Scenarios (have these ready and tested):**
1. Career pressure: "Office maa promotion gachhu tara aama le ghar ma focus gar bhancha. Ke garnu?"
2. Family tension: "Sasurali ghar maa afno laagdaina. Sab thau afno ghar jasto laagcha tara yo ghar afno laagdaina."
3. Loneliness in diaspora: "US maa 3 years bhayo tara Nepali auntis le judge garchhan, Americans le bujhdainan. Kahilekahi eklai feel hunchha."

---

### 7.4 Diyo Baaln — Light a Virtual Diyo
**Route:** `/diyo`

**User Flow:**
1. User sees an unlit diyo on a dark, warm background
2. Taps "Diyo baal" — animation: diyo flickers to life
3. Text area appears: "Ke bhanchhau maan maa? Ek word, ek ichha, ek dar..." (private by default)
4. Two options:
   - "Afnai rakhchu" — saves nothing, just the private animation moment
   - "Sansaar maa pathau" — posts anonymously to the shared prayer wall (Supabase)
5. If released: appears on the shared diyo wall with a gentle flame animation

**Shared Prayer Wall:**
- Shows released diyos (text + soft flame icon)
- Newest first, limit 30 visible at once
- No reactions, no comments — just presence

**Backend:**
- `GET /api/diyos` — returns public diyos, newest 30
- `POST /api/diyos` — creates a public diyo `{ intention: string }`
- Private diyos: nothing is stored (no backend call)

**Database Model:**
```prisma
model Diyo {
  id        String   @id @default(cuid())
  intention String
  isPublic  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

**Zod Schema:**
```ts
const diyoSchema = z.object({
  intention: z.string().min(1).max(200)
})
```

---

### 7.5 Sahara — Resource Map
**Route:** `/sahara`

**No backend needed.** Hardcoded in the frontend.

**Nepal Resources:**
| Organization | Contact | Description |
|---|---|---|
| Saathi Nepal | 01-4268474 | Sanga basa — women's support |
| WOREC Nepal | 01-4371399 | Mahila adhikar ra sahayog |
| TPO Nepal | 01-4423596 | Mann ko sathi |
| Women's Police Cell | 100 | Emergency |
| Maiti Nepal | 01-4479898 | Surakchhit sthan |

**Diaspora Resources:**
| Country | Line | Organization |
|---|---|---|
| USA | 988 | Saathi (Nepali community support) |
| UK | 116 123 | Sath maa cha |
| Australia | 13 11 14 | Support line |

**Framing:** "Yiniharu tiro kura sunna tayyar chan." — not "crisis resources" or "hotlines."

---

### 7.6 Buwa-Aama ko Guff — Daily Wisdom Card
**No backend.** Hardcoded in frontend, date-indexed.

**Logic:**
```ts
const cards = [ /* array of 30+ cards */ ]
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
const todayCard = cards[dayOfYear % cards.length]
```

**Card Format:**
- Nepali proverb (Devanagari)
- Modern Nenglish reframe
- Designed to be screenshot and shared on WhatsApp

**Sample Cards:**
```
{ proverb: "जस्तो बीउ, त्यस्तो फल", reframe: "Tero choice haru nai tero future build garcha — pressure maa pani." }
{ proverb: "एक हात ले ताली बज्दैन", reframe: "Help maag na yaar. Eklai sab garna pardaina." }
{ proverb: "धीरे धीरे रे मना, धीरे सब कुछ होय", reframe: "Hustle culture lai bhetaunu pardaina.आफ्नो pace ma thik cha." }
```

---

### 7.7 Didi Circles — Mockup Only
**Route:** `/circles`

Hardcoded React UI with seeded data. No backend. No interactivity beyond basic hover states.

**Seeded Circles:**
- "Bidesh maa Nepali Didi" — for diaspora women
- "Naulo Aama" — for new mothers
- "Career Didi Haru" — for working women
- "Ghar Bhitra Ko Kura" — domestic concerns (private-feeling)

UI shows: circle name, member count (hardcoded), a "Join waitlist" button (non-functional, just shows a toast: "Chhai aaucha! Pratiksha gara.")

---

### 7.8 SOS Whisper Button — Persistent
**Present on every screen.**

- Small, discreet button — bottom-right corner
- Icon: a soft flame or hand symbol (not a red alarm)
- On tap: shows a full-screen dismissible overlay

**Overlay Content:**
```
Thik chha? 🙏

Yahan kehi resources chan jo tero sath huncha:

📞 Saathi Nepal — 01-4268474
📞 TPO Nepal — 01-4423596
📞 Emergency — 100

[Sahara screen maa herne →]    [Band gara]
```

Tone: warm, not alarming. Never says "crisis", "emergency" prominently, "hotline".

---

## 8. Database Schema (Complete)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Story {
  id          String   @id @default(cuid())
  content     String
  suneinCount Int      @default(0)
  isSeeded    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model MoodCheckin {
  id        String   @id @default(cuid())
  mood      String
  createdAt DateTime @default(now())
}

model Diyo {
  id        String   @id @default(cuid())
  intention String
  createdAt DateTime @default(now())
}
```

Deploy: `npx prisma db push` (development). Never use `prisma migrate` during the hackathon.

---

## 9. Backend Folder Structure

```
backend/
├── src/
│   ├── index.ts              # Express app bootstrap, port 3001
│   ├── app.ts                # Middleware setup (cors, json, routes)
│   ├── routes/
│   │   ├── stories.ts        # /api/stories
│   │   ├── mood.ts           # /api/mood
│   │   ├── bot.ts            # /api/bot/chat
│   │   └── diyos.ts          # /api/diyos
│   ├── controllers/
│   │   ├── stories.controller.ts
│   │   ├── mood.controller.ts
│   │   ├── bot.controller.ts
│   │   └── diyos.controller.ts
│   ├── middleware/
│   │   └── errorHandler.ts   # Global error handler
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── claude.ts         # Anthropic client + system prompt
│   └── types/
│       └── index.ts          # Shared TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── seed.ts               # Seed stories + wisdom cards
├── .env                      # Never committed
├── package.json
└── tsconfig.json
```

---

## 10. Frontend Folder Structure

```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx               # Router setup
│   ├── pages/
│   │   ├── Home.tsx          # Mann ko Mausam
│   │   ├── Stories.tsx       # Meri Katha
│   │   ├── Bot.tsx           # Aangan Bot
│   │   ├── Diyo.tsx          # Diyo Baaln
│   │   ├── Sahara.tsx        # Resource map
│   │   └── Circles.tsx       # Didi Circles mockup
│   ├── components/
│   │   ├── SOSButton.tsx     # Persistent whisper button
│   │   ├── SOSOverlay.tsx    # Overlay content
│   │   ├── WisdomCard.tsx    # Buwa-Aama ko Guff
│   │   ├── StoryCard.tsx
│   │   ├── DiyoFlame.tsx
│   │   └── MoodPicker.tsx
│   ├── lib/
│   │   └── api.ts            # Typed fetch wrappers for backend
│   └── styles/
│       ├── tokens.css        # Color + font variables
│       └── global.css
```

---

## 11. Visual Design System

**Color Palette:**
```css
--color-marigold: #F5A623;
--color-maroon:   #7B1C2E;
--color-sage:     #7A9E7E;
--color-cream:    #FDF6E3;
--color-ember:    #D4622A;
```

**Typography:**
- Devanagari as primary script everywhere
- Nepali labels always above English
- Recommended font: Noto Sans Devanagari (Google Fonts, free)

**Texture Elements:**
- Dhaka textile pattern band as horizontal dividers
- Himalayan silhouette as subtle background on hero screens
- Diyo flame as a recurring motif (SVG, animated with CSS)

**Tone Rules for all UI copy:**
- Error messages: "Eh, kei bhayo. Feri hernu?" not "Error 500"
- Loading: "Ek chin..." not "Loading..."
- Empty state: "Abhi koi katha chaina — pehilo timi share gara" not "No posts yet"

---

## 12. Team Split & Build Order

### Hour 0–10: Core (non-negotiable)

| Person | Task |
|---|---|
| **FE Dev 1** | Meri Katha story wall + Maile Sunein session state |
| **FE Dev 2** | Mann ko Mausam mood picker + affirmation display |
| **Backend Dev** | Express setup, Prisma schema, `/api/stories` + `/api/mood` |
| **AI Dev** | Aangan Bot: Claude client, system prompt, `/api/bot/chat` |
| **Designer / Content** | Seed stories + wisdom card copy + Sahara resource list |

### Hour 10–24: Impact Features

| Person | Task |
|---|---|
| **FE Dev 1** | Aangan Bot chat UI (connects to `/api/bot/chat`) |
| **FE Dev 2** | Diyo Baaln — diyo animation + intention input + shared wall |
| **Backend Dev** | `/api/diyos` endpoints, seed script, SOS overlay component |
| **AI Dev** | Test 3 demo scenarios, tune system prompt |
| **Designer** | Full visual polish pass — palette, Devanagari, Dhaka bands |

### Hour 24–36: Supporting Features

| Person | Task |
|---|---|
| **FE Dev 1** | Sahara screen (hardcoded, no backend) |
| **FE Dev 2** | Buwa-Aama wisdom card (date-indexed, hardcoded) |
| **Backend Dev** | Didi Circles mockup UI + React Router wiring |
| **AI Dev** | SOS Whisper button + overlay (persistent component) |
| **Designer** | Typography pass, Himalayan silhouette BGs, diyo icon |

### Hour 36–44: Polish

- Responsive layout for mobile browsers (primary use case)
- Empty states, loading states, error states — all in Nenglish
- Cross-screen consistency check (font, color, spacing)
- Supabase production environment test

### Hour 44–48: Demo Prep

- Run the 90-second demo flow end-to-end, 3 times minimum
- Seed fresh stories + diyos on production DB
- Have 3 Aangan Bot scenarios ready to type live

---

## 13. 90-Second Demo Script

1. **Open app** → warm Devanagari welcome, "Namaste didi"
2. **Tap "Stormy"** on Mann ko Mausam → see "Yo bhari lageko mann suneko cha. Eklai chaina."
3. **Navigate to Meri Katha** → read one seeded story aloud → tap "Maile Sunein" → button becomes "Suniyeko cha"
4. **Open Aangan Bot** → type the career pressure scenario → show the warm, non-advising Nenglish response
5. **Navigate to Diyo Baaln** → light a diyo → type an intention → release to the shared wall
6. **Show the shared prayer wall** — other diyos glowing
7. **Show Buwa-Aama wisdom card** on home
8. **Show Sahara screen** — "yiniharu tiro kura sunna tayyar chan"
9. **Tap SOS button** → show the warm overlay (not alarming, just present)

**The 3 features that must be flawless:** Meri Katha + Maile Sunein, Aangan Bot, Diyo Baaln.

---

## 14. Cultural Rules Checklist (Before Demo)

- [ ] Zero clinical words anywhere (no: depression, trauma, therapy, assault, PTSD, disorder, suicide)
- [ ] All bot responses are in Nenglish
- [ ] Bot never says "you should", "try this", "I recommend"
- [ ] SOS button is present on every screen
- [ ] Error messages feel like a friend, not a system
- [ ] Devanagari is primary everywhere (not just decorative)
- [ ] Sahara screen never uses the word "hotline" or "crisis"
- [ ] Diyo private path stores nothing (verify no DB call on "Afnai rakhchu")

---

## 15. Open Questions / Decisions Deferred

| Question | Decision |
|---|---|
| Will the shared Diyo wall need moderation? | No — trust the community for 48 hours |
| Should Maile Sunein count be visible? | No — count is hidden from UI, tracked in DB only |
| Mobile breakpoint? | 375px minimum (iPhone SE) — primary users are on mobile |
| Will the app need a domain? | Judge demo — localhost is fine, Vercel/Render deploy is bonus |
