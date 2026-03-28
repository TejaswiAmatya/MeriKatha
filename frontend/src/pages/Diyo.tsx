import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DIYOS = [
  {
    id: 'chedchhad',
    label: 'छेडछाड',
    sublabel: 'Sexual Harassment',
    affirmations: [
      'Timro galti hoina — kabhi thiena',
      'Timilai vishwas garchhu',
      'Bolna saknu nai himmat ho',
      'Timi safe hunu deserve garchau',
      'Timro awaz matter garchha',
      'Timi eklai ladhnau pardaina — saath cha',
      'Timro boundary respect hunu parchha',
      'Jo bhayo tyo timro parichay hoina',
    ],
    // position on the scattered canvas (% based)
    pos: { top: '18%', left: '12%' },
    rotate: '-6deg',
  },
  {
    id: 'society',
    label: 'समाजको बोझ',
    sublabel: 'Society Pressure',
    affirmations: [
      'Timro life timro definition ho',
      'Sabko expectations pura garna bandeko hoinas',
      'Log ke sochcha — tyo timro story hoina',
      'Timro khushi ko permission kasaile dina hudaina',
      'Afno pace ma hidnu thik ho',
      'Samaj ko mold ma fit huna pardaina',
      'Timro choice valid cha',
      'Expectations le timilai define gardaina',
    ],
    pos: { top: '14%', left: '62%' },
    rotate: '5deg',
  },
  {
    id: 'naya-aama',
    label: 'नयाँ आमाको मन',
    sublabel: 'Naya Aama',
    affirmations: [
      'Ramri aama banna lai perfect huna pardaina',
      'Rest linu galat hoina',
      'Timi eklai handle garna pardaina',
      'Timro baby lai timi nai chahieko ho',
      'Aafu lai time dinu pani maya ho',
      'Timi strong chau — aaja pani, bholi pani',
      'Help maagna wisdom ho',
      'Timro feelings real chan, valid chan',
    ],
    pos: { top: '58%', left: '20%' },
    rotate: '-3deg',
  },
  {
    id: 'mann-bechain',
    label: 'मन बेचैन',
    sublabel: 'Anxiety',
    affirmations: [
      'Ek breath — bas ek breath',
      'Aaja ko lagi yeti pugcha',
      'Timro pace nai thik pace ho',
      'Yo moment bitchha — timi strong chau',
      'Chinta le define gardaina timilai',
      'Aafu sanga gentle hunu thik ho',
      'Bistarai — koi rush chhaina',
      'Timi bhanda badi timi ko katha cha',
    ],
    pos: { top: '55%', left: '65%' },
    rotate: '8deg',
  },
]

// Decorative ambient diyos (no theme, dimmer)
const AMBIENT = [
  { id: 'a1', pos: { top: '38%', left: '44%' }, rotate: '-2deg', size: 'sm' },
  { id: 'a2', pos: { top: '80%', left: '45%' }, rotate: '4deg', size: 'xs' },
  { id: 'a3', pos: { top: '5%', left: '40%' }, rotate: '-5deg', size: 'xs' },
  { id: 'a4', pos: { top: '75%', left: '8%' }, rotate: '3deg', size: 'xs' },
  { id: 'a5', pos: { top: '72%', left: '82%' }, rotate: '-4deg', size: 'xs' },
]

type Phase = 'idle' | 'darkening' | 'lit'

