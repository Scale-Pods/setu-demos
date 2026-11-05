import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp, type Route } from './store'

const STEPS: { r: Route; v?: string | null; c: string }[] = [
  { r: 'scan', c: 'It starts anywhere — a pilgrim scans a QR posted on a pole, gate or ghat. No app, no pass. Kumbh Setu opens knowing where they are.' },
  { r: 'citizen', c: 'The Pilgrim app — built for the walk-in crowd who carry no pass. It greets by location and puts everything around them one tap away.' },
  { r: 'citizen', v: 'plan', c: 'Plan my visit — pick a calmer day, pre-register the group, check what to carry.' },
  { r: 'citizen', v: 'park', c: 'Park & Ride — live approach traffic and free spaces, so pilgrims park outside and ride in.' },
  { r: 'citizen', v: 'stay', c: 'Where to stay — free and paid beds, updated by sevaks minutes ago.' },
  { r: 'citizen', v: 'food', c: 'Free food & bhandara — what is open, the wait, and what is being served.' },
  { r: 'citizen', v: 'services', c: 'Nearest services — water, toilets, first-aid, help desk, charging.' },
  { r: 'citizen', v: 'route', c: 'My ghat & route — crowd now, a calmer window, and a route.' },
  { r: 'citizen', v: 'snan', c: 'Shahi Snan dates, with reminders — Amrit Snan days flagged.' },
  { r: 'citizen', v: 'sahayak', c: 'Sahayak — a voice assistant in English, Hindi and Punjabi.' },
  { r: 'volunteer', c: 'Sevak data source — only registered volunteers update official information.' },
  { r: 'officer', c: 'Command console — live density, alerts, incidents, lost & found. The numbers move as fresh data arrives.' },
  { r: 'platform', c: 'Platform — one config re-skins every view for another mela. Integrations, use-cases and a live config editor.' },
  { r: 'home', c: 'Back to the start. One platform — every pilgrim, every sevak, every mela. Thank you.' },
]

export function Tour() {
  const { tour, setTour, go, setCitizenView, setSevak, setMela } = useApp()
  const [paused, setPaused] = useState(false)
  const n = tour ?? -1
  useEffect(() => {
    if (tour === null) return
    const s = STEPS[tour]
    if (s.r === 'volunteer') setSevak({ name: 'Demo Sevak', phone: '', post: 'Bhandara counter — ISKCON Annakshetra' })
    if (s.r === 'platform') setMela('prayagraj')
    go(s.r); setCitizenView(s.v ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour])
  useEffect(() => {
    if (tour === null || paused) return
    const id = setTimeout(() => (tour < STEPS.length - 1 ? setTour(tour + 1) : setTour(null)), 6500)
    return () => clearTimeout(id)
  }, [tour, paused, setTour])
  if (tour === null) return null
  return (
    <aside className="glass tour" role="dialog" aria-label="Guided demo">
      <div className="row between"><span className="tag acc">Guided demo</span><span className="faint mono">{n + 1} / {STEPS.length}</span></div>
      <p>{STEPS[n].c}</p>
      <div className="bar"><i style={{ width: ((n + 1) / STEPS.length) * 100 + '%' }} /></div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn ghost sm" disabled={n === 0} onClick={() => setTour(n - 1)}><ChevronLeft size={16} /> Prev</button>
        <button className="btn ghost sm" onClick={() => setPaused(p => !p)}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? 'Play' : 'Pause'}</button>
        <button className="btn primary sm" onClick={() => (n < STEPS.length - 1 ? setTour(n + 1) : setTour(null))}>Next <ChevronRight size={16} /></button>
        <button className="iconbtn" style={{ marginLeft: 'auto' }} aria-label="Close" onClick={() => { setTour(null); go('home') }}><X size={18} /></button>
      </div>
    </aside>
  )
}
