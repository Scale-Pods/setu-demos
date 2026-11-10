import { Accessibility, Bed, Download, Radar, Bell, BusFront, CalendarDays, Car, ClipboardList, Droplets, HeartHandshake, HeartPulse, Map, MapPin, Megaphone, Mic, Navigation, Phone, Send, Share2, Siren, Soup, Stethoscope, Users, Waves, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CHAT_QA, FOOD, LOTS, ROADS, SERVICES, SNAN, STAYS } from '../data'
import { useApp } from '../store'
import { CrowdRoute, Group, Offline } from '../features'
import { AppBar, Meter, Ring, sev, sevLabel, fmt } from '../ui'

interface Tile { k: string; icon: LucideIcon; c: string }
const GROUPS: { title: string; tiles: Tile[] }[] = [
  { title: 'Plan & navigate', tiles: [{ k: 'plan', icon: CalendarDays, c: '#a78bfa' }, { k: 'offline', icon: Download, c: '#38bdf8' }, { k: 'route', icon: Map, c: '#60a5fa' }, { k: 'crowd', icon: Waves, c: '#2dd4bf' }, { k: 'snan', icon: Bell, c: '#fbbf24' }] },
  { title: 'Stay, eat & move', tiles: [{ k: 'stay', icon: Bed, c: '#f472b6' }, { k: 'food', icon: Soup, c: '#ff8a3d' }, { k: 'water', icon: Droplets, c: '#38bdf8' }, { k: 'park', icon: Car, c: '#818cf8' }, { k: 'around', icon: BusFront, c: '#34d399' }, { k: 'services', icon: MapPin, c: '#fb923c' }] },
  { title: 'Care & community', tiles: [{ k: 'group', icon: Radar, c: '#34d399' }, { k: 'lost', icon: Users, c: '#fb7185' }, { k: 'health', icon: HeartPulse, c: '#f87171' }, { k: 'access', icon: Accessibility, c: '#a3e635' }, { k: 'donate', icon: HeartHandshake, c: '#f59e0b' }, { k: 'community', icon: Megaphone, c: '#22d3ee' }, { k: 'track', icon: ClipboardList, c: '#c084fc' }] },
]

export function Pilgrim() {
  const { citizenView, setCitizenView, t, mela, zone, ghats, say, go } = useApp()
  const h = ghats[0]
  if (citizenView) {
    return (
      <>
        <AppBar title={t(citizenView)} sub={`${mela.ghat} · ${zone}`} back={() => setCitizenView(null)} />
        <main className="screen wrap w-sm"><div className="stack"><View k={citizenView} /></div></main>
        <Sos />
      </>
    )
  }
  return (
    <>
      <AppBar title="KUMBH MITRA" sub={`At ${mela.ghat} · ${mela.name.split(' · ')[0]}`} back={() => go('home')} />
      <main className="screen wrap w-sm">
        <div className="stack" style={{ gap: 18 }}>
          <div><h2 style={{ fontSize: 30, fontWeight: 800 }}>{t('namaste')} <span className="grad-text">🙏</span></h2><p className="muted">{t('help')}</p></div>

          <section className="glass ghatcard" data-tour="ghat">
            <div className="eyebrow">{t('yourGhat')}</div>
            <div className="row" style={{ marginTop: 10, gap: 16 }}>
              <Ring pct={h.pct} />
              <div className="grow">
                <b style={{ fontSize: 18 }}>{h.name.split(' (')[0]}</b>
                <div className="row" style={{ marginTop: 6 }}><span className="tag" style={{ color: sev(h.pct) }}>{sevLabel(h.pct)}</span><span className="faint">live · 30s</span></div>
                <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>Calmer window: after 10:30 AM</div>
              </div>
            </div>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn primary sm grow" onClick={() => setCitizenView('route')}><Navigation size={16} /> Route</button>
              <button className="btn ghost sm grow" onClick={() => setCitizenView('crowd')}>Other ghats</button>
            </div>
          </section>

          <div className="note">Have an e-Pass or wristband? Scanning it links your group for instant lost-person alerts. Walk-in pilgrims get everything else already.</div>

          <div className="groups" data-tour="tiles">
            {GROUPS.map((g, gi) => (
              <section key={g.title}>
                <div className="sec" style={{ marginBottom: 10 }}>{g.title}</div>
                <div className="grid2">
                  {g.tiles.map((x, i) => (
                    <button key={x.k} className="tile" data-k={x.k} style={{ ['--tc' as string]: x.c, animationDelay: gi * 80 + i * 45 + 'ms' }} onClick={() => setCitizenView(x.k)}>
                      <span className="ti"><x.icon size={21} /></span><b>{t(x.k)}</b>
                    </button>
                  ))}
                </div>
              </section>
            ))}
            <button className="glass role" style={{ ['--rc' as string]: '#ff8a3d' }} data-tour="sahayak" onClick={() => setCitizenView('sahayak')}>
              <span className="ic"><Mic size={24} /></span><span><b>{t('sahayak')}</b><span>Voice or chat · English, हिंदी, ਪੰਜਾਬੀ</span></span>
            </button>
          </div>
        </div>
      </main>
      <Sos onClick={() => say('Opening SOS…')} />
    </>
  )
}

