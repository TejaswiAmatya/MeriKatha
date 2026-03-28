import { circles } from '../../data/mockStories'
import { DhakaBand } from '../ui/DhakaBand'

const navItems = [
  { label: 'गृहपृष्ठ', labelEn: 'Home', icon: '🏠', active: true },
  { label: 'लोकप्रिय', labelEn: 'Popular', icon: '🔥', active: false },
  { label: 'अन्वेषण', labelEn: 'Explore', icon: '🧭', active: false },
]

const featureItems = [
  { label: 'Mann ko Mausam', icon: '⛅' },
  { label: 'Diyo Baln', icon: '🪔' },
  { label: 'Aangan Bot', icon: '🙏' },
  { label: 'Sahara', icon: '🤝' },
]

export function LeftSidebar() {
  return (
    <nav className="p-3 text-[13px] font-sans">
      {/* Main nav */}
      {navItems.map((item) => (
        <button
          key={item.labelEn}
          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
            item.active ? 'bg-ink text-pageBg' : 'text-ink hover:bg-feedBg'
          }`}
        >
          <span className="text-sm">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}

      <hr className="border-sand my-3" />

      {/* Circles */}
      <p className="text-[9px] tracking-widest uppercase text-textMuted px-2 mb-2">सर्कल</p>
      {circles.map((c) => (
        <button
          key={c.id}
          className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-ink hover:bg-feedBg transition-colors"
        >
          <div className={`w-4 h-4 rounded-full ${c.color} flex items-center justify-center shrink-0`}>
            <span className="text-white text-[8px] font-bold font-serif">{c.initial}</span>
          </div>
          <span className="text-xs">c/{c.id}</span>
        </button>
      ))}

      <hr className="border-sand my-3" />

      {/* Features */}
      {featureItems.map((item) => (
        <button
          key={item.label}
          className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-ink hover:bg-feedBg transition-colors"
        >
          <span className="text-sm">{item.icon}</span>
          <span className="text-xs">{item.label}</span>
        </button>
      ))}

      {/* Footer */}
      <div className="mt-6">
        <DhakaBand />
        <p className="text-[9px] text-textMuted text-center mt-2">
          Safe to open in front of family
        </p>
      </div>
    </nav>
  )
}
