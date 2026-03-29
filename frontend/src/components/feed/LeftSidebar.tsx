import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { circles } from '../../data/mockStories'
import { DhakaBand } from '../ui/DhakaBand'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL ?? ''

export function LeftSidebar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isTrending = searchParams.get('trending') === 'true'
  const { lang } = useLang()
  const { user } = useAuth()
  const [joinedIds, setJoinedIds] = useState<string[]>([])
  const [showComingSoon, setShowComingSoon] = useState(false)

  function triggerComingSoon() {
    setShowComingSoon(true)
    setTimeout(() => setShowComingSoon(false), 2500)
  }

  useEffect(() => {
    if (!user) return
    fetch(`${API}/api/circles/joined`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => { if (res.success) setJoinedIds(res.data) })
      .catch(() => {})
  }, [user])

  const navItems = [
    { label: 'गृहपृष्ठ', labelEn: 'Home', icon: '🏠', active: !isTrending, onClick: () => navigate('/feed') },
    { label: 'लोकप्रिय', labelEn: 'Popular', icon: '🔥', active: isTrending, onClick: () => navigate('/feed?trending=true') },
    { label: 'अन्वेषण', labelEn: 'Explore', icon: '🧭', active: false, onClick: triggerComingSoon },
  ]

  return (
    <nav className="p-3 text-[13px] font-sans">
      {/* Main nav */}
      {navItems.map((item) => (
        <button
          key={item.labelEn}
          onClick={item.onClick}
          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
            item.active ? 'bg-ink text-pageBg' : 'text-ink hover:bg-feedBg'
          }`}
        >
          <span className="text-sm">{item.icon}</span>
          <span className="font-medium">{lang === 'en' ? item.labelEn : item.label}</span>
        </button>
      ))}

      <hr className="border-sand my-3" />

      {/* Circles */}
      <p className="text-[9px] tracking-widest uppercase text-textMuted px-2 mb-2">{lang === 'en' ? 'Circles' : 'सर्कल'}</p>
      {circles.map((c) => (
        <Link
          key={c.id}
          to={`/circles/${c.slug}`}
          className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-ink hover:bg-feedBg transition-colors"
        >
          <div className={`w-4 h-4 rounded-full ${c.color} flex items-center justify-center shrink-0`}>
            <span className="text-white text-[8px] font-bold font-serif">{c.initial}</span>
          </div>
          <span className="text-xs">c/{c.id}</span>
          {joinedIds.includes(c.id) && (
            <span className="w-1.5 h-1.5 rounded-full bg-himalayan ml-auto shrink-0" />
          )}
        </Link>
      ))}

      {/* Footer */}
      <div className="mt-6">
        <DhakaBand />
        <p className="text-[9px] text-textMuted text-center mt-2">
          Safe to open in front of family
        </p>
      </div>

      {/* Coming Soon toast */}
      {showComingSoon && (
        <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 bg-ink text-pageBg text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg animate-fadeUp">
          <span>🧭</span>
          <span>{lang === 'en' ? 'Explore — coming soon!' : 'अन्वेषण — चाँडै आउँदैछ!'}</span>
        </div>
      )}
    </nav>
  )
}
