import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = 'Yahan ma cha. Ke lagdai cha aaja? 🙏'

export function Bot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: next }),
      })
      const json = await res.json()
      if (json.success && json.data?.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: json.data.reply }])
      } else {
        const err =
          typeof json.error === 'string' ? json.error : 'Kei bigryo — feri try gara na. 🙏'
        setMessages((prev) => [...prev, { role: 'assistant', content: err }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Ek chin... feri try gara na. 🙏' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-pageBg font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 h-12 bg-pageBg/90 backdrop-blur-sm border-b border-sand flex items-center px-5 gap-3">
        <Link to="/feed" className="text-textMuted text-xs hover:text-ink transition-colors">
          ← Farka
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-peach flex items-center justify-center">
            <span className="text-maroon text-sm">🙏</span>
          </div>
          <span className="font-serif font-bold text-ink">Aangan Bot</span>
        </div>
        <p className="text-[10px] text-textMuted ml-auto">Anonymous · Koi login chaina</p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg w-full mx-auto flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-ink text-pageBg rounded-br-sm'
                  : 'bg-peach text-textBody rounded-bl-sm border border-sand'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-peach border border-sand rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-textMuted">
              Ek chin...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-sand bg-pageBg px-4 py-3 max-w-lg w-full mx-auto">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            maxLength={2000}
            placeholder="Kei bhan, judge chaina yahan..."
            className="flex-1 bg-feedBg border border-sand rounded-xl px-3 py-2 text-sm text-textBody placeholder:text-textMuted resize-none outline-none focus:border-textMuted transition-colors leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-ink text-pageBg rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
          >
            Patha
          </button>
        </div>
        <p className="text-[9px] text-textMuted mt-1.5 text-center">
          Yo conversation page refresh garema reset huncha · Koi data bachaina
        </p>
      </div>
    </div>
  )
}
