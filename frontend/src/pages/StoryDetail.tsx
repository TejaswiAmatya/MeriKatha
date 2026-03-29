import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import type { Story, Comment } from '../types/feed'
import { circles, relativeTime, mockStories } from '../data/mockStories'
import { Topbar } from '../components/feed/Topbar'
import { useLang, translationCache } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL ?? ''

interface ApiStory {
  id: string
  content: string
  suneinCount: number
  createdAt: string
  theme: string
  circleId: string
  userId?: string
}

function mapApiStory(s: ApiStory): Story {
  return {
    id: s.id,
    circleId: s.circleId ?? 'SathiCircle',
    title: s.content.length > 60 ? s.content.slice(0, 60) + '...' : s.content,
    body: s.content,
    tags: [],
    flair: null,
    votes: s.suneinCount,
    comments: 0,
    createdAt: new Date(s.createdAt),
    theme: s.theme ?? 'general',
    userId: s.userId,
  }
}

// Deep-update a comment (or nested reply) by id
function patchComment(
  list: Comment[],
  id: string,
  updater: (c: Comment) => Comment
): Comment[] {
  return list.map((c) => {
    if (c.id === id) return updater(c)
    if (c.replies?.length) return { ...c, replies: patchComment(c.replies, id, updater) }
    return c
  })
}