export function Diyo() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [message, setMessage] = useState('')
  const [msgDiyo, setMsgDiyo] = useState<(typeof DIYOS)[number] | null>(null)
  const lastMsgRef = useRef<Record<string, string>>({})
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    }
  }, [])

  function pickAffirmation(diyo: (typeof DIYOS)[number]) {
    const last = lastMsgRef.current[diyo.id]
    const others = diyo.affirmations.filter((a) => a !== last)
    const pick = others[Math.floor(Math.random() * others.length)]
    lastMsgRef.current[diyo.id] = pick
    return pick
  }

  function handleDiyoClick(diyo: (typeof DIYOS)[number]) {
    if (activeId === diyo.id && phase === 'lit') {
      // Relight — new affirmation
      setPhase('darkening')
      setMessage('')
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      phaseTimerRef.current = setTimeout(() => {
        setPhase('lit')
        setMessage(pickAffirmation(diyo))
      }, 600)
      return
    }

    if (phase === 'darkening') return

    setActiveId(diyo.id)
    setMsgDiyo(diyo)
    setPhase('darkening')
    setMessage('')
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    phaseTimerRef.current = setTimeout(() => {
      setPhase('lit')
      setMessage(pickAffirmation(diyo))
    }, 600)
  }

  function handleClose() {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    setActiveId(null)
    setPhase('idle')
    setMessage('')
    setMsgDiyo(null)
  }

  const isLit = phase === 'lit'
  const isDarkening = phase === 'darkening'
  const anyActive = activeId !== null

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 ${
        isDarkening ? 'bg-[#040302]' : 'bg-[#0e0c09]'
      }`}
    >
      {/* Ambient warm radial glow — always present, brightens when lit */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(217,119,6,0.09)_0%,transparent_70%)] ${
          isLit ? 'opacity-100' : 'opacity-40'
        }`}
      />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-5 left-5 z-30 flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-500 cursor-pointer ${
          anyActive && !isLit ? 'text-[#2a2010]' : 'text-[#7a6a58] hover:text-amber-400'
        }`}
      >
        ← Farka
      </button>

      {/* Page title */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
            isLit
              ? 'bg-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.9)]'
              : isDarkening
                ? 'bg-[#2a2010]'
                : 'bg-amber-600 shadow-[0_0_5px_rgba(217,119,6,0.4)]'
          }`}
        />
        <h1
          className={`text-[12px] uppercase tracking-widest font-semibold transition-colors duration-700 ${
            isLit ? 'text-amber-400' : isDarkening ? 'text-[#2a2010]' : 'text-[#6a5a48]'
          }`}
        >
          Diyo
        </h1>
      </div>

      {/* Hint text — only idle */}
      {!anyActive && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-[11px] text-[#5a4a38] text-center">
          Yo diyo baln — affirmation paunus
        </p>
      )}

      {/* Ambient decorative diyos */}
      {AMBIENT.map((a) => (
        <div
          key={a.id}
          className="absolute pointer-events-none select-none"
          style={{ top: a.pos.top, left: a.pos.left, transform: `rotate(${a.rotate})` }}
        >
          <span
            className={`inline-block transition-all duration-700 ${
              a.size === 'xs' ? 'text-xl' : 'text-2xl'
            } ${
              anyActive
                ? isDarkening
                  ? 'opacity-0'
                  : 'opacity-10'
                : 'opacity-25 diyo-ambient'
            }`}
          >
            🪔
          </span>
        </div>
      ))}

      {/* Themed diyos */}
      {DIYOS.map((diyo) => {
        const isActive = activeId === diyo.id
        const isOther = anyActive && !isActive

        return (
          <button
            key={diyo.id}
            onClick={() => handleDiyoClick(diyo)}
            className="absolute z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
            style={{
              top: diyo.pos.top,
              left: diyo.pos.left,
              transform: `rotate(${diyo.rotate})`,
            }}
          >
            <span
              className={`inline-block transition-all duration-500 text-5xl ${
                isActive && isLit
                  ? 'diyo-flame-active scale-110'
                  : isActive && isDarkening
                    ? 'diyo-flame-dark'
                    : isOther
                      ? isDarkening
                        ? 'opacity-0 scale-75'
                        : 'opacity-20 scale-90'
                      : 'diyo-flame group-hover:scale-110'
              }`}
            >
              🪔
            </span>
            <span
              className={`text-[10px] font-semibold leading-tight text-center max-w-[80px] transition-all duration-500 ${
                isActive && isLit
                  ? 'text-amber-300'
                  : isActive && isDarkening
                    ? 'text-[#1a1510]'
                    : isOther
                      ? 'opacity-0'
                      : 'text-[#9a8870] group-hover:text-amber-400'
              }`}
            >
              {diyo.label}
            </span>
          </button>
        )
      })}

      {/* Affirmation card — centered, floats up when lit */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 z-20 w-[min(340px,85vw)] transition-all duration-500 ease-out ${
          isLit
            ? 'top-1/2 -translate-y-1/2 opacity-100'
            : isDarkening
              ? 'top-[55%] -translate-y-1/2 opacity-0'
              : 'top-[55%] -translate-y-1/2 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-b from-[#221a0a] to-[#16110a] border border-[#3a2a10] rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(217,119,6,0.25),inset_0_0_40px_rgba(217,119,6,0.05)]">
          {/* Card header */}
          <div className="bg-gradient-to-r from-[#2a1e08] to-[#1f1608] px-4 py-2.5 flex items-center justify-between border-b border-[#3a2a10]">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              🪔 {msgDiyo?.label}
              <span className="text-amber-600/60 font-normal text-[10px]">— {msgDiyo?.sublabel}</span>
            </span>
            <button
              onClick={handleClose}
              className="text-[#5a4a30] hover:text-amber-300 text-sm px-1.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Message */}
          <div className="px-6 py-7 text-center">
            <p className="text-[15px] text-amber-100/90 leading-relaxed italic font-serif">
              "{message}"
            </p>
            <p className="text-[10px] text-amber-700/50 mt-4">
              Arko affirmation — diyo ma click garnus
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        .diyo-flame {
          animation: flicker 2.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 4px rgba(217,119,6,0.35));
        }
        .diyo-ambient {
          animation: flicker 3.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 2px rgba(217,119,6,0.2));
        }
        .diyo-flame-dark {
          filter: grayscale(1) brightness(0.15);
          transition: filter 0.4s ease, opacity 0.4s ease;
        }
        .diyo-flame-active {
          animation: flickerActive 1.8s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 14px rgba(217,119,6,0.8));
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          25% { transform: scale(1.04) rotate(0.5deg); }
          50% { transform: scale(0.97) rotate(-0.5deg); }
          75% { transform: scale(1.03) rotate(1deg); }
        }
        @keyframes flickerActive {
          0%, 100% { transform: scale(1) rotate(-1deg); filter: drop-shadow(0 0 14px rgba(217,119,6,0.8)); }
          25% { transform: scale(1.12) rotate(1deg); filter: drop-shadow(0 0 24px rgba(217,119,6,1)); }
          50% { transform: scale(0.95) rotate(-1deg); filter: drop-shadow(0 0 9px rgba(217,119,6,0.55)); }
          75% { transform: scale(1.08) rotate(0.5deg); filter: drop-shadow(0 0 18px rgba(217,119,6,0.9)); }
        }
      `}</style>
    </div>
  )
}