function Sos({ onClick }: { onClick?: () => void }) {
  const { setCitizenView } = useApp()
  return <button className="sosfab" aria-label="SOS emergency" onClick={() => { onClick?.(); setCitizenView('report') }}><Siren size={22} /> SOS</button>
}

function View({ k }: { k: string }) {
  const V: Record<string, () => React.ReactNode> = {
    plan: Plan, route: CrowdRoute, group: Group, offline: Offline, crowd: Crowd, stay: Stay, food: Food, water: Water, park: Park, around: Around, services: Services,
    snan: Snan, lost: Lost, health: Health, access: Access, donate: Donate, community: Community, report: Report, track: Track, sahayak: Sahayak,
  }
  const C = V[k]
  return C ? <C /> : null
}

function Plan() {
  const { say } = useApp()
  const [done, setDone] = useState<Record<number, boolean>>({})
  const items = ['Govt photo ID (Aadhaar)', 'Pre-registration / e-Pass (if any)', 'Light cotton clothes + a warm layer', 'Comfortable footwear', 'Water bottle & snacks']
  return (<>
    <p className="muted">Plan before you arrive — pick a calmer day, pre-register your group, and book your stay and parking.</p>
    <div className="note warn">Amrit Snan days draw the biggest crowds. For a calmer darshan, pick a non-Amrit day.</div>
    <div className="sec">Pre-register your group</div>
    <div className="glass card stack"><p className="muted" style={{ fontSize: 14 }}>Link your family now so a lost member can be found instantly on arrival.</p><button className="btn primary" onClick={() => say('Group pass created · KS-' + Math.floor(1000 + Math.random() * 9000))}><Users size={18} /> Create group pass</button></div>
    <div className="sec">Plan your days</div>
    <div className="glass card">{[['Ganga Aarti · Har Ki Pauri', 'Daily at dawn & sunset (~6:45 PM)'], ['Mansa Devi Temple', 'Hilltop shrine · ropeway'], ['Chandi Devi Temple', 'Neel Parvat · ropeway'], ['Maya Devi Temple', 'Ancient Shakti Peeth'], ['Daksha Mahadev · Kankhal', 'Historic Shiva temple']].map(([a, b]) => <div className="kv" key={a}><span>{a}</span><span className="muted" style={{ fontWeight: 400 }}>{b}</span></div>)}</div>
    <div className="sec">What to carry · {Object.values(done).filter(Boolean).length}/{items.length}</div>
    <div className="glass card">{items.map((x, i) => <label className="check" key={x}><input type="checkbox" checked={!!done[i]} onChange={e => setDone({ ...done, [i]: e.target.checked })} />{x}</label>)}</div>
  </>)
}

function Crowd() {
  const { ghats, setCitizenView } = useApp()
  return (<>
    <div className="glass card stack">{ghats.map(g => (<div key={g.code}><div className="row between"><b>{g.name}</b><span className="tag" style={{ color: sev(g.pct) }}>{g.pct}% · {sevLabel(g.pct)}</span></div><div style={{ marginTop: 8 }}><Meter pct={g.pct} /></div></div>))}<div className="faint">Updated from CCTV density every 30 seconds.</div></div>
    <div className="sec">Bathe safely</div>
    <ol className="glass card steps">{['Follow the marshals', 'Stay in the shallow zone', 'Keep it short', 'Mind elders & children'].map(x => <li key={x}>{x}</li>)}</ol>
    <button className="btn danger block" onClick={() => setCitizenView('report')}><Siren size={18} /> Emergency — raise SOS</button>
  </>)
}

