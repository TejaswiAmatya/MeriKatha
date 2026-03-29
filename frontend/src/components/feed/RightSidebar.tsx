import { useNavigate } from 'react-router-dom'
import { DhakaBand } from '../ui/DhakaBand'
import { DiyoBaln } from './DiyoBaln'
import { useLang } from '../../context/LangContext'

export function RightSidebar() {
  const navigate = useNavigate()
  const { lang } = useLang()
  return (
    <div className="p-3 flex flex-col gap-3">
      {/* SOS Sahara badge — links to Sahara page */}
      <div
        onClick={() => navigate('/sahara')}
        className="bg-sindoor rounded-xl p-2.5 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <span className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
        <span className="text-xs font-semibold text-white">{lang === 'en' ? 'Sahara · Need support?' : 'सहारा · Need support?'}</span>
      </div>

      {/* Diyo Baln widget */}
      <DiyoBaln />

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
          {lang === 'en' ? 'Start talking →' : 'कुरा गर्नुस् →'}
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
