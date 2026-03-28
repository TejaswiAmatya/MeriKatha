import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DhakaBand } from '../components/ui/DhakaBand'
import { useReveal } from '../hooks/useReveal'
import { useAuth } from '../context/AuthContext'

// ---------------------------------------------------------------------------
// Wisdom cards — date-indexed, changes daily, no backend needed
// ---------------------------------------------------------------------------
const wisdomCards: Array<{ nepali: string; english: string }> = [
  { nepali: '"आँधी आउनु भनेको टुट्नु होइन।"',            english: 'A storm does not mean you are broken.' },
  { nepali: '"आफ्नो मनको कुरा सुन्नु पनि एउटा हिम्मत हो।"', english: 'Listening to your own heart is also a kind of courage.' },
  { nepali: '"एक्लै भएर पनि आफ्नो लागि उभिनु सक्नु शक्ति हो।"', english: 'Standing up for yourself, even alone, is strength.' },
  { nepali: '"थकान महसुस गर्नु कमजोरी होइन, मानवता हो।"', english: 'Feeling tired is not weakness. It is being human.' },
  { nepali: '"एक हात ले ताली बज्दैन।"',                   english: 'Help maag na yaar. Eklai sab garna pardaina.' },
  { nepali: '"धीरे धीरे रे मना, धीरे सब कुछ होय।"',      english: 'Hustle culture lai bhetaunu pardaina. Afno pace maa thik cha.' },
]

const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
)
const todayCard = wisdomCards[dayOfYear % wisdomCards.length]

// ---------------------------------------------------------------------------
// Language strings
// ---------------------------------------------------------------------------
const strings = {
  np: {
    navCta: 'छायामा प्रवेश →',
    heroOverline: 'CHHAYA · छाया',
    heroH1Line1: 'तपाईंको मन,',
    heroH1Highlight: 'सुरक्षित',
    heroH1Line2: 'ठाउँमा।',
    heroBody: 'A warm space for Nepali women — to share, to feel, and to be heard. No judgment. No login. Just didi energy.',
    heroCta: 'छायामा प्रवेश गर्नुस् →',
    heroSubtext: 'Sabaiko lagi swatantra. Koi login chaina.',
    featuresOverline: 'CHHAYA MA KE KE CHHA?',
    featuresH2: 'चार ठाउँ, एउटै आश्रय।',
    circlesOverline: 'DIDI CIRCLES — जल्दी आउँदैछ',
    circlesH2: 'साथीहरू भेट्नुस्।',
    circlesBody: 'Yahan groups chan — diaspora, nayi aama, career, ghar bhitra ko kura.',
    circlesChip: 'Join waitlist',
    wisdomOverline: 'आजको ज्ञान · BUWA-AAMA KO GUFF',
    wisdomQuote: todayCard.nepali,
    wisdomReframe: todayCard.english,
    wisdomShare: 'WhatsApp maa share gara 🙏',
    footerTagline: 'Safe to open in front of family. · Koi login chaina. · Koi judgment chaina.',
    footerMade: 'Made with 🙏 for Nepali women, everywhere.',
  },
  en: {
    navCta: 'Enter Chhaya →',
    heroOverline: 'CHHAYA · छाया',
    heroH1Line1: 'Your heart,',
    heroH1Highlight: 'safe',
    heroH1Line2: 'and heard.',
    heroBody: 'A warm space for Nepali women — to share, to feel, and to be heard. No judgment. No login. Just didi energy.',
    heroCta: 'Enter Chhaya →',
    heroSubtext: 'Free for everyone. No login needed.',
    featuresOverline: "WHAT'S INSIDE CHHAYA?",
    featuresH2: 'Four spaces, one shelter.',
    circlesOverline: 'DIDI CIRCLES — COMING SOON',
    circlesH2: 'Find your people.',
    circlesBody: 'Groups for diaspora, new moms, career, and everyday life.',
    circlesChip: 'Join waitlist',
    wisdomOverline: 'WISDOM OF THE DAY · BUWA-AAMA KO GUFF',
    wisdomQuote: todayCard.english,
    wisdomReframe: todayCard.nepali,
    wisdomShare: 'Share on WhatsApp 🙏',
    footerTagline: 'Safe to open in front of family. · No login. · No judgment.',
    footerMade: 'Made with 🙏 for Nepali women, everywhere.',
  },
} as const

type Lang = keyof typeof strings