function Stay() {
  const { say } = useApp()
  const [f, setF] = useState('all')
  return (<>
    <div className="row">{['all', 'free', 'paid'].map(x => <button key={x} className={'chip' + (f === x ? ' on' : '')} onClick={() => setF(x)}>{x[0].toUpperCase() + x.slice(1)}</button>)}</div>
    {STAYS.filter(s => f === 'all' || s.kind === f).map(s => (
      <div className="glass card stack" key={s.id} style={{ gap: 10 }}>
        <div className="row between"><b>{s.name}</b><span className={'tag ' + (s.kind === 'free' ? 'ok' : 'info')}>{s.kind === 'free' ? 'Free' : s.price}</span></div>
        <div className="row between faint"><span>{s.free} beds free of {s.total}</span><span>{s.dist} · {s.walk}</span></div>
        <Meter pct={Math.round((s.free / s.total) * 100)} color="var(--ok)" />
        <div className="faint">Updated {s.ago} min ago · {s.by}</div>
        <div className="row"><button className="btn ghost sm grow" onClick={() => say('Walking route ready')}><MapPin size={15} /> Walk route</button><button className="btn ghost sm grow" onClick={() => say('Shared')}><Share2 size={15} /> Share</button></div>
      </div>))}
  </>)
}

function Food() {
  const { open, served } = useApp()
  return (<>{FOOD.map(f => (
    <div className="glass card stack" key={f.id} style={{ gap: 10 }}>
      <div className="row between"><b>{f.name}</b><span className={'tag ' + (open[f.id] === 'open' ? 'ok' : open[f.id] === 'soon' ? 'warn' : 'crit')}>{open[f.id] === 'open' ? 'Open now' : open[f.id] === 'soon' ? 'Opening soon' : 'Closed'}</span></div>
      <div className="row between faint"><span>Wait ~{f.wait}</span><span>{fmt(served[f.id])} served today</span></div>
      <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>{f.menu.map(m => <span className="tag" key={m}>{m}</span>)}</div>
    </div>))}</>)
}

function Water() {
  const { say } = useApp()
  return (<>
    <div className="glass card"><div className="kv"><span>Water ATM · 90 m</span><span className="tag ok">Working</span></div><div className="kv"><span>Toilet block · 40 units</span><span className="tag warn">Needs attention</span></div></div>
    <div className="note">Spot a dirty toilet or dry tap? Report it — a sevak is alerted to fix it.</div>
    <button className="btn primary" onClick={() => say('Sanitation alert sent to nearest sevak')}>Report a sanitation issue</button>
  </>)
}

function Park() {
  const { say } = useApp()
  const [mine, setMine] = useState('')
  return (<>
    <div className="note warn">Park outside, ride in — please don’t drive into the Mela.</div>
    <div className="sec">Live approach traffic</div>
    <div className="glass card">{ROADS.map(r => <div className="kv" key={r.n}><span>{r.n}</span><span className={'tag ' + (r.s === 'Heavy' ? 'crit' : r.s === 'Clear' ? 'ok' : 'warn')}>{r.s}</span></div>)}</div>
    {LOTS.map(l => (
      <div className="glass card stack" key={l.id} style={{ gap: 10 }}>
        <div className="row between"><b>{l.name}</b>{mine === l.id && <span className="tag acc">My lot</span>}</div>
        <div className="row between faint"><span>{fmt(l.free)} free of {fmt(l.total)}</span><span>{l.km} km · shuttle {l.shuttle}</span></div>
        <Meter pct={Math.round(100 - (l.free / l.total) * 100)} />
        <div className="row"><button className="btn ghost sm grow" onClick={() => say('Navigating…')}>Navigate</button><button className="btn ghost sm grow" onClick={() => { setMine(l.id); say('Saved as your parking lot') }}>This is my lot</button></div>
      </div>))}
  </>)
}

function Around() {
  const { say } = useApp()
  return (<div className="glass card">{[['e-Rickshaw stand', '120 m'], ['Shuttle bus stop', '200 m'], ['Satellite parking P4', '1.1 km'], ['Haridwar Railway Station', '2.4 km'], ['ISBT bus stand', '3.1 km']].map(([a, b]) => <div className="kv" key={a}><span>{a}</span><button className="chip" onClick={() => say('Route to ' + a)}>{b} →</button></div>)}</div>)
}

function Services() {
  const { say } = useApp()
  return (<div className="glass card">{SERVICES.map(([a, b]) => <div className="kv" key={a}><span>{a}</span><button className="chip" onClick={() => say('Route to ' + a)}>{b} · Route →</button></div>)}</div>)
}

