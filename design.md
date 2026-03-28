# MannSathi — Design System & UI Specification
> Reddit-style layout · Bento grid inserts · Nepali cultural warmth · Sofia Therapy editorial aesthetic
> Claude Code: Read this file before touching any UI. Every decision here is intentional.

---

## 0. Core Philosophy

| Rule | Why |
|---|---|
| Zero clinical words in UI | App must be safe to open in front of family |
| Devanagari is primary script | English is the subtitle, never the headline |
| Warm cream, never white | White feels clinical. Cream feels like home |
| Dark pill CTAs, not colorful buttons | Sofia Therapy editorial language |
| Maile Sunein is the only reaction with no count | You cannot quantify being believed |
| Bento blocks break feed monotony | Every 3–4 posts, insert a feature card |
| Dhaka band between every major section | Cultural identity, not decoration |

---

## 1. Color Tokens

Add these to `tailwind.config.js` under `theme.extend.colors`:

```js
colors: {
  pageBg:     '#F5F0E6', // warm cream — page background
  feedBg:     '#EDE8DC', // slightly darker — feed/content area background
  ink:        '#1A1410', // near-black — primary text, dark CTAs
  sindoor:    '#C0392B', // red — primary brand, upvote, SOS dot
  marigold:   '#E8A020', // amber — accent, Ask button, divider band
  maroon:     '#7B3F2B', // deep red-brown — wisdom card bg, headings
  himalayan:  '#4A9B7E', // teal-green — Naya Aama circle, arch section
  sand:       '#D4C5A9', // warm gray — all borders, dividers
  cardWhite:  '#FFFFFF', // pure white — widget cards in sidebar
  peach:      '#F4D9C6', // light peach — Diyo bento bg, chat bubbles
  textBody:   '#5C4A35', // warm brown — body copy
  textMuted:  '#9A7B5A', // muted warm — timestamps, meta, labels
}
```

### Usage rules
- **Page background**: `bg-pageBg` everywhere
- **Feed/content area background**: `bg-feedBg`
- **Post cards sit on feedBg**: use `bg-pageBg` for cards so they lift off the feed
- **All borders**: `border-sand` at 1px — never use gray-200 or zinc
- **Primary CTA**: `bg-ink text-pageBg rounded-full` — the dark pill
- **Never use**: Tailwind default grays, blues, or any color outside this palette

---

## 2. Typography

### Font loading — add to `app/layout.tsx`
```tsx
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Hind:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

### Font stack — add to `tailwind.config.js`
```js
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'],
  sans:  ['Hind', 'Arial', 'sans-serif'],
}
```

> **Why Hind?** It renders both Devanagari and Latin scripts in the same font. Never use a separate font for Nepali text.

### Type scale

| Role | Font | Size | Weight | Color | Usage |
|---|---|---|---|---|---|
| Display H1 | Playfair Display | 52–64px | 700 | ink | Hero headline |
| Section H2 | Playfair Display | 32–40px | 700 | ink | Section titles |
| Post title | Playfair Display | 14–15px | 700 | ink | Feed post headline |
| Body | Hind | 15–16px | 400 | textBody | All body copy |
| Post body | Hind | 12px | 400 | textBody | Post preview text |
| Nav links | Hind | 13px | 500 | ink | Topbar navigation |
| Label/overline | Hind | 9–10px | 600 | textMuted | Uppercase tracked section labels |
| Meta/timestamp | Hind | 10–11px | 400 | textMuted | Post meta, timestamps |
| Button text | Hind | 12–13px | 600 | — | All CTAs |

### Typography rules
- **Devanagari comes first.** English translation goes below in smaller, lighter weight
- Post titles can be in Devanagari, Nepali-English codemix, or Latin — all use `font-serif`
- Never use `font-weight: 800` or `900` — too heavy against the warm palette
- Line height: `leading-relaxed` (1.625) for body, `leading-tight` (1.25) for headlines

---

## 3. Layout — 3-Column Reddit Shell

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR (sticky, 48px, bg-pageBg, border-b border-sand)         │
├──────────────┬──────────────────────────────┬───────────────────┤
│              │                              │                   │
│  LEFT        │  MAIN FEED                   │  RIGHT            │
│  SIDEBAR     │  (bg-feedBg)                 │  SIDEBAR          │
│  200px fixed │  flex-1, max-w-2xl           │  180px fixed      │
│  sticky      │  scrollable                  │  sticky           │
│              │                              │                   │
└──────────────┴──────────────────────────────┴───────────────────┘
```

