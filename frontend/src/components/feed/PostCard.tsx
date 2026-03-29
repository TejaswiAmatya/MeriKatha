import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Story } from '../../types/feed'
import { circles, relativeTime } from '../../data/mockStories'
import { useLang, translationCache } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function fetchTranslation(text: string, cacheKey: string): Promise<string> {
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!
  const res = await fetch(`${API}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ text }),
  })
  const data = await res.json()
  const translated: string = data.success ? data.data.translatedText : text
  translationCache.set(cacheKey, translated)
  return translated
}

export function PostCard({ story, onDelete }: { story: Story; onDelete?: (id: string) => void }) {
  const { lang } = useLang()
  const { user } = useAuth()
  const [listened, setListened] = useState(false)
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [translatedBody, setTranslatedBody] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)

  const circle = circles.find((c) => c.id === story.circleId)

  useEffect(() => {
    if (lang !== 'en') return
    if (translationCache.has(story.id)) {
      setTranslatedBody(translationCache.get(story.id)!)
      return
    }
    setTranslating(true)
    fetchTranslation(story.body, story.id)
      .then(setTranslatedBody)
      .finally(() => setTranslating(false))
  }, [lang, story.id, story.body])

  const displayBody = lang === 'en' ? (translatedBody ?? story.body) : story.body
  const displayTitle =
    lang === 'en' && translatedBody
      ? translatedBody.length > 60
        ? translatedBody.slice(0, 60) + '...'
        : translatedBody
      : story.title

  async function handleSunein(e: React.MouseEvent<HTMLButtonElement>) {
    if (listened) return
    const rect = e.currentTarget.getBoundingClientRect()
    setRipplePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setListened(true)
    setTimeout(() => setRipplePos(null), 500)
    try {
      await fetch(`${API}/api/stories/${story.id}/sunein`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Error incrementing sunein:', err)
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      await fetch(`${API}/api/stories/${story.id}`, { method: 'DELETE', credentials: 'include' })
      onDelete?.(story.id)
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const isOwner = !!user && story.userId === user.userId

  useEffect(() => {
    if (!confirmDelete) return
    const t = setTimeout(() => setConfirmDelete(false), 3000)
    return () => clearTimeout(t)
  }, [confirmDelete])

  return (
    <article className="bg-pageBg rounded-xl border border-sand p-3 hover:border-textMuted transition-colors duration-150">
      {/* Meta row */}
      <div className="flex items-center gap-1.5 text-xs">
        {circle && (
          <>
            <div className={`w-4 h-4 rounded-full ${circle.color} flex items-center justify-center shrink-0`}>
              <span className="text-white text-[8px] font-bold font-serif">{circle.initial}</span>
            </div>
            <span className="font-semibold text-ink">c/{circle.id}</span>
          </>
        )}
        <span className="w-1 h-1 bg-textMuted rounded-full" />
        <span className="text-textMuted">{relativeTime(story.createdAt)}</span>
        {story.flair && (
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full ml-auto"
            style={{ backgroundColor: story.flair.bg, color: story.flair.text }}
          >
            {story.flair.label}
          </span>
        )}
      </div>

      {/* Clickable content area → story detail */}
      <Link to={`/feed/${story.id}`} state={{ story }} className="block group">
        <h3 className={`font-serif font-bold text-[15px] text-ink leading-tight mt-1.5 line-clamp-2 group-hover:text-sindoor transition-colors ${translating ? 'animate-pulse opacity-60' : ''}`}>
          {displayTitle}
        </h3>
        <p className={`text-xs text-textBody leading-relaxed mt-1 line-clamp-3 ${translating ? 'animate-pulse opacity-60' : ''}`}>
          {translating ? 'Anuvad gardai...' : displayBody}
        </p>
      </Link>

      {/* Tags */}
      {story.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {story.tags.map((tag) => (
            <span key={tag} className="text-[9px] bg-feedBg text-textMuted rounded-full px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-2 mt-2 flex-wrap" onClick={(e) => e.preventDefault()}>
        <Link
          to={`/feed/${story.id}`}
          state={{ story }}
          className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody hover:bg-sand/50 transition-colors"
        >
          <span className="text-sm">💬</span>
          {story.comments}
        </Link>

        <button
          ref={btnRef}
          type="button"
          onClick={handleSunein}
          className={`relative overflow-hidden rounded-full px-3 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-sm border border-himalayan/20 ${
            listened
              ? 'bg-himalayan/85 text-pageBg'
              : 'bg-himalayan text-pageBg hover:bg-himalayan/90 active:bg-himalayan/95'
          }`}
        >
          {ripplePos && (
            <span
              className="absolute w-4 h-4 bg-pageBg/35 rounded-full animate-ripple pointer-events-none"
              style={{ left: ripplePos.x - 8, top: ripplePos.y - 8 }}
            />
          )}
          {listened
            ? (lang === 'en' ? 'Heard ✓' : 'सुनिएको ✓')
            : (lang === 'en' ? '🙏 I Heard You' : '🙏 Maile Sunein')}
        </button>

        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={`ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors disabled:opacity-40 ${
              confirmDelete
                ? 'bg-sindoor/10 text-sindoor border border-sindoor/30'
                : 'text-textMuted hover:text-sindoor hover:bg-sindoor/10'
            }`}
          >
            {deleting ? '…' : confirmDelete ? (lang === 'en' ? 'Sure?' : 'Pakka?') : '🗑'}
          </button>
        )}
      </div>
    </article>
  )
}