// ---------------------------------------------------------------------------
// Circles data
// ---------------------------------------------------------------------------
const circles = [
  { id: 'NayaAama',     name: 'नया आमा',     initial: 'न', color: 'bg-himalayan', tagline: 'Nayi aamaharuko lagi',   taglineEn: 'For new mothers' },
  { id: 'Pardesh',      name: 'परदेश',        initial: 'प', color: 'bg-maroon',    tagline: 'Bidesh maa Nepali didi', taglineEn: 'Nepali women abroad' },
  { id: 'SathiCircle',  name: 'साथी',         initial: 'स', color: 'bg-marigold',  tagline: 'Sanga, sab thau',        taglineEn: 'Together, everywhere' },
  { id: 'PadhneBahini', name: 'पढ्ने बहिनी', initial: 'ब', color: 'bg-sindoor',   tagline: 'Career + padhailai',     taglineEn: 'Career and education' },
]

// ---------------------------------------------------------------------------
// Feature cards data
// ---------------------------------------------------------------------------
const features = [
  {
    id: 'katha',
    bg: 'bg-pageBg border border-sand',
    iconBg: 'bg-sindoor/10',
    icon: '📖',
    titleDev: 'मेरी कथा',
    titleEn: 'Meri Katha',
    desc: 'Afno katha share gara — anonymously. Koi judge gardaina yahan. Sirf suninchan.',
    descEn: 'Share your story — anonymously. No one judges here. Just listening.',
    preview: (
      <div className="bg-feedBg rounded-xl p-3 mt-3 text-xs text-textBody leading-relaxed font-sans border border-sand">
        "Sasurali maa sab thik dekhaucha tara ghar bhitra chain chaina…"
      </div>
    ),
    pillText: 'Katha padh →',
    pillTextEn: 'Read stories →',
    pillClass: 'bg-ink text-pageBg',
  },
  {
    id: 'mausam',
    bg: 'bg-himalayan/10 border border-himalayan/30',
    iconBg: 'bg-himalayan/20',
    icon: '⛅',
    titleDev: 'मन को मौसम',
    titleEn: 'Mann ko Mausam',
    desc: 'Aaja kasto lagdai cha? Ek click maa afno mann ko mausam bata.',
    descEn: 'How are you feeling today? Tell us your mood in one tap.',
    preview: (
      <div className="flex gap-1.5 mt-3 flex-wrap">
        {['☀️', '⛅', '🌫️', '⛈️', '🌧️'].map((e) => (
          <span
            key={e}
            className="bg-white/60 rounded-full px-2 py-1 text-sm text-center border border-himalayan/20 cursor-default select-none"
          >
            {e}
          </span>
        ))}
      </div>
    ),
    pillText: 'Mann check-in →',
    pillTextEn: 'Check in →',
    pillClass: 'bg-ink text-pageBg',
  },
  {
    id: 'bot',
    bg: 'bg-peach/40 border border-peach',
    iconBg: 'bg-peach',
    icon: '🙏',
    titleDev: 'आँगन बोट',
    titleEn: 'Aangan Bot',
    desc: 'Timro kura sunne ko lagi ma chu. Kei bhannu cha? Yaha koi judgment chaina.',
    descEn: 'Someone to listen. Say anything. No judgment here.',
    preview: (
      <div className="bg-cardWhite rounded-xl rounded-tl-sm p-3 mt-3 text-xs text-textBody leading-relaxed font-sans border border-sand">
        "Timro kura sunera maan lagyo. Eklai chaina timi. 🙏"
      </div>
    ),
    pillText: 'Aangan maa jaau →',
    pillTextEn: 'Go to Aangan →',
    pillClass: 'bg-ink text-pageBg',
  },
  {
    id: 'diyo',
    bg: 'bg-maroon',
    iconBg: '',
    icon: '🪔',
    titleDev: 'दियो बाल्नुस्',
    titleEn: 'Diyo Baaln',
    desc: 'Ek ichha, ek dar, ek prayer — diyomaa rakh.',
    descEn: 'A wish, a fear, a prayer — place it in the flame.',
    preview: null,
    pillText: 'Diyo baal →',
    pillTextEn: 'Light a diyo →',
    pillClass: 'bg-peach text-maroon',
  },
]

