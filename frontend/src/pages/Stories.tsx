import { useState } from 'react'
import type { Story } from '../types/feed'
import { mockStories, circles } from '../data/mockStories'
import { Topbar } from '../components/feed/Topbar'
import { LeftSidebar } from '../components/feed/LeftSidebar'
import { RightSidebar } from '../components/feed/RightSidebar'
import { FeedList } from '../components/feed/FeedList'
import { BottomNav } from '../components/feed/BottomNav'

export function Stories() {
  const [stories, setStories] = useState<Story[]>(mockStories)

  function handleNewStory(text: string) {
    const randomCircle = circles[Math.floor(Math.random() * circles.length)]
    const newStory: Story = {
      id: crypto.randomUUID(),
      circleId: randomCircle.id,
      title: text.length > 60 ? text.slice(0, 60) + '...' : text,
      body: text,
      tags: [],
      flair: null,
      votes: 0,
      comments: 0,
      createdAt: new Date(),
    }
    setStories((prev) => [newStory, ...prev])
  }

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
        <aside className="hidden lg:block w-[180px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <RightSidebar />
        </aside>
      </div>

      <BottomNav />
    </div>
  )
}