### Topbar
```
[🌸 Logo + मन सँगी]   [Search bar — rounded-full]   [Ask Aangan btn]   [⊞ Create]   [Avatar]
```
- Height: `h-12` (48px)
- Background: `bg-pageBg border-b border-sand`
- Add `backdrop-blur-sm bg-pageBg/90` on scroll
- Logo: sindoor square icon (8×8px, rounded-lg) + "मन सँगी" in `font-serif font-bold`
- Search: `bg-cardWhite border border-sand rounded-full px-4 py-1.5 max-w-md flex-1`
- "Ask Aangan" pill: `bg-marigold text-ink rounded-full px-3 py-1 text-xs font-semibold`
- Create button: `bg-ink text-pageBg rounded-full px-3 py-1 text-xs` — label "+ सिर्जना"
- Avatar: `w-7 h-7 rounded-full bg-himalayan text-white text-xs font-bold`

### Left Sidebar (200px)
Sections in order:
1. **Main nav** — Home (गृहपृष्ठ), Popular, Explore
2. `<hr class="border-sand my-3" />`
3. **Circles (सर्कल)** — labeled section
   - c/NayaAama — dot `bg-himalayan`
   - c/Pardesh — dot `bg-maroon`
   - c/SathiCircle — dot `bg-marigold`
   - c/PadhneBahini — dot `bg-sindoor`
4. `<hr class="border-sand my-3" />`
5. **Features** — Mann ko Mausam, Diyo Baln, Aangan Bot, Sahara
6. Footer: Dhaka band + "Safe to open in front of family" in 9px textMuted

Active nav item: `bg-ink text-pageBg rounded-lg`
Hover state: `bg-feedBg rounded-lg`
Item padding: `px-2 py-1.5`
Circle icon: 18px circle with white initial letter

### Main Feed
- Background: `bg-feedBg`
- Padding: `p-3`
- Gap between items: `gap-2` (8px)
- Max width: `max-w-2xl mx-auto`
- Scroll: natural page scroll, not overflow-y

**Feed item order (repeat pattern):**
```
Post card
Post card
Post card
[BENTO BLOCK — 2-col grid]
Post card
Post card
Post card
[BENTO BLOCK]
...
```

### Right Sidebar (180px)
Widgets stacked vertically with `gap-3`:
1. SOS Sahara badge (always top, bg-sindoor)
2. Trending Circles widget
3. Aangan Bot widget
4. Didi Circles widget
5. Dhaka band footer

---

## 4. Post Card Anatomy

```
┌─────────────────────────────────────────────────────┐
│  [Circle dot + c/Name]  ·  [timestamp]  [flair pill]│  ← meta row
│                                                     │
│  Post title in Playfair Display, bold, 14–15px      │  ← serif title
│  max 2 lines, color: ink                            │
│                                                     │
│  Body preview text, 12px, color: textBody,          │  ← body
│  max 3 lines, "read more" link                      │
│                                                     │
│  [Optional: image block 120px rounded-lg]           │  ← media
│  [Optional: bento mini-card insert]                 │
│                                                     │
│  [Tag] [Tag] [Tag]                                  │  ← tags
│                                                     │
│  [▲ 248]  [💬 14]  [🙏 Maile Sunein]  [↗ Share]   │  ← actions
└─────────────────────────────────────────────────────┘
```

