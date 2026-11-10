import { BellRing, Copy, Download, Navigation, Plus, Radar, Smartphone, Trash2, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useApp } from './store'
import { Meter, sev, sevLabel } from './ui'

const safe = <V,>(fn: () => V, d: V): V => { try { return fn() } catch { return d } }
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

/* =========================================================
   1. Group tracking
   ========================================================= */
interface Member { id: number; name: string; x: number; y: number; wander: boolean; ago: number }
interface Saved { code: string; names: string[] }
const GKEY = 'kumbh-group'
const readGroup = (): Saved | null => safe(() => JSON.parse(localStorage.getItem(GKEY) ?? 'null') as Saved | null, null)
const M_PER_UNIT = 7 // map units → metres (demo scale)
const SEP = 250 // metres: separation alert threshold
const NEAR = 110

const seedMembers = (names: string[]): Member[] =>
  names.map((name, i) => {
    const a = (i / Math.max(1, names.length)) * Math.PI * 2 + 0.6
    const r = 8 + (i % 3) * 5
    return { id: i, name, x: 50 + Math.cos(a) * r, y: 30 + Math.sin(a) * r * 0.6, wander: i === names.length - 1 && names.length > 1, ago: 0 }
  })

export function Group() {
  const { say, addReport, mela } = useApp()
  const [saved, setSaved] = useState<Saved | null>(readGroup)
  const [draft, setDraft] = useState('')
  const [names, setNames] = useState<string[]>(['Mummy', 'Papa', 'Rohan (8)'])
  const [members, setMembers] = useState<Member[]>(() => (saved ? seedMembers(saved.names) : []))
  const [reported, setReported] = useState<Record<number, string>>({})
  const alerted = useRef<Record<number, boolean>>({})

  // live positions: members drift; the 'wanderer' slowly walks away to demonstrate a separation alert
  useEffect(() => {
    if (!saved) return
    const id = setInterval(() => {
      setMembers(ms => ms.map(m => {
        const dx = m.x - 50, dy = m.y - 30
        const d = Math.hypot(dx, dy) || 1
        let nx: number, ny: number
        if (m.wander) { // the wanderer walks steadily sideways (the map is widest horizontally)
          nx = clamp(m.x + 1.5 + (Math.random() - 0.5) * 1.2, 4, 96)
          ny = clamp(m.y + (30 - m.y) * 0.06 + (Math.random() - 0.5) * 1.2, 4, 56)
        } else { // others loiter around you, drifting back if they stray beyond ~14 units
          const pull = d > 14 ? -0.7 : 0
          nx = clamp(m.x + (dx / d) * pull + (Math.random() - 0.5) * 1.8, 4, 96)
          ny = clamp(m.y + (dy / d) * pull + (Math.random() - 0.5) * 1.4, 4, 56)
        }
        return { ...m, x: nx, y: ny, ago: m.wander && d * M_PER_UNIT > SEP ? m.ago + 1 : 0 }
      }))
    }, 1200)
    return () => clearInterval(id)
  }, [saved])

  const dist = (m: Member) => Math.round(Math.hypot(m.x - 50, m.y - 30) * M_PER_UNIT)
  const status = (m: Member) => { const d = dist(m); return d >= SEP ? { l: 'Separated', c: 'var(--crit)' } : d >= NEAR ? { l: 'Nearby', c: 'var(--warn)' } : { l: 'With you', c: 'var(--ok)' } }
  const separated = members.filter(m => dist(m) >= SEP)

  useEffect(() => {
    separated.forEach(m => { if (!alerted.current[m.id]) { alerted.current[m.id] = true; say(`⚠️ ${m.name.split(' ')[0]} is ${dist(m)} m away`) } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [separated.length])

  const create = () => {
    const clean = names.map(n => n.trim()).filter(Boolean)
    if (!clean.length) return say('Add at least one family member')
    const g: Saved = { code: 'KM-' + Math.floor(1000 + Math.random() * 9000), names: clean }
    safe(() => localStorage.setItem(GKEY, JSON.stringify(g)), undefined)
    setSaved(g); setMembers(seedMembers(clean)); alerted.current = {}; setReported({})
    say('Group created · ' + g.code)
  }
  const leave = () => { safe(() => localStorage.removeItem(GKEY), undefined); setSaved(null); setMembers([]); setReported({}) }
  const copy = async () => { try { await navigator.clipboard.writeText(saved!.code); say('✓ Group code copied — share it with your family') } catch { say('Could not copy — long-press the code') } }
  const markLost = (m: Member) => {
    const r = addReport(`Lost person (group ${saved!.code}): ${m.name} — last seen near ${mela.ghat}, ${dist(m)} m from the group`)
    setReported(x => ({ ...x, [m.id]: r })); say('Lost-person alert sent · ' + r)
  }
  const addName = () => { const n = draft.trim(); if (!n) return; if (names.length >= 8) return say('Up to 8 members'); setNames([...names, n]); setDraft('') }

  if (!saved) return (<>
    <p className="muted">Link your family before you reach the ghat. If someone drifts away, everyone gets an alert and you can raise a lost-person report in one tap.</p>
    <div className="glass card stack">
      <b>Who is in your group?</b>
      <div className="row" style={{ flexWrap: 'wrap' }}>{names.map((n, i) => <span key={n + i} className="chip">{n}<button aria-label={'Remove ' + n} onClick={() => setNames(names.filter((_, j) => j !== i))} style={{ display: 'grid' }}><Trash2 size={13} /></button></span>)}</div>
      <div className="row"><input className="inp" placeholder="Add a name (e.g. Dadi)" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && addName()} /><button className="iconbtn" aria-label="Add member" onClick={addName}><Plus size={18} /></button></div>
      <button className="btn primary" onClick={create}><Radar size={18} /> Create group & start tracking</button>
    </div>
    <div className="note">Demo: positions are simulated. In production members join with the group code, with location shared only with their consent.</div>
  </>)

  return (<>
    <div className="glass card row between"><div><div className="faint">Group code</div><b className="mono" style={{ fontSize: 22 }}>{saved.code}</b></div><button className="btn ghost sm" onClick={copy}><Copy size={16} /> Copy</button></div>
    {separated.map(m => (
      <div key={m.id} className="alert crit" role="alert"><BellRing size={18} style={{ flex: 'none', marginTop: 2 }} /><div className="grow"><b>{m.name} is {dist(m)} m away</b> — beyond the safe range. Try pinging first; if you cannot reach them, raise a lost-person alert.
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn ghost sm" onClick={() => say(`Ping sent to ${m.name}`)}>Ping</button>
          {reported[m.id] ? <span className="tag ok">Reported · {reported[m.id]}</span> : <button className="btn danger sm" onClick={() => markLost(m)}>Report as lost</button>}
        </div></div></div>
    ))}
    <div className="gmap" role="img" aria-label="Live positions of your group members">
      <svg viewBox="0 0 100 60" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <rect width="100" height="60" fill="color-mix(in srgb, var(--info) 8%, transparent)" />
        <path d="M0 44 C20 36 36 50 58 42 S90 34 100 38 V60 H0Z" fill="color-mix(in srgb, var(--info) 22%, transparent)" />
        <circle cx="50" cy="30" r={NEAR / M_PER_UNIT} fill="none" stroke="var(--ok)" strokeOpacity=".5" strokeDasharray="1.5 2" strokeWidth=".5" />
        <circle cx="50" cy="30" r={SEP / M_PER_UNIT} fill="none" stroke="var(--crit)" strokeOpacity=".45" strokeDasharray="1.5 2" strokeWidth=".5" />
        {members.map(m => { const s = status(m); return <g key={m.id} style={{ transition: 'transform 1.1s linear' }} transform={`translate(${m.x} ${m.y})`}>
          <circle r="3.6" fill={s.c} stroke="#fff" strokeWidth=".7" /><text y="1.3" textAnchor="middle" fontSize="3.4" fontWeight="700" fill="#10101c">{m.name[0]}</text></g> })}
        <circle cx="50" cy="30" r="3.2" fill="var(--accent)" stroke="#fff" strokeWidth=".8"><animate attributeName="r" values="3;4.4;3" dur="2s" repeatCount="indefinite" /></circle>
        <text x="50" y="37" textAnchor="middle" fontSize="3" fill="var(--ink)" fontWeight="700">You</text>
      </svg>
    </div>
    <div className="faint">Dashed rings: green ≈ {NEAR} m · red ≈ {SEP} m. Updates every second (simulated).</div>
    <div className="glass card">{members.map(m => { const s = status(m); return <div className="kv" key={m.id} style={{ alignItems: 'center' }}><span style={{ color: 'var(--ink)' }}>{m.name}</span><span className="row" style={{ gap: 8 }}><span className="mono faint">{dist(m)} m</span><span className="tag" style={{ color: s.c }}>{s.l}</span></span></div> })}</div>
    <div className="note">Meeting point if you get separated: <b>Help Desk, {mela.ghat}</b>. Stay where you are and let the marshals help.</div>
    <button className="btn ghost" onClick={leave}>Leave / reset group</button>
  </>)
}

/* =========================================================
   2. Crowd-aware route
   ========================================================= */
export function CrowdRoute() {
  const { mela, zone, ghats, say } = useApp()
  const [calm, setCalm] = useState(true)
  const hkp = ghats[0], sub = ghats[1], kush = ghats[2]
  const directEta = 12 + Math.round(((hkp.pct + sub.pct) / 200) * 16)
  const calmEta = 17 + Math.round((kush.pct / 100) * 4)
  const calmBetter = calmEta <= directEta + 4
  const heat = (cx: number, cy: number, pct: number, key: string) => (
    <g key={key}>
      <circle cx={cx} cy={cy} r={14 + pct * 0.28} fill={sev(pct)} opacity=".16" />
      <circle cx={cx} cy={cy} r={8 + pct * 0.12} fill={sev(pct)} opacity=".34" />
      <circle cx={cx} cy={cy} r="3.4" fill={sev(pct)} stroke="#fff" strokeWidth="1.4" />
    </g>
  )
  const P_DIRECT = 'M30 160 C 90 150 125 112 140 88 S 200 62 226 46'
  const P_CALM = 'M30 160 C 36 122 48 94 70 78 S 130 36 190 26 S 214 34 226 46'
  const active = calm && calmBetter ? 'calm' : 'direct'
  return (<>
    <div className="gmap" style={{ height: 210 }} role="img" aria-label="Crowd heatmap with suggested route">
      <svg viewBox="0 0 300 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="190" fill="color-mix(in srgb, var(--info) 7%, transparent)" />
        <path d="M-10 150 C 60 120 120 175 200 130 S 300 100 320 118 L320 200 L-10 200Z" fill="color-mix(in srgb, var(--info) 20%, transparent)" />
        {heat(226, 46, hkp.pct, 'h')}{heat(140, 88, sub.pct, 's')}{heat(70, 78, kush.pct, 'k')}
        <path d={P_DIRECT} fill="none" stroke={active === 'direct' ? 'var(--accent)' : 'var(--ink-faint)'} strokeWidth={active === 'direct' ? 4 : 2.2} strokeLinecap="round" className={active === 'direct' ? 'route-path' : ''} opacity={active === 'direct' ? 1 : .5} />
        <path d={P_CALM} fill="none" stroke={active === 'calm' ? 'var(--ok)' : 'var(--ink-faint)'} strokeWidth={active === 'calm' ? 4 : 2.2} strokeLinecap="round" className={active === 'calm' ? 'route-path' : ''} opacity={active === 'calm' ? 1 : .5} />
        <circle cx="30" cy="160" r="6" fill="var(--info)" stroke="#fff" strokeWidth="2" /><text x="40" y="178" fontSize="10" fill="var(--ink)" fontWeight="700">You</text>
        <text x="226" y="22" textAnchor="middle" fontSize="9.5" fill="var(--ink)" fontWeight="700">{mela.ghat.split(' (')[0]}</text>
        <text x="140" y="116" textAnchor="middle" fontSize="8.5" fill="var(--ink-soft)">Subhash Ghat</text>
        <text x="70" y="106" textAnchor="middle" fontSize="8.5" fill="var(--ink-soft)">Kushavart</text>
      </svg>
    </div>
    <div className="row" style={{ flexWrap: 'wrap', gap: 14, fontSize: 12 }} aria-label="Legend">
      {[['var(--ok)', 'Moderate'], ['var(--warn)', 'High'], ['var(--crit)', 'Very high']].map(([c, l]) => <span key={l} className="row" style={{ gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 99, background: c, display: 'inline-block' }} />{l}</span>)}
      <span className="faint">Live heat · updates every few seconds</span>
    </div>
    <div className="row"><button className={'chip' + (calm ? ' on' : '')} aria-pressed={calm} onClick={() => setCalm(true)}>Avoid crowds</button><button className={'chip' + (!calm ? ' on' : '')} aria-pressed={!calm} onClick={() => setCalm(false)}>Fastest</button></div>
    {hkp.pct >= 85 && calm && calmBetter && <div className="alert warn"><BellRing size={18} style={{ flex: 'none', marginTop: 2 }} /><div><b>Rerouted:</b> {mela.ghat.split(' (')[0]} is at {hkp.pct}% ({sevLabel(hkp.pct)}). Taking the side approach via Kushavart — {directEta - calmEta > 0 ? `${directEta - calmEta} min faster` : 'a few minutes longer but far calmer'}.</div></div>}
    <div className="glass card">
      <div className="kv" style={{ alignItems: 'center' }}><span style={{ color: 'var(--ink)' }}>Calm route · via Kushavart</span><span className="row" style={{ gap: 8 }}><span className="mono">{calmEta} min</span><span className="tag" style={{ color: sev(kush.pct) }}>{sevLabel(kush.pct)}</span></span></div>
      <div className="kv" style={{ alignItems: 'center' }}><span style={{ color: 'var(--ink)' }}>Direct route · via Subhash Ghat</span><span className="row" style={{ gap: 8 }}><span className="mono">{directEta} min</span><span className="tag" style={{ color: sev((hkp.pct + sub.pct) / 2) }}>{sevLabel((hkp.pct + sub.pct) / 2)}</span></span></div>
      <div className="kv"><span>Destination</span><span>{mela.ghat} · {zone}</span></div>
      <div className="kv"><span>Crowd at destination</span><span style={{ color: sev(hkp.pct) }}>{hkp.pct}% · {sevLabel(hkp.pct)}</span></div>
      <div className="kv"><span>Calmer window</span><span>after 10:30 AM</span></div>
    </div>
    <Meter pct={hkp.pct} />
    <button className="btn primary block" onClick={() => say(active === 'calm' ? 'Navigation started · calm route' : 'Navigation started · direct route')}><Navigation size={18} /> Start navigation</button>
  </>)
}

/* =========================================================
   3. Offline pack + install
   ========================================================= */
export function useOnline() {
  const [on, setOn] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  useEffect(() => {
    const u = () => setOn(true), d = () => setOn(false)
    addEventListener('online', u); addEventListener('offline', d)
    return () => { removeEventListener('online', u); removeEventListener('offline', d) }
  }, [])
  return on
}

export function OfflineBanner() {
  const on = useOnline()
  if (on) return null
  return <div className="offbanner" role="status"><WifiOff size={15} /> You’re offline — showing saved information</div>
}

interface InstallEvt extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
let deferred: InstallEvt | null = null
if (typeof window !== 'undefined') addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e as InstallEvt })

