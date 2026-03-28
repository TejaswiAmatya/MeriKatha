import { useState } from 'react'
import { Link } from 'react-router-dom'

const contacts = [
  { name: 'Saathi Nepal', number: '01-4268474' },
  { name: 'TPO Nepal',    number: '01-4423596' },
  { name: 'Emergency',   number: '100' },
]

export function SOSButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-ink text-pageBg rounded-full px-4 py-2 text-xs font-semibold font-sans flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
        aria-label="Sahara — support resources"
      >
        <span className="w-2 h-2 bg-sindoor rounded-full animate-pulse shrink-0" />
        सहारा
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 flex items-end justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-pageBg rounded-2xl p-6 w-full max-w-sm mb-4 animate-fadeUp"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-serif text-xl font-bold text-ink mb-1">Thik chha? 🙏</p>
            <p className="text-sm text-textBody mb-4 leading-relaxed font-sans">
              Yahan kehi resources chan jo tero sath huncha:
            </p>

            <div className="flex flex-col gap-3 mb-5">
              {contacts.map((r) => (
                <a
                  key={r.number}
                  href={`tel:${r.number}`}
                  className="flex items-center justify-between bg-feedBg rounded-xl px-4 py-3 border border-sand hover:border-textMuted transition-colors"
                >
                  <span className="text-sm font-semibold text-ink font-sans">{r.name}</span>
                  <span className="text-sm text-sindoor font-semibold font-sans">{r.number}</span>
                </a>
              ))}
            </div>

            <div className="flex gap-2">
              <Link
                to="/sahara"
                className="flex-1 text-center bg-ink text-pageBg rounded-full py-2 text-xs font-semibold font-sans hover:opacity-90 transition-opacity"
                onClick={() => setOpen(false)}
              >
                Sahara screen maa herne →
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 text-center bg-feedBg text-ink rounded-full py-2 text-xs font-semibold font-sans border border-sand hover:border-textMuted transition-colors"
              >
                Band gara
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