### Post card styles
```
bg-pageBg rounded-xl border border-sand p-3
hover:border-textMuted transition-colors duration-150
```

### Meta row
```
flex items-center gap-1.5 text-xs
```
- Circle dot: `w-4 h-4 rounded-full` in circle color + white initial
- Circle name: `font-semibold text-ink text-xs`
- Separator dot: `w-1 h-1 bg-textMuted rounded-full`
- Timestamp: `text-textMuted`
- Flair pill: `text-[9px] font-semibold px-2 py-0.5 rounded-full` — see flair colors below

### Flair pill colors (NO clinical words)
| Flair | Background | Text |
|---|---|---|
| New mother | `#F4D9C6` | maroon |
| Career | `#EDE8DC` | ink |
| Diaspora | `#E8F4F0` | himalayan (dark) |
| Family | `#FFF3CD` | `#7B5E00` |
| Loneliness | `#F0EAE0` | textBody |
| Street safety | `#FEF0EE` | sindoor (dark) |

### Action bar
```
flex items-center gap-1.5 mt-2
```

**Vote button:**
```
flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs font-semibold text-ink
```
- Up arrow SVG: sindoor fill, 14×14px
- Shows number — this is the only place numbers appear

**Comments button:**
```
flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody
```

**Maile Sunein button — the primary emotional action:**
```
bg-ink text-pageBg rounded-full px-3 py-1 text-[10px] font-semibold flex items-center gap-1
```
- Label: `🙏 Maile Sunein`
- On click: text changes to `सुनिएको ✓` — no count ever shown
- Ripple animation from center on click

**Share button:**
```
flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody
```

---

## 5. Bento Block Inserts

Insert a 2-column bento grid every 3–4 posts in the feed. Each block maps to a feature.

### Bento grid wrapper
```
grid grid-cols-2 gap-2 rounded-xl overflow-hidden
```

### Bento card variants

**Buwa-Aama Wisdom (bg-maroon)**
```
bg-maroon rounded-xl p-4
```
- Overline: `text-[9px] tracking-widest uppercase text-[#D4A882]`
- Quote: `font-serif text-[13px] font-bold text-[#F5E6C8] leading-snug mt-1.5`
- Translation: `text-[10px] italic text-[#D4A882] mt-1`
- Changes daily — pull from `wisdomCards` array

**Mann ko Mausam (bg-himalayan)**
```
bg-himalayan rounded-xl p-4
```
- Overline: `text-[9px] tracking-widest uppercase text-[#C8E6DA]`
- Question: `font-serif text-[12px] font-bold text-white mt-1 mb-3`
- 5 mood chips: `flex gap-1` → each `flex-1 bg-white/20 rounded-lg py-1 text-center text-xs`
- Selected chip: `bg-white` 

**Diyo Baln (bg-peach)**
```
bg-peach rounded-xl p-4 flex flex-col items-center justify-center
```
- Flame: CSS animated 🪔 or SVG flame, 32px, `animate-flicker`
- Label: `text-xs text-maroon text-center mt-2`
- CTA: dark pill `bg-ink text-pageBg rounded-full px-3 py-1 text-[10px] mt-2`

**Aangan Bot (bg-feedBg border border-sand)**
```
bg-feedBg rounded-xl p-4 border border-sand
```
- Overline: `text-[9px] tracking-widest uppercase text-textMuted`
- Chat bubble: `bg-cardWhite rounded-lg p-2 text-xs text-textBody leading-relaxed`
- Text: `"Timro kura sunne manche chhu" 🙏`
- CTA: dark pill → opens bot modal

---

## 6. Sidebar Widgets

### Widget wrapper
```
bg-cardWhite border border-sand rounded-xl p-3
```

### Widget title
```
font-serif text-[13px] font-bold text-ink mb-2
```

### Widget list item
```
flex items-center gap-2 py-1.5 border-b border-[#F0EAE0] text-xs text-ink last:border-0
```