// ---------------------------------------------------------------------------
// Landing component
// ---------------------------------------------------------------------------
export function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lang, setLang] = useState<Lang>('np')
  const [visible, setVisible] = useState(true)

  function handleEnterChhaya() {
    navigate(user ? '/feed' : '/signup')
  }

  const [featuresRef, featuresRevealed] = useReveal<HTMLDivElement>()
  const [circlesRef, circlesRevealed]   = useReveal<HTMLDivElement>()
  const [wisdomRef, wisdomRevealed]     = useReveal<HTMLDivElement>()

  const s = strings[lang]

  function toggleLang() {
    setVisible(false)
    setTimeout(() => {
      setLang((l) => (l === 'np' ? 'en' : 'np'))
      setVisible(true)
    }, 150)
  }

  return (
    <div className="bg-pageBg min-h-screen font-sans">

      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 h-12 bg-transparent border-b border-transparent flex items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sindoor flex items-center justify-center shrink-0">
            <span className="text-white font-serif font-bold text-sm">छ</span>
          </div>
          <span className="font-serif font-bold text-ink text-lg leading-none">छाया</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="rounded-full px-3 py-1 text-xs font-semibold font-sans bg-white/20 backdrop-blur-sm border border-white/40 text-ink hover:bg-white/30 transition-colors"
            aria-label="Switch language"
          >
            {lang === 'np' ? 'EN' : 'नेपाली'}
          </button>

          <button
            onClick={handleEnterChhaya}
            className="bg-ink text-pageBg rounded-full px-4 py-1.5 text-xs font-semibold font-sans hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 bg-sindoor rounded-full animate-pulse shrink-0" />
            {s.navCta}
          </button>
        </div>
      </header>

      {/* ── Page content (fades on language switch) ─────────────────── */}
      <div className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden -mt-12 min-h-screen">
          {/* Full-width cultural background image */}
          <img
            src="/assets/diyo.png"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
          {/* Warm cream gradient — fades image into page at bottom, keeps text readable */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(245,240,230,0.55) 0%, rgba(245,240,230,0.72) 50%, rgba(245,240,230,1) 100%)',
            }}
          />

          <div className="max-w-3xl mx-auto px-5 pt-32 pb-20 md:pt-40 md:pb-28 text-center relative">
            <p className="text-[9px] tracking-widest uppercase text-textMuted font-sans">
              {s.heroOverline}
            </p>

            <h1 className="font-serif font-bold text-5xl md:text-7xl text-ink leading-tight mt-3">
              {s.heroH1Line1}<br />
              <span className="text-sindoor">{s.heroH1Highlight}</span> {s.heroH1Line2}
            </h1>

            <p
              className="text-base text-textBody mt-5 leading-relaxed max-w-md mx-auto font-sans"
              style={{ animationDelay: '0.2s' }}
            >
              {s.heroBody}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={handleEnterChhaya}
                className="bg-ink text-pageBg rounded-full px-8 py-3 font-semibold font-sans text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="w-2 h-2 bg-sindoor rounded-full animate-pulse shrink-0" />
                {s.heroCta}
              </button>
            </div>
          </div>
        </section>

        <DhakaBand />

        {/* ── Features ───────────────────────────────────────────────── */}
        <section
          ref={featuresRef}
          className={`px-5 md:px-12 py-10 transition-all duration-500 ${featuresRevealed ? 'animate-fadeUp' : 'opacity-0'}`}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-[9px] tracking-widest uppercase text-textMuted font-sans mb-2">
              {s.featuresOverline}
            </p>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-ink leading-tight mb-6">
              {s.featuresH2}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((f) => (
                <div key={f.id} className={`${f.bg} rounded-2xl p-5 flex flex-col`}>
                  {/* Icon */}
                  {f.iconBg ? (
                    <div className={`w-10 h-10 ${f.iconBg} rounded-xl flex items-center justify-center text-xl`}>
                      {f.icon}
                    </div>
                  ) : (
                    <div className="text-3xl animate-flicker">{f.icon}</div>
                  )}

                  {/* Title */}
                  <p className={`font-serif font-bold text-xl mt-3 leading-tight ${f.id === 'diyo' ? 'text-[#F5E6C8]' : 'text-ink'}`}>
                    {f.titleDev}
                  </p>
                  <p className={`text-[10px] font-sans mt-0.5 ${f.id === 'diyo' ? 'text-[#D4A882]' : 'text-textMuted'}`}>
                    {f.titleEn}
                  </p>

                  {/* Description */}
                  <p className={`text-sm mt-2 leading-relaxed font-sans flex-1 ${f.id === 'diyo' ? 'text-[#D4A882]' : 'text-textBody'}`}>
                    {lang === 'np' ? f.desc : f.descEn}
                  </p>

                  {/* Preview */}
                  {f.preview}

                  {/* CTA pill */}
                  <Link
                    to="/stories"
                    className={`${f.pillClass} rounded-full px-3 py-1.5 text-[10px] font-semibold font-sans mt-4 inline-block text-center hover:opacity-90 transition-opacity`}
                  >
                    {lang === 'np' ? f.pillText : f.pillTextEn}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DhakaBand className="mx-5 md:mx-12" />

        {/* ── Didi Circles ───────────────────────────────────────────── */}
        <section
          ref={circlesRef}
          className={`px-5 md:px-12 py-10 transition-all duration-500 ${circlesRevealed ? 'animate-fadeUp' : 'opacity-0'}`}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-[9px] tracking-widest uppercase text-textMuted font-sans mb-2">
              {s.circlesOverline}
            </p>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-ink leading-tight mb-2">
              {s.circlesH2}
            </h2>
            <p className="text-sm text-textBody font-sans mb-6 leading-relaxed">
              {s.circlesBody}
            </p>

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
              {circles.map((c) => (
                <div
                  key={c.id}
                  className="bg-pageBg border border-sand rounded-xl p-4 flex items-center gap-3 min-w-[200px] md:min-w-0 snap-start shrink-0 md:shrink"
                >
                  <div className={`w-10 h-10 rounded-full ${c.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-serif font-bold text-sm">{c.initial}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-sm text-ink leading-tight">{c.name}</p>
                    <p className="text-xs text-textMuted font-sans mt-0.5">
                      {lang === 'np' ? c.tagline : c.taglineEn}
                    </p>
                    <span className="text-[9px] bg-sand/50 text-textMuted rounded-full px-2 py-0.5 mt-1.5 inline-block font-sans">
                      {s.circlesChip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DhakaBand className="mx-5 md:mx-12" />

        {/* ── Wisdom Card ────────────────────────────────────────────── */}
        <section
          ref={wisdomRef}
          className={`px-5 md:px-12 py-4 transition-all duration-500 ${wisdomRevealed ? 'animate-fadeUp' : 'opacity-0'}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="bg-maroon rounded-2xl p-8 md:p-10 text-center">
              <p className="text-[9px] tracking-widest uppercase font-sans" style={{ color: '#D4A882' }}>
                {s.wisdomOverline}
              </p>
              <p
                className="font-serif font-bold text-xl md:text-2xl leading-snug mt-3"
                style={{ color: '#F5E6C8' }}
              >
                {s.wisdomQuote}
              </p>
              {/* Mini Dhaka band */}
              <div
                className="h-1 w-24 mx-auto my-4 rounded-full opacity-40"
                style={{
                  background: 'repeating-linear-gradient(90deg, #C0392B 0px, #C0392B 6px, #E8A020 6px, #E8A020 12px, #2D6A4F 12px, #2D6A4F 18px, #D4C5A9 18px, #D4C5A9 24px)',
                }}
              />
              <p className="text-sm italic font-sans" style={{ color: '#D4A882' }}>
                {s.wisdomReframe}
              </p>
              <p className="text-xs font-sans mt-4" style={{ color: '#D4A882' }}>
                {s.wisdomShare}
              </p>
            </div>
          </div>
        </section>

        <DhakaBand className="mx-5 md:mx-12" />

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="py-10 text-center px-5">
          <p className="font-serif font-bold text-ink text-lg">छाया — Chhaya</p>
          <p className="text-xs text-textMuted font-sans mt-2">
            {s.footerTagline}
          </p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
            {[
              ['Meri Katha', '/feed'],
              ['Mann ko Mausam', '/feed'],
              ['Aangan Bot', '/feed'],
              ['Diyo Baaln', '/feed'],
              ['Sahara', '/sahara'],
            ].map(([label, to]) => (
              <Link
                key={label}
                to={to}
                className="text-xs text-textMuted underline underline-offset-2 font-sans hover:text-textBody transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          <p className="text-xs text-textMuted font-sans mt-6">
            {s.footerMade}
          </p>
        </footer>

      </div>{/* end fade wrapper */}
    </div>
  )
}
