import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Story } from "../types/feed";
import { mockStories } from "../data/mockStories";
import { THEMES } from "../data/themes";
import type { ThemeValue } from "../data/themes";
import { Topbar } from "../components/feed/Topbar";
import { LeftSidebar } from "../components/feed/LeftSidebar";
import { RightSidebar } from "../components/feed/RightSidebar";
import { FeedList } from "../components/feed/FeedList";
import { BottomNav } from "../components/feed/BottomNav";
import { useLang } from "../context/LangContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

interface ApiStory {
  id: string;
  content: string;
  audioBase64?: string | null;
  suneinCount: number;
  createdAt: string;
  theme: string;
  circleId: string;
  userId?: string;
  _count?: { comments: number };
}

function mapApiStory(s: ApiStory): Story {
  const hasText = s.content && s.content.length > 0;
  return {
    id: s.id,
    circleId: s.circleId ?? "SathiCircle",
    title: hasText
      ? s.content.length > 60
        ? s.content.slice(0, 60) + "..."
        : s.content
      : "Awaaz ma katha",
    body: s.content,
    audioBase64: s.audioBase64,
    tags: [],
    flair: null,
    votes: s.suneinCount,
    comments: s._count?.comments ?? 0,
    createdAt: new Date(s.createdAt),
    theme: s.theme ?? "general",
    userId: s.userId,
  };
}

export function Stories() {
  const [apiStories, setApiStories] = useState<Story[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const isTrending = searchParams.get("trending") === "true";
  const activeTheme = (searchParams.get("theme") ?? "") as ThemeValue | "";

  useEffect(() => {
    const url = activeTheme
      ? `${API}/api/stories?theme=${activeTheme}`
      : `${API}/api/stories`;
    fetch(url, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success)
          setApiStories((res.data as ApiStory[]).map(mapApiStory));
      })
      .catch((err) => console.error("Error loading stories:", err));
  }, [activeTheme]);

  useEffect(() => {
    if (!isTrending) return;
    fetch(`${API}/api/stories/trending`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success)
          setTrendingStories((res.data as ApiStory[]).map(mapApiStory));
      })
      .catch(() => {});
  }, [isTrending]);

  function handleDelete(id: string) {
    setApiStories((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleNewStory(text: string, theme: ThemeValue, audioBase64?: string) {
    try {
      const res = await fetch(`${API}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: text,
          theme,
          ...(audioBase64 ? { audioBase64 } : {}),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setApiStories((prev) => [mapApiStory(json.data as ApiStory), ...prev]);
      }
    } catch (err) {
      console.error("Error adding story:", err);
    }
  }

  const filteredMock = activeTheme
    ? mockStories.filter((s) => s.theme === activeTheme)
    : mockStories;
  const allStories = [...apiStories, ...filteredMock];
  const stories = isTrending
    ? trendingStories
    : q
      ? allStories.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.body.toLowerCase().includes(q) ||
            s.tags.some((t) => t.toLowerCase().includes(q)),
        )
      : allStories;

  function setThemeFilter(value: ThemeValue | "") {
    const params = new URLSearchParams(searchParams);
    params.delete("trending");
    if (value) {
      params.set("theme", value);
    } else {
      params.delete("theme");
    }
    navigate(`/feed?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-pageBg font-sans">
      <Topbar onCreateClick={() => setComposerOpen(true)} />

      <div className="flex justify-center">
        {/* Left sidebar — hidden below md */}
        <aside className="hidden md:block w-[200px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <LeftSidebar />
        </aside>

        {/* Main feed */}
        <main className="flex-1 max-w-2xl bg-feedBg min-h-screen p-3 pb-20 md:pb-3">
          {/* Theme filter chips */}
          <div className="flex gap-1.5 flex-wrap mb-3 pb-3 border-b border-sand/60">
            <button
              onClick={() => setThemeFilter("")}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                !activeTheme
                  ? "bg-ink text-pageBg"
                  : "bg-pageBg border border-sand text-textBody hover:border-textMuted"
              }`}
            >
              {lang === "en" ? "All" : "सबै"}
            </button>
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setThemeFilter(t.value)}
                className={`rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                  activeTheme === t.value
                    ? "bg-ink text-pageBg"
                    : "bg-pageBg border border-sand text-textBody hover:border-textMuted"
                }`}
              >
                {lang === "en" ? t.en : t.ne}
              </button>
            ))}
          </div>

          {isTrending && (
            <p className="text-xs font-semibold text-ink font-sans mb-2 px-1 flex items-center gap-1">
              🔥 Trending — pichlo 7 din ka sabai bhandaa suneko katha
            </p>
          )}
          {q && !isTrending && (
            <p className="text-xs text-textMuted font-sans mb-2 px-1">
              <span className="text-ink font-semibold">
                "{searchParams.get("q")}"
              </span>{" "}
              ko lagi{" "}
              <span className="text-ink font-semibold">{stories.length}</span>{" "}
              katha fyelayo
            </p>
          )}
          <FeedList
            stories={stories}
            onNewStory={handleNewStory}
            onDelete={handleDelete}
            composerOpen={composerOpen}
            onComposerOpenChange={setComposerOpen}
          />
        </main>

        {/* Right sidebar — hidden below lg */}
        <aside className="hidden lg:block w-[260px] shrink-0 sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
          <RightSidebar />
        </aside>
      </div>

      <BottomNav />
    </div>
  );
}
