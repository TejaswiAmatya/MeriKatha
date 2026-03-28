import { useState } from 'react'
import { wisdomCards } from '../../data/mockStories'
import { DhakaBand } from '../ui/DhakaBand'

const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
)
const todayCard = wisdomCards[dayOfYear % wisdomCards.length]

const moods = ['☀️', '⛅', '🌫️', '⛈️', '🌧️']

const affirmations = [
  'Yasto din lai embrace gara, didi. Khushi feel garna thik cha.',
  'Mixed feelings hunu normal ho. Sab kuch thik huncha.',
  'Confused feel garna pani ek kism ko bravery ho.',
  'Yo bhari lageko mann suneko cha. Eklai chaina.',
  'Yo sadness lai judge nagara. Yahan safe cha.',
]

function BuwaAamaWisdom() {
  return (
    <div className="bg-maroon rounded-xl p-4">
      <p className="text-[9px] tracking-widest uppercase" style={{ color: '#D4A882' }}>
        BUWA-AAMA KO GUFF
      </p>
      <p className="font-serif text-[13px] font-bold leading-snug mt-1.5" style={{ color: '#F5E6C8' }}>
        {todayCard.nepali}
      </p>
      <p className="text-[10px] italic mt-1" style={{ color: '#D4A882' }}>
        {todayCard.english}
      </p>
    </div>
  )
}

function MannKoMausam() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="bg-himalayan rounded-xl p-4">
      <p className="text-[9px] tracking-widest uppercase" style={{ color: '#C8E6DA' }}>
        MANN KO MAUSAM
      </p>
      <p className="font-serif text-[12px] font-bold text-white mt-1 mb-3">
        Aaja kasto lagdai cha?
      </p>
      <div className="flex gap-1">
        {moods.map((m, i) => (
          <button
            key={m}
            onClick={() => setSelected(i)}
            className={`flex-1 rounded-lg py-1 text-center text-xs transition-all duration-150 ${
              selected === i ? 'bg-white scale-105' : 'bg-white/20'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className="text-[10px] text-white/90 mt-3 leading-relaxed">
          {affirmations[selected]}
        </p>
      )}
    </div>
  )
}

function DiyoBaln() {
  return (
    <div className="bg-peach rounded-xl p-4 flex flex-col items-center justify-center">
      <div className="text-3xl animate-flicker">🪔</div>
      <p className="text-xs text-maroon text-center mt-2">
        Ek ichha, ek dar, ek prayer
      </p>
      <button className="bg-ink text-pageBg rounded-full px-3 py-1 text-[10px] font-semibold mt-2 hover:opacity-90 transition-opacity">
        Diyo baal →
      </button>
    </div>
  )
}

function AanganBot() {
  return (
    <div className="bg-feedBg rounded-xl p-4 border border-sand">
      <p className="text-[9px] tracking-widest uppercase text-textMuted">
        AANGAN BOT
      </p>
      <div className="bg-cardWhite rounded-lg p-2 text-xs text-textBody leading-relaxed mt-2">
        "Timro kura sunne manche chhu" 🙏
      </div>
      <button className="bg-ink text-pageBg rounded-full px-3 py-1 text-[10px] font-semibold mt-2 hover:opacity-90 transition-opacity">
        Aangan maa jaau →
      </button>
    </div>
  )
}

const variants = [BuwaAamaWisdom, MannKoMausam, DiyoBaln, AanganBot]

export function BentoBlock({ variant }: { variant: number }) {
  const left = variant % variants.length
  const right = (variant + 1) % variants.length
  const Left = variants[left]
  const Right = variants[right]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden">
      <Left />
      <Right />
    </div>
  )
}