### SOS Sahara badge (always top of right sidebar)
```
bg-sindoor rounded-xl p-2.5 flex items-center gap-2
```
- Pulse dot: `w-2 h-2 bg-white rounded-full animate-pulse`
- Text: `text-xs font-semibold text-white`
- Label: `सहारा · Need support?`

### Sticky SOS button (bottom-right corner, every screen, z-50)
```
fixed bottom-4 right-4 z-50
bg-ink text-pageBg rounded-full px-4 py-2 text-xs font-semibold
flex items-center gap-2 shadow-sm
```
- Sindoor pulse dot on left
- Label: `सहारा`

---

## 7. Dhaka Textile Divider

Use between every major section. CSS only — no images.

```tsx
// components/DhakaBand.tsx
export function DhakaBand() {
  return (
    <div
      className="h-2 rounded-full my-5 opacity-65"
      style={{
        background: 'repeating-linear-gradient(90deg, #C0392B 0px, #C0392B 6px, #E8A020 6px, #E8A020 12px, #2D6A4F 12px, #2D6A4F 18px, #D4C5A9 18px, #D4C5A9 24px)'
      }}
    />
  )
}
```

Use `<DhakaBand />` between: hero/features, features/feed, sections in feed, sidebar footer.

---

## 8. Circle (Subreddit) System

Reddit's `r/` becomes MannSathi's `c/` (Circle).

| Circle | Nepali name | Color | Who it's for |
|---|---|---|---|
| c/NayaAama | नया आमा सर्कल | himalayan | New mothers, postpartum |
| c/Pardesh | परदेश सर्कल | maroon | Diaspora women |
| c/SathiCircle | साथी सर्कल | marigold | Harassment survivors |
| c/PadhneBahini | पढ्ने बहिनी सर्कल | sindoor | Career + marriage pressure |

### Circle header page (when user clicks a circle)
- Banner: full-width `h-24` in circle color with subtle Himalayan SVG silhouette
- Circle name in `font-serif font-bold text-2xl text-pageBg`
- Member count: `text-sm text-pageBg/70`
- Join button: `bg-pageBg text-ink rounded-full px-4 py-1.5 text-sm font-semibold`

---

## 9. Animations

Define these in `tailwind.config.js` under `theme.extend.keyframes`:

```js
keyframes: {
  flicker: {
    '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
    '25%':      { opacity: '0.9', transform: 'scaleY(0.97)' },
    '50%':      { opacity: '0.85', transform: 'scaleY(1.03) scaleX(0.98)' },
    '75%':      { opacity: '0.95', transform: 'scaleY(0.99)' },
  },
  fadeUp: {
    '0%':   { opacity: '0', transform: 'translateY(16px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  ripple: {
    '0%':   { transform: 'scale(0)', opacity: '0.4' },
    '100%': { transform: 'scale(2.5)', opacity: '0' },
  },
},
animation: {
  flicker: 'flicker 2s ease-in-out infinite',
  fadeUp:  'fadeUp 0.4s ease-out forwards',
  ripple:  'ripple 0.5s ease-out forwards',
},
```

| Element | Animation | Notes |
|---|---|---|
| Diyo flame | `animate-flicker` | Always on |
| Feed sections | `animate-fadeUp` | On scroll via IntersectionObserver |
| Maile Sunein tap | `animate-ripple` | Absolute positioned div from click origin |
| Mood chip select | `transition-all duration-150` | Scale 1 → 1.05, color swap |
| Post card hover | `transition-colors duration-150` | Border color only |
| Nav active state | `transition-colors duration-100` | bg swap |

---

## 10. Mobile Layout (< 768px)

- Both sidebars: **hidden**
- Bottom navigation bar replaces left sidebar:
  ```
  fixed bottom-0 left-0 right-0 h-14 bg-pageBg border-t border-sand
  flex items-center justify-around z-40
  ```
  Icons: Home · Circles · Meri Katha · Aangan Bot · Profile
