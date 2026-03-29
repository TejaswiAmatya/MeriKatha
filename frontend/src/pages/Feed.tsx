import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { StoryInput } from "../components/feed/StoryInput";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type Story = {
  id: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  flags?: string[];
};

type FeedStory = Story & { suneinCount: number };

export function Feed() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<FeedStory[]>([]);

  // Load stories on mount
  useEffect(() => {
    fetch(`${API}/api/stories`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStories(res.data);
      })
      .catch(() => {});
  }, []);

  function handleNewStory(text: string) {
    // Optimistic prepend — the real story will appear on next fetch
    const optimistic: FeedStory = {
      id: crypto.randomUUID(),
      content: text,
      isAnonymous: true,
      createdAt: new Date().toISOString(),
      suneinCount: 0,
    };
    setStories((prev) => [optimistic, ...prev]);
  }

  async function handleSunein(storyId: string) {
    try {
      const res = await fetch(`${API}/api/stories/${storyId}/sunein`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStories((prev) =>
          prev.map((s) =>
            s.id === storyId ? { ...s, suneinCount: data.data.suneinCount } : s,
          ),
        );
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-pageBg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-pageBg/90 backdrop-blur border-b border-sand/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl text-ink">
            मेरी कथा
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-textMuted font-sans">
              Anonymous story space
            </span>
            <button
              onClick={async () => { await logout(); navigate("/login"); }}
              className="text-xs text-textMuted hover:text-sindoor font-sans transition-colors"
            >
              Niskinus
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <StoryInput onSubmit={handleNewStory} />

        {/* Stories Feed */}
        <div className="space-y-4">
          {stories.length === 0 && (
            <p className="text-center text-textMuted font-sans text-sm py-8">
              Ahile samma koi katha chhaina — pahilo tapaaile lekhnus!
            </p>
          )}

          {stories.map((story) => (
            <article
              key={story.id}
              className="bg-cardWhite rounded-2xl p-5 shadow-sm border border-sand/30"
            >
              <p className="text-ink font-sans text-sm leading-relaxed whitespace-pre-wrap">
                {story.content}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand/20">
                <span className="text-xs text-textMuted">
                  {new Date(story.createdAt).toLocaleDateString("ne-NP", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <button
                  onClick={() => handleSunein(story.id)}
                  className="flex items-center gap-1.5 text-sm text-textMuted hover:text-himalayan transition-colors"
                >
                  <span>सुनेँ</span>
                  <span className="text-xs bg-himalayan/10 text-himalayan px-2 py-0.5 rounded-full">
                    {story.suneinCount}
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