export function StoryDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  // ── Story state ──────────────────────────────────────────────────────────
  const [story, setStory] = useState<Story | null>(
    (location.state as { story?: Story } | null)?.story ?? null
  )
  const [loading, setLoading] = useState(!story)
  const [notFound, setNotFound] = useState(false)
  const [listened, setListened] = useState(false)
  const [voted, setVoted] = useState(false)
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const { lang } = useLang()
  const { user } = useAuth()
  const [translatedBody, setTranslatedBody] = useState<string | null>(null)
  const [translatingStory, setTranslatingStory] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ── Comment state ────────────────────────────────────────────────────────
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  // Per-comment reply box state
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [submittingReply, setSubmittingReply] = useState<string | null>(null)

  // One-time per-comment like / sunein tracking (no auth → local only)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [suneinedComments, setSuneinedComments] = useState<Set<string>>(new Set())

  // ── Story fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (story) return
    const mock = mockStories.find((s) => s.id === id)
    if (mock) { setStory(mock); setLoading(false); return }
    fetch(`${API}/api/stories`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const found = (res.data as ApiStory[]).find((s) => s.id === id)
          found ? setStory(mapApiStory(found)) : setNotFound(true)
        } else { setNotFound(true) }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, story])

  // ── Story translation ────────────────────────────────────────────────────
  useEffect(() => {
    if (lang !== 'en' || !story) return
    const cacheKey = `detail-${story.id}`
    if (translationCache.has(cacheKey)) {
      setTranslatedBody(translationCache.get(cacheKey)!)
      return
    }
    setTranslatingStory(true)
    fetch(`${API}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: story.body }),
    })
      .then((r) => r.json())
      .then((data) => {
        const t = data.success ? data.data.translatedText : story.body
        translationCache.set(cacheKey, t)
        setTranslatedBody(t)
      })
      .catch(() => {})
      .finally(() => setTranslatingStory(false))
  }, [lang, story])

  // ── Comments fetch ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    fetch(`${API}/api/stories/${id}/comments`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => { if (res.success) setComments(res.data) })
      .catch(() => {})
  }, [id])

  // ── Story-level handlers (untouched) ─────────────────────────────────────
  async function handleSunein(e: React.MouseEvent<HTMLButtonElement>) {
    if (listened || !story) return
    const rect = e.currentTarget.getBoundingClientRect()
    setRipplePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setListened(true)
    setTimeout(() => setRipplePos(null), 500)
    try {
      await fetch(`${API}/api/stories/${story.id}/sunein`, { method: 'POST', credentials: 'include' })
    } catch {}
  }

  // ── Top-level comment submit ─────────────────────────────────────────────
  async function handleCommentSubmit() {
    const trimmed = commentText.trim()
    if (!trimmed || !id) return
    setCommentError(null)
    setSubmittingComment(true)
    try {
      const res = await fetch(`${API}/api/stories/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: trimmed }),
      })
      const data = await res.json()
      if (data.success) {
        setComments((prev) => [...prev, { ...data.data, replies: [] }])
        setCommentText('')
      } else {
        setCommentError(data.error)
      }
    } catch {
      setCommentError('Server sanga connect huna sakena. Feri try garnus.')
    } finally {
      setSubmittingComment(false)
    }
  }

  // ── Reply submit ─────────────────────────────────────────────────────────
  async function handleReplySubmit(parentId: string) {
    const trimmed = (replyTexts[parentId] ?? '').trim()
    if (!trimmed || !id) return
    setSubmittingReply(parentId)
    try {
      const res = await fetch(`${API}/api/stories/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: trimmed, parentId }),
      })
      const data = await res.json()
      if (data.success) {
        setComments((prev) =>
          patchComment(prev, parentId, (c) => ({
            ...c,
            replies: [...(c.replies ?? []), data.data],
          }))
        )
        setReplyTexts((prev) => ({ ...prev, [parentId]: '' }))
        setReplyingTo(null)
      }
    } catch {} finally {
      setSubmittingReply(null)
    }
  }

  // ── Like comment ─────────────────────────────────────────────────────────
  async function handleLike(commentId: string) {
    if (likedComments.has(commentId)) return
    setLikedComments((prev) => new Set(prev).add(commentId))
    setComments((prev) =>
      patchComment(prev, commentId, (c) => ({ ...c, likeCount: c.likeCount + 1 }))
    )
    try {
      await fetch(`${API}/api/comments/${commentId}/like`, { method: 'POST', credentials: 'include' })
    } catch {}
  }

  // ── Sunein comment ───────────────────────────────────────────────────────
  async function handleCommentSunein(commentId: string) {
    if (suneinedComments.has(commentId)) return
    setSuneinedComments((prev) => new Set(prev).add(commentId))
    setComments((prev) =>
      patchComment(prev, commentId, (c) => ({ ...c, suneinCount: c.suneinCount + 1 }))
    )
    try {
      await fetch(`${API}/api/comments/${commentId}/sunein`, { method: 'POST', credentials: 'include' })
    } catch {}
  }

  async function handleDelete() {
    if (!story) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      await fetch(`${API}/api/stories/${story.id}`, { method: 'DELETE', credentials: 'include' })
      navigate(-1)
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  useEffect(() => {
    if (!confirmDelete) return
    const t = setTimeout(() => setConfirmDelete(false), 3000)
    return () => clearTimeout(t)
  }, [confirmDelete])

  const isOwner = !!user && !!story && story.userId === user.userId
  const circle = story ? circles.find((c) => c.id === story.circleId) : null
  const voteCount = story ? (voted ? story.votes + 1 : story.votes) : 0
  const totalComments = comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0)

  return (
    <div className="min-h-screen bg-pageBg font-sans">
      <Topbar />

      <div className="flex justify-center">
        <main className="w-full max-w-2xl bg-feedBg min-h-screen px-3 pt-3 pb-20 md:pb-6">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs text-textMuted hover:text-ink transition-colors mb-4"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Farkinus
          </button>

          {loading && <div className="text-center text-textMuted text-sm py-16">Katha khojdai chha...</div>}

          {notFound && (
            <div className="text-center text-textMuted text-sm py-16 space-y-2">
              <p>Yo katha fhelaparidena.</p>
              <button onClick={() => navigate('/feed')} className="text-himalayan underline text-xs">Feed ma farkinus</button>
            </div>
          )}

          {story && (
            <article className="bg-pageBg rounded-xl border border-sand p-5">
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
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full ml-auto"
                    style={{ backgroundColor: story.flair.bg, color: story.flair.text }}>
                    {story.flair.label}
                  </span>
                )}
              </div>

              <h1 className={`font-serif font-bold text-xl text-ink leading-snug mt-3 ${translatingStory ? 'opacity-50 animate-pulse' : ''}`}>
                {lang === 'en' && translatedBody
                  ? (translatedBody.length > 80 ? translatedBody.slice(0, 80) + '...' : translatedBody)
                  : story.title}
              </h1>
              <p className={`text-sm text-textBody leading-relaxed mt-3 whitespace-pre-wrap ${translatingStory ? 'opacity-50 animate-pulse' : ''}`}>
                {translatingStory ? 'Anuvad gardai...' : lang === 'en' && translatedBody ? translatedBody : story.body}
              </p>

              {story.tags.length > 0 && (
                <div className="flex gap-1 mt-4 flex-wrap">
                  {story.tags.map((tag) => (
                    <span key={tag} className="text-[9px] bg-feedBg text-textMuted rounded-full px-2 py-0.5">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="border-t border-sand/60 mt-4 pt-3" />

              {/* Story action bar */}
              <div className="flex items-center gap-1.5">
                <button onClick={() => setVoted((v) => !v)}
                  className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs font-semibold text-ink hover:bg-sand/50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2L12 8H2L7 2Z" fill={voted ? '#C0392B' : '#9A7B5A'} />
                  </svg>
                  {voteCount}
                </button>

                <span className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody">
                  <span className="text-sm">💬</span>{totalComments}
                </span>

                <button ref={btnRef} onClick={handleSunein}
                  type="button"
                  className={`relative overflow-hidden rounded-full px-3 py-1 text-[10px] font-semibold flex items-center gap-1 transition-colors shadow-sm border border-himalayan/20 ${listened ? 'bg-himalayan/85 text-pageBg' : 'bg-himalayan text-pageBg hover:bg-himalayan/90 active:bg-himalayan/95'}`}>
                  {ripplePos && (
                    <span className="absolute w-4 h-4 bg-pageBg/35 rounded-full animate-ripple pointer-events-none"
                      style={{ left: ripplePos.x - 8, top: ripplePos.y - 8 }} />
                  )}
                  {listened ? 'सुनिएको ✓' : '🙏 Maile Sunein'}
                </button>

                <button className="flex items-center gap-1 bg-feedBg rounded-full px-2.5 py-1 text-xs text-textBody hover:bg-sand/50 transition-colors ml-auto">
                  ↗ Share
                </button>

                {isOwner && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-40 ${
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
          )}

          {/* ── Comment section ─────────────────────────────────────────── */}
          {story && (
            <section className="mt-3 space-y-2">
              <h2 className="font-serif text-sm font-semibold text-ink px-1">
                Jawaf ({totalComments})
              </h2>

              {comments.length === 0 && (
                <p className="text-xs text-textMuted text-center py-4">
                  Abhi koi jawaf chhaina — pahilo tapaaile lekhnus!
                </p>
              )}

              {comments.map((c) => (
                <div key={c.id}>
                  {/* Top-level comment card */}
                  <div className="bg-pageBg rounded-xl border border-sand p-3">
                    <p className="text-sm text-textBody leading-relaxed">{c.content}</p>

                    {/* Comment action row */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-textMuted">{relativeTime(new Date(c.createdAt))}</span>

                      {/* Like */}
                      <button
                        onClick={() => handleLike(c.id)}
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          likedComments.has(c.id)
                            ? 'text-sindoor bg-sindoor/10'
                            : 'text-textMuted hover:text-sindoor'
                        }`}
                      >
                        ❤️ {c.likeCount}
                      </button>

                      {/* Sunein */}
                      <button
                        onClick={() => handleCommentSunein(c.id)}
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          suneinedComments.has(c.id)
                            ? 'text-ink bg-ink/10'
                            : 'text-textMuted hover:text-ink'
                        }`}
                      >
                        🙏 {c.suneinCount}
                      </button>

                      {/* Reply toggle */}
                      <button
                        onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                        className="text-[10px] text-textMuted hover:text-himalayan transition-colors ml-auto"
                      >
                        {replyingTo === c.id ? 'Chodnus' : '💬 Jawaf dinus'}
                      </button>
                    </div>

                    {/* Inline reply form */}
                    {replyingTo === c.id && (
                      <div className="mt-2 pt-2 border-t border-sand/40">
                        <textarea
                          value={replyTexts[c.id] ?? ''}
                          onChange={(e) => setReplyTexts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder="Tapaaiko jawaf..."
                          rows={2}
                          maxLength={500}
                          className="w-full bg-feedBg/60 rounded-lg border border-sand/50 px-3 py-2 text-xs text-textBody placeholder:text-textMuted font-sans resize-none outline-none focus:border-textMuted/40 transition-colors"
                        />
                        <div className="flex justify-end mt-1.5">
                          <button
                            onClick={() => handleReplySubmit(c.id)}
                            disabled={!(replyTexts[c.id] ?? '').trim() || submittingReply === c.id}
                            className="bg-ink text-pageBg rounded-full px-3 py-1 text-[10px] font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
                          >
                            {submittingReply === c.id ? 'Pathaaudai...' : 'Reply gara'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nested replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-sand/60 pl-3">
                      {c.replies.map((r) => (
                        <div key={r.id} className="bg-pageBg rounded-xl border border-sand/70 p-3">
                          <p className="text-sm text-textBody leading-relaxed">{r.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-textMuted">{relativeTime(new Date(r.createdAt))}</span>

                            <button
                              onClick={() => handleLike(r.id)}
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                likedComments.has(r.id)
                                  ? 'text-sindoor bg-sindoor/10'
                                  : 'text-textMuted hover:text-sindoor'
                              }`}
                            >
                              ❤️ {r.likeCount}
                            </button>

                            <button
                              onClick={() => handleCommentSunein(r.id)}
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                suneinedComments.has(r.id)
                                  ? 'text-ink bg-ink/10'
                                  : 'text-textMuted hover:text-ink'
                              }`}
                            >
                              🙏 {r.suneinCount}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* New top-level comment form */}
              <div className="bg-pageBg rounded-xl border border-sand p-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Tapaaiko jawaf lekhnus..."
                  rows={2}
                  maxLength={500}
                  className="w-full bg-transparent text-sm text-textBody placeholder:text-textMuted font-sans resize-none outline-none leading-relaxed"
                />
                {commentError && <p className="text-xs text-sindoor mt-1">{commentError}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-textMuted">{commentText.length}/500</span>
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || submittingComment}
                    className="bg-ink text-pageBg rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    {submittingComment ? 'Pathaaudai...' : 'Comment gara'}
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
