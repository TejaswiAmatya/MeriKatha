import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Story } from '../types/feed'
import { mockStories } from '../data/mockStories'
import { Topbar } from '../components/feed/Topbar'
import { LeftSidebar } from '../components/feed/LeftSidebar'
import { RightSidebar } from '../components/feed/RightSidebar'
import { FeedList } from '../components/feed/FeedList'
import { BottomNav } from '../components/feed/BottomNav'

function mapCircle(circle: string): string {
  const map: Record<string, string> = {
    NayaAama: 'NayaAama',
    Pardesh: 'Pardesh',
    SathiCircle: 'SathiCircle',
    PadhneBahini: 'PadhneBahini',
  }
  return map[circle] ?? 'SathiCircle'
}

export function Stories() {
  const [firestoreStories, setFirestoreStories] = useState<Story[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'stories'),
      orderBy('timestamp', 'desc'),
      limit(50)
    )
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: Story[] = snapshot.docs.map((doc) => {
          const d = doc.data()
          const text: string = d.text ?? ''
          return {
            id: doc.id,
            firestoreId: doc.id,
            circleId: mapCircle(d.circle ?? ''),
            title: text.length > 60 ? text.slice(0, 60) + '...' : text,
            body: text,
            tags: [],
            flair: null,
            votes: d.reactions ?? 0,
            comments: 0,
            createdAt: d.timestamp?.toDate() ?? new Date(),
          }
        })
        setFirestoreStories(loaded)
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err)
      }
    )
    return () => unsubscribe()
  }, [])

  async function handleNewStory(text: string) {
    try {
      await addDoc(collection(db, 'stories'), {
        text,
        timestamp: serverTimestamp(),
        reactions: 0,
        circle: 'general',
      })
      // onSnapshot will pick it up — no manual state update needed
    } catch (err) {
      console.error('Error adding story:', err)
    }
  }

  // Firestore stories first, mock stories appended as seed content
  const stories = [...firestoreStories, ...mockStories]

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
