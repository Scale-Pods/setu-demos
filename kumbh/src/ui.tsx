import { ArrowLeft, Lock, Moon, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { MELAS, type Lang } from './data'
import { useApp } from './store'

export const sev = (p: number) => (p >= 85 ? 'var(--crit)' : p >= 60 ? 'var(--warn)' : 'var(--ok)')
export const sevLabel = (p: number) => (p >= 85 ? 'Very high' : p >= 60 ? 'High' : 'Moderate')
export const fmt = (n: number) => n.toLocaleString('en-IN')

export function Backdrop() {
  return (<><div className="aurora"><i /><i /><i /></div><div className="grain" /></>)
}

export function Meter({ pct, color }: { pct: number; color?: string }) {
  return <div className="meter" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: pct + '%', background: color ?? sev(pct) }} /></div>
}

export function Ring({ pct }: { pct: number }) {
  return <div className="ring" style={{ ['--p' as string]: pct, ['--c' as string]: sev(pct) }}><b>{pct}%</b></div>
}

export function Toast() {
  const { toast } = useApp()
  return <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">{toast}</div>
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M4 20c5-9 19-9 24 0" stroke="#1a0d05" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 26c4-5 16-5 20 0" stroke="#1a0d05" strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
      <circle cx="16" cy="9" r="3.2" fill="#1a0d05" />
    </svg>
  )
}

const LANGS: [Lang, string][] = [['en', 'EN'], ['hi', 'हिं'], ['pa', 'ਪੰ']]

export function AppBar({ title, sub, back, children }: { title: string; sub?: string; back?: () => void; children?: ReactNode }) {
  const { go, lang, setLang, theme, toggleTheme } = useApp()
  return (
    <header className="appbar">
      <div className="in">
        <button className="iconbtn" aria-label="Back" onClick={back ?? (() => go('home'))}><ArrowLeft size={20} /></button>
        <div className="grow"><h1>{title}</h1>{sub && <small>{sub}</small>}</div>
        {children}
        <div className="seg" role="group" aria-label="Language">
          {LANGS.map(([k, l]) => <button key={k} className={lang === k ? 'on' : ''} onClick={() => setLang(k)} aria-pressed={lang === k}>{l}</button>)}
        </div>
        <button className="iconbtn" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
        <button className="iconbtn" aria-label="Staff sign-in" onClick={() => go('volunteer')}><Lock size={18} /></button>
      </div>
    </header>
  )
}

export function MelaZone() {
  const { mela, setMela, zone, setZone } = useApp()
  return (
    <div className="row" style={{ flexWrap: 'wrap' }}>
      <select className="sel" style={{ width: 'auto', minHeight: 38 }} aria-label="Mela" value={mela.id} onChange={e => setMela(e.target.value)}>
        {MELAS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <select className="sel" style={{ width: 'auto', minHeight: 38 }} aria-label="Zone" value={zone} onChange={e => setZone(e.target.value)}>
        {mela.zones.map(z => <option key={z}>{z}</option>)}
      </select>
    </div>
  )
}

/* ---------- charts (inline SVG) ---------- */
export function BarChart({ data }: { data: [string, number][] }) {
  const max = Math.max(...data.map(d => d[1]))
  return (
    <div className="stack" style={{ gap: 9 }}>
      {data.map(([k, v]) => (
        <div key={k} className="row" style={{ gap: 10 }}>
          <span style={{ width: 92, fontSize: 13 }} className="muted">{k}</span>
          <div className="grow meter"><i style={{ width: (v / max) * 100 + '%', background: 'linear-gradient(90deg,var(--accent),var(--accent-2))' }} /></div>
          <b className="mono" style={{ width: 30, textAlign: 'right', fontSize: 13 }}>{v}</b>
        </div>
      ))}
    </div>
  )
}

export function AreaChart({ data }: { data: { h: string; density: number; wait: number }[] }) {
  const W = 480, H = 170, p = 22
  const x = (i: number) => p + (i * (W - p * 2)) / (data.length - 1)
  const y = (v: number) => H - p - (v / 100) * (H - p * 2)
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.density)}`).join(' ')
  const peak = data.reduce((a, b, i) => (b.density > data[a].density ? i : a), 0)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Crowd density by hour">
      <defs><linearGradient id="ar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".5" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
      {[0, 50, 100].map(v => <line key={v} x1={p} x2={W - p} y1={y(v)} y2={y(v)} stroke="var(--glass-bd)" strokeDasharray="3 5" />)}
      <path d={`${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#ar)" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(peak)} cy={y(data[peak].density)} r="6" fill="var(--crit)" stroke="var(--bg)" strokeWidth="3" />
      {data.map((d, i) => i % 2 === 0 && <text key={d.h} x={x(i)} y={H - 4} textAnchor="middle" fontSize="10.5" fill="var(--ink-faint)">{d.h}</text>)}
    </svg>
  )
}

export function Funnel() {
  const rows: [string, number, number][] = [['Reported', 212, 100], ['Matched', 191, 90], ['Reunited', 178, 84]]
  return (
    <div className="stack" style={{ gap: 8 }}>
      {rows.map(([k, v, w], i) => (
        <div key={k} style={{ width: w + '%', padding: '10px 14px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', background: `color-mix(in srgb, var(--accent) ${55 - i * 14}%, transparent)`, fontWeight: 600, fontSize: 14 }}>
          <span>{k}</span><span className="mono">{v}</span>
        </div>
      ))}
      <div className="faint">~92% reunited within the hour</div>
    </div>
  )
}

export function MiniMap({ route = true }: { route?: boolean }) {
  return (
    <div className="map" aria-hidden>
      <svg viewBox="0 0 300 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <path d="M-10 110 C60 70 120 130 200 90 S300 60 320 80 L320 160 L-10 160Z" fill="color-mix(in srgb, var(--info) 22%, transparent)" />
        <path d="M-10 120 C60 85 120 140 200 100 S300 72 320 92" fill="none" stroke="color-mix(in srgb, var(--info) 55%, transparent)" strokeWidth="2" />
        {[40, 90, 150, 210, 260].map(x => <line key={x} x1={x} x2={x + 10} y1="0" y2="70" stroke="var(--glass-bd)" />)}
        {route && <path className="route-path" d="M30 40 C80 50 110 20 160 46 S230 60 260 36" fill="none" stroke="var(--accent)" strokeWidth="3.4" strokeLinecap="round" />}
        <circle cx="30" cy="40" r="6" fill="var(--info)" stroke="#fff" strokeWidth="2" />
        <circle cx="260" cy="36" r="7" fill="var(--accent)" stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  )
}