function Snan() {
  const { say, mela } = useApp()
  return (<>
    <p className="muted">Royal bathing days · {mela.name}</p>
    <div className="glass card">{SNAN.map(s => (
      <div className="kv" key={s.n} style={{ alignItems: 'center' }}>
        <span><b style={{ color: 'var(--ink)' }}>{s.d}</b> · {s.n} {s.amrit && <span className="tag acc">Amrit Snan</span>}</span>
        <button className="chip" onClick={() => say('Reminder set for ' + s.d)}><Bell size={13} /> Remind</button>
      </div>))}</div>
  </>)
}

function Lost() {
  const { say, addReport } = useApp()
  const [f, setF] = useState({ n: '', l: '', w: '' })
  const [id, setId] = useState('')
  return (<>
    <p className="muted">Report or search a missing person · routed to the Kho-Khoya centre</p>
    <div className="glass card stack">
      <label className="f">Name & age<input className="inp" value={f.n} onChange={e => setF({ ...f, n: e.target.value })} /></label>
      <label className="f">Last seen (ghat / landmark)<input className="inp" value={f.l} onChange={e => setF({ ...f, l: e.target.value })} /></label>
      <label className="f">Wristband no. (if any)<input className="inp" value={f.w} onChange={e => setF({ ...f, w: e.target.value })} /></label>
      <button className="btn primary" onClick={() => { if (!f.n) return say('Please enter a name'); const r = addReport(`Lost person: ${f.n} — last seen ${f.l || 'unknown'}`); setId(r); say('Report submitted · ' + r) }}>Submit report</button>
      {id && <div className="note">Case ID <b className="mono">{id}</b> — use “Track a report” to follow progress.</div>}
    </div>
  </>)
}

function Health() {
  const { say } = useApp()
  return (<>
    <div className="glass card"><div className="kv"><span>Nearest camp</span><span>~250 m · 24×7</span></div><div className="kv"><span>Staff</span><span>doctor + 2 paramedics</span></div></div>
    <div className="row"><a className="btn danger grow" href="tel:108"><Phone size={18} /> Call 108</a><button className="btn ghost grow" onClick={() => say('Connecting to a doctor…')}><Stethoscope size={18} /> Teleconsult</button></div>
    <div className="sec">Quick symptom help</div>
    {[['Breathlessness / chest pain', 'Sit upright, loosen clothing, call 108 immediately.'], ['Fainting / heat stroke', 'Move to shade, lay flat, raise legs, sip water if awake.'], ['Injury / fall', 'Do not move the person if the neck/back is hurt. Call 108.'], ['Fever', 'Rest, hydrate, visit the nearest health camp.']].map(([a, b]) => <details className="glass card" key={a}><summary style={{ fontWeight: 600, cursor: 'pointer' }}>{a}</summary><p className="muted" style={{ marginTop: 8, fontSize: 14 }}>{b}</p></details>)}
  </>)
}

function Access() {
  const { say } = useApp()
  return (<>
    <p className="muted">Divyang & senior support</p>
    {['Wheelchair to the ghat', 'Volunteer escort', 'Priority bathing lane', 'e-Rickshaw pickup'].map(x => <button key={x} className="glass card row between" onClick={() => say(x + ' requested — a sevak is on the way')}><b>{x}</b><span className="tag acc">Request</span></button>)}
    <div className="note">Audio-first — Sahayak reads every screen aloud and takes voice answers.</div>
  </>)
}

function Donate() {
  const { say } = useApp()
  return (<>{[['Sponsor meals · Annadaan', '₹60 feeds one pilgrim'], ['Support a bhandara', 'Stock a community kitchen'], ['Register as a Sevak', 'Volunteer at a post'], ['Swachh Kumbh clean drive', 'Join a sanitation team']].map(([a, b]) => <div key={a} className="glass card row between"><div><b>{a}</b><div className="faint">{b}</div></div><button className="btn primary sm" onClick={() => say('Thank you 🙏 (demo — no payment)')}>Contribute</button></div>)}</>)
}