const OKEY = 'kumbh-offline'
interface Pack { at: string; mela: string; zone: string; ghats: { name: string; pct: number }[]; group: string | null }

export function Offline() {
  const { mela, zone, ghats, say } = useApp()
  const online = useOnline()
  const [pack, setPack] = useState<Pack | null>(() => safe(() => JSON.parse(localStorage.getItem(OKEY) ?? 'null') as Pack | null, null))
  const [canInstall, setCanInstall] = useState(!!deferred)
  const standalone = typeof matchMedia !== 'undefined' && matchMedia('(display-mode: standalone)').matches
  const swReady = typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller
  useEffect(() => { const f = () => setCanInstall(!!deferred); addEventListener('beforeinstallprompt', f); return () => removeEventListener('beforeinstallprompt', f) }, [])

  const save = () => {
    const g = readGroup()
    const p: Pack = { at: new Date().toLocaleString(), mela: mela.name, zone, ghats: ghats.map(x => ({ name: x.name, pct: x.pct })), group: g?.code ?? null }
    safe(() => localStorage.setItem(OKEY, JSON.stringify(p)), undefined)
    setPack(p); say('✓ Offline pack saved')
    safe(() => { void fetch('/', { cache: 'reload' }) }, undefined) // let the service worker refresh the cached shell
  }
  const install = async () => { if (!deferred) return; await deferred.prompt(); deferred = null; setCanInstall(false) }

  return (<>
    <p className="muted">Mela networks get crowded. Save the essentials now and they stay available with no signal.</p>
    <div className="glass card">
      <div className="kv" style={{ alignItems: 'center' }}><span>Connection</span><span className="tag" style={{ color: online ? 'var(--ok)' : 'var(--warn)' }}>{online ? 'Online' : 'Offline'}</span></div>
      <div className="kv" style={{ alignItems: 'center' }}><span>App available offline</span><span className="tag" style={{ color: swReady ? 'var(--ok)' : 'var(--ink-faint)' }}>{swReady ? 'Ready' : 'Deployed app only'}</span></div>
      <div className="kv" style={{ alignItems: 'center' }}><span>Installed on this phone</span><span className="tag">{standalone ? 'Yes' : 'Not yet'}</span></div>
      <div className="kv"><span>Offline pack</span><span>{pack ? `Saved ${pack.at}` : 'Not saved'}</span></div>
    </div>
    <button className="btn primary" onClick={save}><Download size={18} /> {pack ? 'Update offline pack' : 'Save offline pack'}</button>
    {!standalone && (canInstall
      ? <button className="btn ghost" onClick={install}><Smartphone size={18} /> Install Kumbh Mitra on this phone</button>
      : <div className="note">To install: on Android Chrome tap ⋮ → <b>Install app</b>; on iPhone Safari tap Share → <b>Add to Home Screen</b>.</div>)}
    <div className="sec">Always available offline</div>
    <div className="glass card">
      <div className="kv" style={{ alignItems: 'center' }}><span style={{ color: 'var(--ink)' }}>Emergency</span><a className="chip" href="tel:112">Call 112</a></div>
      <div className="kv" style={{ alignItems: 'center' }}><span style={{ color: 'var(--ink)' }}>Ambulance</span><a className="chip" href="tel:108">Call 108</a></div>
      <div className="kv"><span style={{ color: 'var(--ink)' }}>If separated</span><span>Go to the nearest Help Desk · {mela.ghat}</span></div>
      {pack?.group && <div className="kv"><span style={{ color: 'var(--ink)' }}>Your group code</span><b className="mono">{pack.group}</b></div>}
    </div>
    {pack && <>
      <div className="sec">Last saved crowd levels · {pack.zone}</div>
      <div className="glass card stack">{pack.ghats.map(g => <div key={g.name}><div className="row between"><span>{g.name.split(' (')[0]}</span><span className="tag" style={{ color: sev(g.pct) }}>{g.pct}%</span></div><div style={{ marginTop: 6 }}><Meter pct={g.pct} /></div></div>)}<div className="faint">Snapshot from {pack.at}. Live levels return when you’re back online.</div></div>
    </>}
  </>)
}
