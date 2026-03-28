import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DhakaBand } from '../components/ui/DhakaBand'

const circles = [
  { name: 'c/NayaAama',      nepali: 'नया आमा सर्कल',     color: '#4A9B7E' },
  { name: 'c/Pardesh',       nepali: 'परदेश सर्कल',        color: '#7B3F2B' },
  { name: 'c/SathiCircle',   nepali: 'साथी सर्कल',         color: '#E8A020' },
  { name: 'c/PadhneBahini',  nepali: 'पढ्ने बहिनी सर्कल', color: '#C0392B' },
]

export function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Password match bhएन. Feri check garnus.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signup(email, password)
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

        {/* Mandala decoration — bottom left corner */}
        <div className="absolute -bottom-12 -left-12 w-56 h-56 opacity-[0.08] pointer-events-none" aria-hidden>
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

        {/* Circles preview */}
        <div className="py-6">
          <p className="text-[9px] tracking-widest uppercase text-[#D4A882] mb-2">
            DIDI CIRCLES — तपाईंको ठाउँ
          </p>
          <p className="font-serif text-[18px] font-bold text-[#F5E6C8] leading-snug mb-6">
            साथीहरू<br />पर्खिरहेका छन्।
          </p>
          <div className="space-y-3">
            {circles.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: c.color }}
                >
                  {c.nepali.charAt(0)}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#F5E6C8] leading-none">{c.nepali}</p>
                  <p className="text-[10px] text-[#D4A882] mt-0.5">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
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
            Aagaman chha 🌸
          </h1>
          <p className="text-textMuted text-sm mb-8">
            Naya account banaunus — bilkul nishulka
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
                Password{' '}
                <span className="normal-case tracking-normal text-[10px] font-normal">(8+ akshar)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-sand bg-feedBg text-ink placeholder:text-sand focus:outline-none focus:border-himalayan transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-textMuted uppercase tracking-widest mb-2">
                Password feri halnus
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
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
              {loading ? 'Banaudai chha...' : 'Account banaunus →'}
            </button>
          </form>

          <DhakaBand className="my-7" />

          <p className="text-center text-sm text-textMuted">
            Account chha?{' '}
            <Link to="/login" className="text-himalayan font-semibold hover:underline">
              Login garnus
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
