import { useState, useEffect } from 'react'
import type { Story } from '../types/feed'
import { mockStories } from '../data/mockStories'
import { Topbar } from '../components/feed/Topbar'
import { LeftSidebar } from '../components/feed/LeftSidebar'
import { RightSidebar } from '../components/feed/RightSidebar'
import { FeedList } from '../components/feed/FeedList'
import { BottomNav } from '../components/feed/BottomNav'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface ApiStory {
  id: string
  content: string
  suneinCount: number
  createdAt: string
}

function mapApiStory(s: ApiStory): Story {
  return {
    id: s.id,
    circleId: 'SathiCircle',
    title: s.content.length > 60 ? s.content.slice(0, 60) + '...' : s.content,
    body: s.content,
    tags: [],
    flair: null,
    votes: s.suneinCount,
    comments: 0,
    createdAt: new Date(s.createdAt),
  }
}

export function Stories() {
  const [apiStories, setApiStories] = useState<Story[]>([])

  useEffect(() => {
    fetch(`${API}/api/stories`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setApiStories((res.data as ApiStory[]).map(mapApiStory))
      })
      .catch((err) => console.error('Error loading stories:', err))
  }, [])

  async function handleNewStory(text: string) {
    try {
      const res = await fetch(`${API}/api/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: text }),
      })
      const json = await res.json()
      if (json.success) {
        setApiStories((prev) => [mapApiStory(json.data as ApiStory), ...prev])
      }
    } catch (err) {
      console.error('Error adding story:', err)
    }
  }

  const stories = [...apiStories, ...mockStories]

  return (
    <div className="min-h-screen bg-pageBg font-sans">
      <Topbar />

      <div className="flex justify-center">
        {/* Left sidebar — hidden below md */}
        <aside className="hidden md:block w-[200px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <LeftSidebar />
        </aside>

        {/* Main feed */}
        <main className="flex-1 max-w-2xl bg-feedBg min-h-screen p-3 pb-20 md:pb-3">
          <FeedList stories={stories} onNewStory={handleNewStory} />
        </main>

        {/* Right sidebar — hidden below lg */}
        <aside className="hidden lg:block w-[260px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <RightSidebar />
        </aside>
      </div>

      <BottomNav />
    </div>
  )
}
