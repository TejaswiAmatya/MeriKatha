import { useState } from 'react'

export function StoryInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')

  function handleSubmit() {
    const trimmed = text.trim()
    if (trimmed.length < 10) return
    onSubmit(trimmed)
    setText('')
  }

  return (
    <div className="bg-pageBg rounded-xl border border-sand p-3">
      <textarea
        id="story-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-transparent text-sm text-textBody placeholder:text-textMuted font-sans resize-none outline-none leading-relaxed"
        placeholder="Tero katha share gar..."
        rows={2}
        maxLength={500}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] text-textMuted">
          {text.length}/500
        </span>
        <button
          onClick={handleSubmit}
          disabled={text.trim().length < 10}
          className="bg-ink text-pageBg rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          Share gara
        </button>
      </div>
    </div>
  )
}
