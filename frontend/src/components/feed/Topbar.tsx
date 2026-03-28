import { Link } from 'react-router-dom'

export function Topbar() {
  function scrollToInput() {
    document.getElementById('story-input')?.focus()
    document.getElementById('story-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <header className="sticky top-0 z-40 h-12 bg-pageBg/90 backdrop-blur-sm border-b border-sand flex items-center justify-between px-4 gap-3">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sindoor flex items-center justify-center">
          <span className="text-white font-serif font-bold text-sm">छ</span>
        </div>
        <span className="font-serif font-bold text-ink text-lg leading-none hidden sm:block">छाया</span>
      </Link>

      {/* Search bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <input
          type="text"
          placeholder="Khoj..."
          className="w-full bg-cardWhite border border-sand rounded-full px-4 py-1.5 text-xs text-textBody placeholder:text-textMuted outline-none focus:border-textMuted transition-colors"
          readOnly
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Ask Aangan pill */}
        <button className="bg-marigold text-ink rounded-full px-3 py-1 text-xs font-semibold hidden sm:block hover:opacity-90 transition-opacity">
          Ask Aangan
        </button>

        {/* Create button */}
        <button
          onClick={scrollToInput}
          className="bg-ink text-pageBg rounded-full px-3 py-1 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          <span className="text-sm leading-none">+</span>
          <span className="hidden sm:inline">सिर्जना</span>
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-himalayan flex items-center justify-center">
          <span className="text-white text-xs font-bold">?</span>
        </div>
      </div>
    </header>
  )
}
