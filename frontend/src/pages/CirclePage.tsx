import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Story } from '../types/feed'
import type { ThemeValue } from '../data/themes'
import { circles } from '../data/mockStories'
import { Topbar } from '../components/feed/Topbar'
import { LeftSidebar } from '../components/feed/LeftSidebar'
import { RightSidebar } from '../components/feed/RightSidebar'
import { FeedList } from '../components/feed/FeedList'
import { BottomNav } from '../components/feed/BottomNav'
import { useLang } from '../context/LangContext'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface ApiCircle {
  id: string
  slug: string
  circleId: string
  name: string
  nepaliName: string
  themeAffinity: string
  memberCount: number
  joined: boolean
}

interface ApiStory {
  id: string
  content: string
  suneinCount: number
  createdAt: string
  theme: string
  circleId: string
  userId?: string
  _count?: { comments: number }
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
    comments: s._count?.comments ?? 0,
    createdAt: new Date(s.createdAt),
    theme: s.theme ?? 'general',
    userId: s.userId,
  }
}

export function CirclePage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang } = useLang()
  const [circle, setCircle] = useState<ApiCircle | null>(null)
  const [joined, setJoined] = useState(false)
  const [memberCount, setMemberCount] = useState(0)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [joining, setJoining] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)

    Promise.all([
      fetch(`${API}/api/circles/${slug}`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${API}/api/circles/${slug}/stories`, { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([circleRes, storiesRes]) => {
        if (!circleRes.success) { setNotFound(true); return }
        setCircle(circleRes.data)
        setJoined(circleRes.data.joined)
        setMemberCount(circleRes.data.memberCount)
        if (storiesRes.success) {
          setStories((storiesRes.data as ApiStory[]).map(mapApiStory))
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  async function handleJoin() {
    if (!circle || joining) return
    setJoining(true)
    const action = joined ? 'leave' : 'join'
    const optimisticJoined = !joined
    const optimisticCount = joined ? Math.max(0, memberCount - 1) : memberCount + 1
    setJoined(optimisticJoined)
    setMemberCount(optimisticCount)
    try {
      const res = await fetch(`${API}/api/circles/${slug}/${action}`, {
        method: 'POST',
        credentials: 'include',
      }).then((r) => r.json())
      if (res.success) {
        setJoined(res.data.joined)
        setMemberCount(res.data.memberCount)
      } else {
        // revert
        setJoined(joined)
        setMemberCount(memberCount)
      }
    } catch {
      setJoined(joined)
      setMemberCount(memberCount)
    } finally {
      setJoining(false)
    }
  }

  function handleDelete(id: string) {
    setStories((prev) => prev.filter((s) => s.id !== id))
  }

  function handleNewStory(text: string, theme: ThemeValue) {
    if (!circle) return
    setStories((prev) => [
      {
        id: crypto.randomUUID(),
        circleId: circle.circleId,
        title: text.length > 60 ? text.slice(0, 60) + '...' : text,
        body: text,
        tags: [],
        flair: null,
        votes: 0,
        comments: 0,
        createdAt: new Date(),
        theme,
      },
      ...prev,
    ])
  }

  // Find the matching frontend circle for color/initial
  const circleMetadata = circle ? circles.find((c) => c.id === circle.circleId) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-pageBg font-sans">
        <Topbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-sm text-textMuted animate-pulse">Katha load gardai…</p>
        </div>
      </div>
    )
  }

  if (notFound || !circle) {
    return (
      <div className="min-h-screen bg-pageBg font-sans">
        <Topbar />
        <div className="flex justify-center items-center h-64 flex-col gap-3">
          <p className="text-sm text-textMuted">Yo circle fhelaparena.</p>
          <Link to="/feed" className="text-xs text-himalayan underline">
            ← {lang === 'en' ? 'Back to Feed' : 'Feed ma farka'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pageBg font-sans">
      <Topbar onCreateClick={() => setComposerOpen(true)} />

      <div className="flex justify-center">
        {/* Left sidebar */}
        <aside className="hidden md:block w-[200px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <LeftSidebar />
        </aside>

        {/* Main feed */}
        <main className="flex-1 max-w-2xl bg-feedBg min-h-screen p-3 pb-20 md:pb-3">
          {/* Circle header */}
          <div className="bg-pageBg rounded-2xl border border-sand p-4 mb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {circleMetadata && (
                  <div className={`w-10 h-10 rounded-full ${circleMetadata.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-base font-bold font-serif">{circleMetadata.initial}</span>
                  </div>
                )}
                <div>
                  <p className="font-serif font-bold text-ink text-base leading-tight">
                    c/{circle.circleId}
                  </p>
                  <p className="text-xs text-textMuted mt-0.5">
                    {circle.nepaliName} · {circle.name}
                  </p>
                  <p className="text-[10px] text-textMuted mt-0.5">
                    {memberCount} {lang === 'en' ? 'members' : 'sadasya'} · #{circle.themeAffinity}
                  </p>
                </div>
              </div>

              <button
                onClick={handleJoin}
                disabled={joining}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold shrink-0 transition-colors disabled:opacity-60 ${
                  joined
                    ? 'bg-sand text-ink hover:bg-sand/70'
                    : 'bg-himalayan text-pageBg hover:bg-himalayan/90'
                }`}
              >
                {joining
                  ? '…'
                  : joined
                  ? (lang === 'en' ? 'Leave' : 'Chhodnus')
                  : (lang === 'en' ? 'Join' : 'Samimlna')}
              </button>
            </div>
          </div>

          <FeedList
            stories={stories}
            onNewStory={handleNewStory}
            onDelete={handleDelete}
            circleId={circle.circleId}
            composerOpen={composerOpen}
            onComposerOpenChange={setComposerOpen}
          />
        </main>

        {/* Right sidebar */}
        <aside className="hidden lg:block w-[260px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <RightSidebar />
        </aside>
      </div>

      <BottomNav />
    </div>
  )
}
