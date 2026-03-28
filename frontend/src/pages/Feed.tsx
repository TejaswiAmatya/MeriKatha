import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
  const [content, setContent] = useState("");
  const [stories, setStories] = useState<FeedStory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [flagWarning, setFlagWarning] = useState<string | null>(null);

  // Load stories on mount
  useEffect(() => {
    fetch(`${API}/api/stories`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStories(res.data);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShowResources(false);
    setSuccessMsg(null);
    setFlagWarning(null);

    if (content.trim().length < 10) {
      setError("Ali lambo lekhnus na — kamti ma 10 akshar chaincha");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content, isAnonymous: true }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error);
        if (data.showResources) setShowResources(true);
        return;
      }

      // Check for flags (clinical language warning) — flags is at root level
      if (data.flags?.includes("clinical_language")) {
        setFlagWarning(
          "Tapaaiko kura suneko chha. Yaha hami clinical shabda bhanda mann ko bhasa maa bolchhau — tara tapaaiko feelings valid chhan.",
        );
      }

      setSuccessMsg("Tapaaiko katha share bhayo — dhanyabad!");
      setContent("");
      // Add new story to feed
      setStories((prev) => [{ ...data.data, suneinCount: 0 }, ...prev]);
    } catch {
      setError("Server sanga connect huna sakena. Feri try garnus.");
    } finally {
      setSubmitting(false);
    }
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
          <span className="text-sm text-textMuted font-sans">
            Anonymous story space
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Story Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-cardWhite rounded-2xl p-5 shadow-sm border border-sand/30"
        >
          <label className="block font-serif text-lg text-ink mb-2">
            Aafno katha lekhnus...
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Aaja mann maa ke chha? Yahaa lekhnus — koi judge gardaina..."
            rows={4}
            maxLength={5000}
            className="w-full rounded-xl border border-sand/50 bg-pageBg/50 px-4 py-3 text-ink font-sans text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-himalayan/40 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-textMuted">
              {content.length}/5000 akshar
            </span>
            <button
              type="submit"
              disabled={submitting || content.trim().length < 10}
              className="px-5 py-2 rounded-full bg-himalayan text-white font-sans text-sm font-medium hover:bg-himalayan/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Pathaaudai..." : "Share garnus"}
            </button>
          </div>

          {/* Error — blocked content */}
          {error && (
            <div className="mt-3 p-3 rounded-xl bg-sindoor/10 border border-sindoor/20 text-sindoor text-sm font-sans">
              {error}
            </div>
          )}

          {/* Crisis resources */}
          {showResources && (
            <div className="mt-3 p-4 rounded-xl bg-peach/50 border border-marigold/30 text-ink text-sm font-sans space-y-2">
              <p className="font-medium">
                Sahara chahiyo? Yahaa sampark garnus:
              </p>
              <ul className="space-y-1 text-textBody">
                <li>
                  Saathi Nepal: <strong>01-4268474</strong>
                </li>
                <li>
                  TPO Nepal: <strong>01-4423596</strong>
                </li>
                <li>
                  Emergency: <strong>100</strong>
                </li>
              </ul>
              <Link
                to="/sahara"
                className="inline-block mt-1 text-himalayan underline"
              >
                Sahara page ma janus →
              </Link>
            </div>
          )}

          {/* Flag warning — clinical language */}
          {flagWarning && (
            <div className="mt-3 p-3 rounded-xl bg-marigold/10 border border-marigold/20 text-textBody text-sm font-sans">
              {flagWarning}
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="mt-3 p-3 rounded-xl bg-himalayan/10 border border-himalayan/20 text-himalayan text-sm font-sans">
              {successMsg}
            </div>
          )}
        </form>

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
