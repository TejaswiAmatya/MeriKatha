const items = [
  { label: 'Home', icon: '🏠', active: true },
  { label: 'Circles', icon: '⭕', active: false },
  { label: 'Katha', icon: '📖', active: false },
  { label: 'Aangan', icon: '🙏', active: false },
  { label: 'Profile', icon: '👤', active: false },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-pageBg border-t border-sand flex items-center justify-around z-40 md:hidden">
      {items.map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center gap-0.5 ${
            item.active ? 'text-ink' : 'text-textMuted'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className={`text-[9px] ${item.active ? 'font-semibold' : ''}`}>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
