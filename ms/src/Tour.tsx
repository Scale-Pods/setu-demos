import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp, type Screen } from './store'
import type { Lang } from './data'

const STEPS: { s: Screen; j?: string | null; lang?: Lang; st?: string; c: string }[] = [
  { s: 'scan', st: 'up', c: 'It starts with a scan — the voter scans the QR on their Voter Information Slip, and Matdaan Mitra opens, personalised to them. No app to install.' },
  { s: 'citizen', lang: 'en', c: 'The Citizen app — personalised to the scanned voter (here, Kavita Verma, Lucknow). Twelve services, grouped into Plan, Vote and Help.' },
  { s: 'citizen', j: 'booth', c: 'Find my booth — her booth is already shown: station, BLO, facilities, map and live queue. Others can be looked up too.' },
  { s: 'citizen', j: 'candidate', lang: 'hi', c: 'Know your candidate, in Hindi — tap a candidate for the full affidavit: assets, liabilities and criminal cases.' },
  { s: 'citizen', j: 'track', lang: 'en', c: 'Track a complaint — a live cVIGIL status timeline, report to action within the 100-minute window.' },
  { s: 'citizen', j: 'help', c: 'Mitra greets the voter by name — quick questions or type your own, in her language.' },
  { s: 'home', c: 'Officials and admins enter separately — role-based sign-in on the portal, as in production.' },
  { s: 'officer', c: 'The Officer console — live alerts, KPIs, turnout, a grievance queue and the booths needing a marshal.' },
  { s: 'platform', st: 'mh', c: 'Platform — load Maharashtra and the whole app re-skins: Marathi, Nagpur data, new dashboards.' },
  { s: 'platform', c: 'System integrations, use-cases, and a live config editor — add a new state as data, not code.' },
  { s: 'scan', st: 'up', lang: 'en', c: 'Back to the start. Scan, and the citizen journey begins again. Thank you.' },
]

export function Tour() {
  const { tour, setTour, go, setJourney, setState, setLang } = useApp(); const [paused, setPaused] = useState(false)
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    if (tour === null) return
    const s = STEPS[tour]; if (s.st) setState(s.st); if (s.lang) setLang(s.lang)
    go(s.s); setJourney(s.j ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour])
  useEffect(() => {
    if (tour === null || paused || reduce) return
    const id = setTimeout(() => (tour < STEPS.length - 1 ? setTour(tour + 1) : setTour(null)), 6600); return () => clearTimeout(id)
  }, [tour, paused, reduce, setTour])
  if (tour === null) return null
  const n = tour
  return (<aside className="glass tour" role="dialog" aria-label="Guided demo">
    <div className="row between"><span className="tag acc">Guided demo</span><span className="faint mono">{n + 1} / {STEPS.length}</span></div>
    <p>{STEPS[n].c}</p><div className="bar"><i style={{ width: ((n + 1) / STEPS.length) * 100 + '%' }} /></div>
    <div className="row" style={{ marginTop: 12 }}>
      <button className="btn ghost sm" disabled={n === 0} onClick={() => setTour(n - 1)}><ChevronLeft size={16} /> Prev</button>
      <button className="btn ghost sm" onClick={() => setPaused(p => !p)}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? 'Play' : 'Pause'}</button>
      <button className="btn primary sm" onClick={() => (n < STEPS.length - 1 ? setTour(n + 1) : setTour(null))}>Next <ChevronRight size={16} /></button>
      <button className="iconbtn" style={{ marginLeft: 'auto' }} aria-label="Close" onClick={() => { setTour(null); go('scan') }}><X size={18} /></button></div>
  </aside>)
}