function Community() {
  const { reports, addReport, say } = useApp()
  const [txt, setTxt] = useState('')
  return (<>
    <div className="note">Pilgrim-submitted and shown as unverified. Only a registered sevak can confirm them.</div>
    <div className="glass card row"><input className="inp" placeholder="Share an update…" value={txt} onChange={e => setTxt(e.target.value)} /><button className="btn primary sm" onClick={() => { if (!txt.trim()) return; addReport(txt.trim()); setTxt(''); say('Posted as unverified') }}><Megaphone size={16} /> Post</button></div>
    {reports.map(r => <div key={r.id} className="glass card stack" style={{ gap: 6 }}><div className="row between"><span className="mono faint">{r.id}</span><span className={'tag ' + (r.verified ? 'ok' : 'warn')}>{r.verified ? 'Verified' : 'Unverified'}</span></div><div>{r.text}</div><div className="faint">{r.ago}</div></div>)}
  </>)
}

function Report() {
  const { say, addReport } = useApp()
  const [kind, setKind] = useState('')
  const [id, setId] = useState('')
  return (<>
    <button className="btn danger block" style={{ minHeight: 64, fontSize: 17 }} onClick={() => { const r = addReport('SOS raised at Har Ki Pauri'); setId(r); say('SOS sent — help is on the way') }}><Siren size={24} /> SOS — I need urgent help</button>
    {id && <div className="note crit">SOS <b className="mono">{id}</b> received. Stay where you are — nearest sevak and control post notified.</div>}
    <div className="sec">Or report an issue</div>
    <div className="row" style={{ flexWrap: 'wrap' }}>{['Overcrowding / unsafe surge', 'Cleanliness / sanitation', 'Lost item', 'Misconduct / overcharging', 'Other'].map(x => <button key={x} className={'chip' + (kind === x ? ' on' : '')} onClick={() => setKind(x)}>{x}</button>)}</div>
    <button className="btn primary" onClick={() => { if (!kind) return say('Pick an issue type'); const r = addReport(kind); setId(r); say('Report submitted · ' + r) }}>Submit report</button>
  </>)
}

function Track() {
  const { reports } = useApp()
  const [q, setQ] = useState('')
  const hit = reports.find(r => r.id.toLowerCase() === q.trim().toLowerCase())
  return (<>
    <label className="f">Enter your report / case ID<div className="row"><input className="inp" placeholder="PR-4485" value={q} onChange={e => setQ(e.target.value)} /></div></label>
    {q && (hit ? <div className="glass card stack"><div className="row between"><b className="mono">{hit.id}</b><span className="tag info">In progress</span></div><div>{hit.text}</div><ol className="steps"><li>Received</li><li>Assigned to nearest sevak</li><li>On the way</li></ol></div> : <div className="note warn">No report found for “{q}”. Try PR-4485.</div>)}
  </>)
}

function Sahayak() {
  const [msgs, setMsgs] = useState<{ me?: boolean; t: string }[]>([{ t: 'Namaste 🙏 — I’m Sahayak. Ask me about your ghat, snan dates, a lost person, medical help or anything else.' }])
  const [rec, setRec] = useState(false)
  const [txt, setTxt] = useState('')
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs])
  const ask = (q: string) => { setMsgs(m => [...m, { me: true, t: q }]); setTimeout(() => setMsgs(m => [...m, { t: CHAT_QA[q] ?? 'I’ve noted that. In the live system I’d check the latest field data — for now, try one of the suggestions below.' }]), 650) }
  return (<>
    <div className="glass card chat" style={{ minHeight: 240 }}>{msgs.map((m, i) => <div key={i} className={'bub ' + (m.me ? 'me' : 'bot')}>{m.t}</div>)}<div ref={end} /></div>
    <div className="row" style={{ flexWrap: 'wrap' }}>{Object.keys(CHAT_QA).map(q => <button key={q} className="chip" onClick={() => ask(q)}>{q}</button>)}</div>
    <div className="row"><input className="inp" placeholder="Type a question…" value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && txt.trim()) { ask(txt.trim()); setTxt('') } }} /><button className="iconbtn" aria-label="Send" onClick={() => { if (txt.trim()) { ask(txt.trim()); setTxt('') } }}><Send size={18} /></button></div>
    <button className={'mic' + (rec ? ' rec' : '')} onPointerDown={() => setRec(true)} onPointerUp={() => { setRec(false); ask('Where is my ghat?') }} onPointerLeave={() => setRec(false)}>
      {rec ? <span className="wave"><i /><i /><i /><i /><i /></span> : <Mic size={22} />}{rec ? 'Listening…' : 'Hold to speak — English, Hindi, Punjabi'}
    </button>
  </>)
}

