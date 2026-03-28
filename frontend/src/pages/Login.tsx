import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DhakaBand } from '../components/ui/DhakaBand'

const wisdomCards = [
  { nepali: '"आँधी आउनु भनेको टुट्नु होइन।"',                     english: 'A storm does not mean you are broken.' },
  { nepali: '"आफ्नो मनको कुरा सुन्नु पनि एउटा हिम्मत हो।"',       english: 'Listening to your own heart is also a kind of courage.' },
  { nepali: '"एक्लै भएर पनि आफ्नो लागि उभिनु सक्नु शक्ति हो।"',   english: 'Standing up for yourself, even alone, is strength.' },
  { nepali: '"थकान महसुस गर्नु कमजोरी होइन, मानवता हो।"',          english: 'Feeling tired is not weakness. It is being human.' },
]

const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
)
const todayCard = wisdomCards[dayOfYear % wisdomCards.length]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/feed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kei problem bhayo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left identity panel ── */}
      <div className="md:w-[400px] md:min-h-screen bg-maroon flex flex-col justify-between p-8 md:p-12 relative overflow-hidden">

        {/* Mandala decoration — top right corner */}
        <div className="absolute -top-12 -right-12 w-56 h-56 opacity-[0.08] pointer-events-none" aria-hidden>
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="#F4D9C6" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="65" stroke="#F4D9C6" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="40" stroke="#F4D9C6" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="15" fill="#F4D9C6"/>
            <line x1="100" y1="10" x2="100" y2="190" stroke="#F4D9C6" strokeWidth="1"/>
            <line x1="10"  y1="100" x2="190" y2="100" stroke="#F4D9C6" strokeWidth="1"/>
            <line x1="36"  y1="36"  x2="164" y2="164" stroke="#F4D9C6" strokeWidth="1"/>
            <line x1="164" y1="36"  x2="36"  y2="164" stroke="#F4D9C6" strokeWidth="1"/>
          </svg>
        </div>

        {/* Logo */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-sindoor flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">म</span>
            </div>
            <span className="font-serif font-bold text-xl text-pageBg leading-none">मन सँगी</span>
          </div>
          <p className="text-[#D4A882] text-[10px] tracking-widest uppercase">
            MannSathi · मन सँगी
          </p>
        </div>

        {/* Today's wisdom */}
        <div className="py-6">
          <p className="text-[9px] tracking-widest uppercase text-[#D4A882] mb-4">
            आजको ज्ञान · BUWA-AAMA KO GUFF
          </p>
          <blockquote className="font-serif text-[19px] font-bold text-[#F5E6C8] leading-snug mb-3">
            {todayCard.nepali}
          </blockquote>
          <p className="text-[12px] italic text-[#D4A882] leading-relaxed">
            {todayCard.english}
          </p>
        </div>

        {/* Footer strip */}
        <div>
          <DhakaBand className="opacity-40 my-4" />
          <p className="text-[10px] text-[#D4A882] leading-relaxed">
            Safe to open in front of family. · Koi judgment chaina.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 bg-pageBg flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm animate-fadeUp">

          <h1 className="font-serif text-[30px] text-ink leading-tight mb-1">
            Swagat chha 🙏
          </h1>
          <p className="text-textMuted text-sm mb-8">
            Aaphno account ma feri aaunus
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-semibold text-textMuted uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tapai@email.com"
                className="w-full px-4 py-3 rounded-xl border border-sand bg-feedBg text-ink placeholder:text-sand focus:outline-none focus:border-himalayan transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-textMuted uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-sand bg-feedBg text-ink placeholder:text-sand focus:outline-none focus:border-himalayan transition-colors text-sm"
              />
            </div>

            {error && (
              <div className="bg-[#FEF0EE] border border-[#F5C5BF] rounded-xl px-4 py-3">
                <p className="text-sindoor text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-pageBg py-3 rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? 'Haliraxa...' : 'Login garnus →'}
            </button>
          </form>

          <DhakaBand className="my-7" />

          <p className="text-center text-sm text-textMuted">
            Naya chha?{' '}
            <Link to="/signup" className="text-himalayan font-semibold hover:underline">
              Account banaunus
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
