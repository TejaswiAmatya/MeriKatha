import { useNavigate } from 'react-router-dom'
import { circles } from '../../data/mockStories'
import { DhakaBand } from '../ui/DhakaBand'

export function RightSidebar() {
  const navigate = useNavigate()
  return (
    <div className="p-3 flex flex-col gap-3">
      {/* SOS Sahara badge */}
      <div className="bg-sindoor rounded-xl p-2.5 flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
        <span className="text-xs font-semibold text-white">सहारा · Need support?</span>
      </div>

      {/* Trending Circles */}
      <div className="bg-cardWhite border border-sand rounded-xl p-3">
        <h3 className="font-serif text-[13px] font-bold text-ink mb-2">Trending सर्कल</h3>
        {circles.slice(0, 3).map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2 py-1.5 border-b border-[#F0EAE0] text-xs text-ink last:border-0"
          >
            <div className={`w-5 h-5 rounded-full ${c.color} flex items-center justify-center shrink-0`}>
              <span className="text-white text-[7px] font-bold font-serif">{c.initial}</span>
            </div>
            <div>
              <p className="font-semibold text-[11px]">{c.name}</p>
              <p className="text-[9px] text-textMuted">
                {Math.floor(Math.random() * 200 + 50)} members
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Aangan Bot widget */}
      <div className="bg-cardWhite border border-sand rounded-xl p-3">
        <h3 className="font-serif text-[13px] font-bold text-ink mb-2">Aangan Bot</h3>
        <div className="bg-feedBg rounded-lg p-2 text-xs text-textBody leading-relaxed">
          "Timro kura sunne manche chhu" 🙏
        </div>
        <button
          onClick={() => navigate('/bot')}
          className="bg-ink text-pageBg rounded-full px-3 py-1 text-[10px] font-semibold mt-2 w-full hover:opacity-90 transition-opacity"
        >
          कुरा गर्नुस् →
        </button>
      </div>

      {/* Didi Circles widget */}
      <div className="bg-cardWhite border border-sand rounded-xl p-3">
        <h3 className="font-serif text-[13px] font-bold text-ink mb-2">Didi Circles</h3>
        <p className="text-xs text-textMuted leading-relaxed">
          Saathiharuko group — chhittai aaudai cha.
        </p>
        <span className="text-[9px] bg-sand/50 text-textMuted rounded-full px-2 py-0.5 mt-2 inline-block">
          Coming soon
        </span>
      </div>

      <DhakaBand />
    </div>
  )
}
