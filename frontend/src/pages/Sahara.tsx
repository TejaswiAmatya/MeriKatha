import { Link } from 'react-router-dom'
import { DhakaBand } from '../components/ui/DhakaBand'

const nepalResources = [
  { name: 'Saathi Nepal',        contact: '01-4268474', desc: 'Sanga basa — sathi jastai' },
  { name: 'WOREC Nepal',         contact: '01-4371399', desc: 'Mahila sahayog ra adhikar' },
  { name: 'TPO Nepal',           contact: '01-4423596', desc: 'Mann ko sathi' },
  { name: 'Maiti Nepal',         contact: '01-4479898', desc: 'Surakchhit sthan' },
  { name: "Women's Police Cell", contact: '100',        desc: 'Emergency' },
]

const usResources = [
  { name: '988 Suicide & Crisis Lifeline', contact: '988',            desc: 'Call or text — 24/7' },
  { name: 'National DV Hotline',           contact: '1-800-799-7233', desc: 'Domestic violence support' },
  { name: 'RAINN',                         contact: '1-800-656-4673', desc: 'Sexual assault helpline' },
  { name: 'Crisis Text Line',              contact: '741741',         desc: 'Text HOME to 741741' },
  { name: 'API-GBV (Asian/Pacific Women)', contact: '1-877-942-7474', desc: 'South Asian community support' },
]

const otherDiasporaResources = [
  { country: 'UK',        contact: '116 123',  name: 'Samaritans' },
  { country: 'Australia', contact: '13 11 14', name: 'Lifeline' },
]

export function Sahara() {
  return (
    <div className="min-h-screen bg-pageBg font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 h-12 bg-pageBg/90 backdrop-blur-sm border-b border-sand flex items-center px-5 gap-3">
        <Link to="/feed" className="text-textMuted text-xs hover:text-ink transition-colors">
          ← Farka
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sindoor flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xs">छ</span>
          </div>
          <span className="font-serif font-bold text-ink">सहारा</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Intro */}
        <p className="text-[9px] tracking-widest uppercase text-textMuted mb-2">SAHARA · सहारा</p>
        <h1 className="font-serif font-bold text-3xl text-ink leading-tight mb-2">
          Timi eklai chaina.
        </h1>
        <p className="text-sm text-textBody leading-relaxed mb-6">
          Yiniharu tapaiko kura sunna tayyar chan. Call garna hesitate nagara — yo bravery ho.
        </p>

        <DhakaBand />

        {/* Nepal resources */}
        <div className="mt-6 mb-2">
          <p className="text-[9px] tracking-widest uppercase text-textMuted mb-3">NEPAL</p>
          <div className="flex flex-col gap-2">
            {nepalResources.map((r) => (
              <a
                key={r.contact}
                href={`tel:${r.contact}`}
                className="bg-pageBg border border-sand rounded-xl px-4 py-3 flex items-center justify-between hover:border-textMuted transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{r.name}</p>
                  <p className="text-xs text-textMuted mt-0.5">{r.desc}</p>
                </div>
                <span className="text-sm font-semibold text-sindoor shrink-0 ml-3">{r.contact}</span>
              </a>
            ))}
          </div>
        </div>

        <DhakaBand className="my-6" />

        {/* US resources */}
        <div className="mb-2">
          <p className="text-[9px] tracking-widest uppercase text-textMuted mb-3">UNITED STATES</p>
          <div className="flex flex-col gap-2">
            {usResources.map((r) => (
              <a
                key={r.contact}
                href={r.contact === '741741' ? 'sms:741741&body=HOME' : `tel:${r.contact}`}
                className="bg-pageBg border border-sand rounded-xl px-4 py-3 flex items-center justify-between hover:border-textMuted transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{r.name}</p>
                  <p className="text-xs text-textMuted mt-0.5">{r.desc}</p>
                </div>
                <span className="text-sm font-semibold text-sindoor shrink-0 ml-3">{r.contact}</span>
              </a>
            ))}
          </div>
        </div>

        <DhakaBand className="my-6" />

        {/* Other diaspora */}
        <div className="mb-8">
          <p className="text-[9px] tracking-widest uppercase text-textMuted mb-3">OTHER DIASPORA</p>
          <div className="flex flex-col gap-2">
            {otherDiasporaResources.map((r) => (
              <a
                key={r.contact}
                href={`tel:${r.contact}`}
                className="bg-pageBg border border-sand rounded-xl px-4 py-3 flex items-center justify-between hover:border-textMuted transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{r.country}</p>
                  <p className="text-xs text-textMuted mt-0.5">{r.name}</p>
                </div>
                <span className="text-sm font-semibold text-sindoor shrink-0 ml-3">{r.contact}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="bg-feedBg rounded-xl p-4 border border-sand text-center">
          <p className="text-xs text-textBody leading-relaxed">
            Yiniharu tapaiko kura sunna tayyar chan. Yo "crisis" hoina — yo care ho. 🙏
          </p>
        </div>
      </div>
    </div>
  )
}
