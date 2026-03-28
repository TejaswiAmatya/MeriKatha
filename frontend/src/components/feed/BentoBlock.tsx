import { wisdomCards } from '../../data/mockStories'

const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
)
const todayCard = wisdomCards[dayOfYear % wisdomCards.length]

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

export function BentoBlock({ variant: _ }: { variant: number }) {
  return (
    <div className="rounded-xl overflow-hidden">
      <BuwaAamaWisdom />
    </div>
  )
}