- Feed: full width, `px-3`
- Bento blocks: `grid-cols-1` (stack vertically)
- Topbar: logo + search (compressed) + avatar only
- SOS button: always visible `bottom-20 right-4` (above bottom nav)

---

## 11. Content Rules — NEVER Violate These

```
❌ NEVER write:     ✅ WRITE instead:
depression          inner weather · Mann ko Mausam
trauma              what you've been carrying
therapy             a space to be heard
mental health        inner world · mann
assault             what happened to you
disorder            how you've been feeling
treatment           support · sahara
counseling          someone to sit with you
symptoms            signs
crisis              hard moment
```

- Post flairs must come from the approved list in Section 4
- No like/heart counts — only vote counts on the vote button
- Maile Sunein never shows a number
- Anonymous posts show zero identifying information: no avatar, no username, no IP-derivable location

---

## 12. File Structure Reference

```
app/
  layout.tsx          ← Google Fonts import here
  page.tsx            ← Landing page (Sofia-style, see landing prompt)
  feed/
    page.tsx          ← Main Reddit-style 3-col feed
  circle/
    [name]/page.tsx   ← Individual circle page
  post/
    [id]/page.tsx     ← Full post view

components/
  layout/
    Topbar.tsx
    LeftSidebar.tsx
    RightSidebar.tsx
    BottomNav.tsx       ← Mobile only
  feed/
    PostCard.tsx
    BentoBlock.tsx
    SortBar.tsx
    FeedDivider.tsx     ← DhakaBand in feed context
  features/
    MannKoMausam.tsx
    MeriKatha.tsx
    AanganBot.tsx
    DiyoBaln.tsx
    BuwaAamaWisdom.tsx
    SaharaWidget.tsx
  ui/
    DhakaBand.tsx
    DarkPill.tsx        ← Reusable dark pill CTA
    MaileSunein.tsx     ← The reaction button
    FlairPill.tsx
    CircleAvatar.tsx
    SOSButton.tsx       ← Sticky bottom-right

lib/
  content/
    wisdomCards.ts      ← Buwa-Aama daily proverbs array
    seedStories.ts      ← 6 seeded Meri Katha posts for demo
    saharaResources.ts  ← Nepal + diaspora contacts
  aangan/
    systemPrompt.ts     ← Aangan Bot system prompt
```

---

## 13. Seed Content (for demo)

### Wisdom cards (rotate daily)
```ts
export const wisdomCards = [
  {
    nepali: '"आँधी आउनु भनेको टुट्नु होइन।"',
    english: 'A storm does not mean you are broken.',
  },
  {
    nepali: '"आफ्नो मनको कुरा सुन्नु पनि एउटा हिम्मत हो।"',
    english: 'Listening to your own heart is also a kind of courage.',
  },
  {
    nepali: '"एक्लै भएर पनि आफ्नो लागि उभिनु सक्नु शक्ति हो।"',
    english: 'Standing up for yourself, even alone, is strength.',
  },
  {
    nepali: '"थकान महसुस गर्नु कमजोरी होइन, मानवता हो।"',
    english: 'Feeling tired is not weakness. It is being human.',
  },
]
```

### Sahara resources
```ts
export const saharaResources = {
  nepal: [
    { name: 'WOREC Nepal', type: 'Women's rights', contact: '01-4102030' },
    { name: 'Saathi Nepal', type: 'Safe space', contact: '01-4102031' },
    { name: 'TPO Nepal', type: 'Listening support', contact: '01-4102032' },
    { name: "Women's Police Cell", type: 'Safety', contact: '100' },
  ],
  diaspora: {
    us:        { name: 'SNEHA USA', contact: 'sneha-usa.org' },
    uk:        { name: 'Nepali Women UK', contact: 'nepaliwomen.org.uk' },
    australia: { name: 'NEWA Australia', contact: 'newa.org.au' },
  },
}
```

---

*Last updated: MannSathi v1.0 — Nepal-US Hackathon 2026*
*Claude Code: When in doubt, refer back to Section 0 and Section 11.*
