import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";

export function Topbar({
  onCreateClick,
}: {
  /** If set (e.g. on /feed), opens the same story composer dialog as the inline trigger */
  onCreateClick?: () => void;
}) {
  const { logout } = useAuth();
  const { lang, toggle } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function scrollToInput() {
    document.getElementById("story-input")?.focus();
    document
      .getElementById("story-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleCreateClick() {
    if (onCreateClick) onCreateClick();
    else scrollToInput();
  }

  return (
    <header className="sticky top-0 z-40 h-12 bg-pageBg/90 backdrop-blur-sm border-b border-sand flex items-center justify-between px-4 gap-3">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sindoor flex items-center justify-center">
          <span className="text-white font-serif font-bold text-sm">छ</span>
        </div>
        <span className="font-serif font-bold text-ink text-lg leading-none hidden sm:block">
          छाया
        </span>
      </Link>

      {/* Search bar */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <span
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-textMuted"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.3-4.3" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = query.trim();
              navigate(q ? `/feed?q=${encodeURIComponent(q)}` : "/feed");
            }
            if (e.key === "Escape") {
              setQuery("");
              navigate("/feed");
            }
          }}
          placeholder="Khoj..."
          className="w-full bg-cardWhite border border-sand rounded-full py-1.5 pl-9 pr-4 text-xs text-textBody placeholder:text-textMuted outline-none focus:border-textMuted transition-colors"
          aria-label="Khoj"
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language toggle */}
        <button
          onClick={toggle}
          title={lang === 'ne' ? 'Switch to English' : 'नेपालीमा फर्कनुस्'}
          className="hidden sm:flex items-center gap-1 rounded-full border border-sand px-2.5 py-1 text-[10px] font-semibold text-textBody hover:border-textMuted transition-colors"
        >
          <span className={lang === 'ne' ? 'text-ink' : 'text-textMuted'}>नेप</span>
          <span className="text-sand/80">|</span>
          <span className={lang === 'en' ? 'text-ink' : 'text-textMuted'}>EN</span>
        </button>

        {/* Ask Aangan pill */}
        <button className="bg-marigold text-ink rounded-full px-3 py-1 text-xs font-semibold hidden sm:block hover:opacity-90 transition-opacity">
          Ask Aangan
        </button>

        {/* Create button */}
        <button
          type="button"
          onClick={handleCreateClick}
          className="bg-ink text-pageBg rounded-full px-3 py-1 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          <span className="text-sm leading-none">+</span>
          <span className="hidden sm:inline">{lang === 'en' ? 'Create' : 'सिर्जना'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={async () => { await logout(); navigate("/login"); }}
          className="w-7 h-7 rounded-full bg-sand/60 hover:bg-sindoor/20 flex items-center justify-center transition-colors group"
          title="Niskinus"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-textMuted group-hover:text-sindoor transition-colors">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
