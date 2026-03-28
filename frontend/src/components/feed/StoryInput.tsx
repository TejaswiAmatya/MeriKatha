import { useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export function StoryInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showResources, setShowResources] = useState(false)
  const [flagWarning, setFlagWarning] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    const trimmed = text.trim()
    if (trimmed.length < 10) return

    setError(null)
    setShowResources(false)
    setFlagWarning(null)
    setSubmitting(true)

    try {
      const res = await fetch(`${API}/api/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: trimmed }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        if (data.showResources) setShowResources(true)
        return
      }

      // Clinical language nudge
      if (data.flags?.includes('clinical_language')) {
        setFlagWarning(
          'Tapaaiko kura suneko chha. Yaha hami clinical shabda bhanda mann ko bhasa maa bolchhau — tara tapaaiko feelings valid chhan.'
        )
      }

      setText('')
      onSubmit(trimmed)
    } catch {
      setError('Server sanga connect huna sakena. Feri try garnus.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-pageBg rounded-xl border border-sand p-3">
      <textarea
        id="story-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-transparent text-sm text-textBody placeholder:text-textMuted font-sans resize-none outline-none leading-relaxed"
        placeholder="Tapaiko katha share garnuhos..."
        rows={2}
        maxLength={500}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] text-textMuted">
          {text.length}/500
        </span>
        <button
          onClick={handleSubmit}
          disabled={text.trim().length < 10 || submitting}
          className="bg-ink text-pageBg rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {submitting ? 'Pathaaudai...' : 'Share gara'}
        </button>
      </div>

      {/* Error — blocked content */}
      {error && (
        <div className="mt-2 p-2.5 rounded-lg bg-sindoor/10 border border-sindoor/20 text-sindoor text-xs font-sans">
          {error}
        </div>
      )}

      {/* Crisis resources */}
      {showResources && (
        <div className="mt-2 p-3 rounded-lg bg-peach/50 border border-marigold/30 text-ink text-xs font-sans space-y-1.5">
          <p className="font-medium">Sahara chahiyo? Yahaa sampark garnus:</p>
          <ul className="space-y-0.5 text-textBody">
            <li>Saathi Nepal: <strong>01-4268474</strong></li>
            <li>TPO Nepal: <strong>01-4423596</strong></li>
            <li>Emergency: <strong>100</strong></li>
          </ul>
          <Link to="/sahara" className="inline-block mt-1 text-himalayan underline">
            Sahara page ma janus →
          </Link>
        </div>
      )}

      {/* Clinical language nudge */}
      {flagWarning && (
        <div className="mt-2 p-2.5 rounded-lg bg-marigold/10 border border-marigold/20 text-textBody text-xs font-sans">
          {flagWarning}
        </div>
      )}
    </div>
  )
}
