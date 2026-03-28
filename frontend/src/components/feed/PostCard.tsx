import { useState, useRef } from 'react'
import type { Story } from '../../types/feed'
import { circles, relativeTime } from '../../data/mockStories'

export function PostCard({ story }: { story: Story }) {
  const [listened, setListened] = useState(false)
  const [voted, setVoted] = useState(false)
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const circle = circles.find((c) => c.id === story.circleId)
  const voteCount = voted ? story.votes + 1 : story.votes

  function handleSunein(e: React.MouseEvent<HTMLButtonElement>) {
    if (listened) return
    const rect = e.currentTarget.getBoundingClientRect()
    setRipplePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setListened(true)
    setTimeout(() => setRipplePos(null), 500)
  }

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

      {/* Title */}
      <h3 className="font-serif font-bold text-[15px] text-ink leading-tight mt-1.5 line-clamp-2">
        {story.title}
      </h3>

      {/* Body preview */}
      <p className="text-xs text-textBody leading-relaxed mt-1 line-clamp-3">
        {story.body}
      </p>

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
      <div className="flex items-center gap-1.5 mt-2">
        {/* Vote */}
        <button
          onClick={() => setVoted((v) => !v)}
          className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs font-semibold text-ink hover:bg-sand/50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2L12 8H2L7 2Z" fill={voted ? '#C0392B' : '#9A7B5A'} />
          </svg>
          {voteCount}
        </button>

        {/* Comments */}
        <button className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody hover:bg-sand/50 transition-colors">
          <span className="text-sm">💬</span>
          {story.comments}
        </button>

        {/* Maile Sunein */}
        <button
          ref={btnRef}
          onClick={handleSunein}
          className={`relative overflow-hidden rounded-full px-3 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors ${
            listened
              ? 'bg-ink text-pageBg'
              : 'bg-ink text-pageBg hover:opacity-90'
          }`}
        >
          {ripplePos && (
            <span
              className="absolute w-4 h-4 bg-sindoor/40 rounded-full animate-ripple pointer-events-none"
              style={{ left: ripplePos.x - 8, top: ripplePos.y - 8 }}
            />
          )}
          {listened ? 'सुनिएको ✓' : '🙏 Maile Sunein'}
        </button>

        {/* Share */}
        <button className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody hover:bg-sand/50 transition-colors ml-auto">
          ↗ Share
        </button>
      </div>
    </article>
  )
}
