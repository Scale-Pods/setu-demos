import { ArrowLeft, Lock, Moon, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { CONFIG, LANG_LABEL } from './data'
import { useApp } from './store'
import { niceStep } from './utils'

export const Backdrop = () => (<><div className="aurora"><i /><i /><i /></div><div className="grain" /></>)
export function Toast() { const { toast } = useApp(); return <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">{toast}</div> }
export function Meter({ pct, color }: { pct: number; color?: string }) { return <div className="meter" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: Math.min(100, pct) + '%', background: color ?? 'linear-gradient(90deg,var(--accent),var(--accent-2))' }} /></div> }
export function Seal({ size = 36 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden><circle cx="16" cy="16" r="11" stroke="#1a0d05" strokeWidth="2.4" /><path d="M10.5 16.5l4 4 7.5-8.5" stroke="#1a0d05" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>)
}
export function StateSelects() {
  const { st, ac, cfg, setState, setAc } = useApp()
  return (<div className="row" style={{ flexWrap: 'wrap' }}>
    <select className="sel" style={{ width: 'auto', minHeight: 38 }} aria-label="State" value={st} onChange={e => setState(e.target.value)}>{Object.entries(CONFIG).map(([k, c]) => <option key={k} value={k}>{c.name}</option>)}</select>
    <select className="sel" style={{ width: 'auto', minHeight: 38 }} aria-label="Constituency" value={ac} onChange={e => setAc(e.target.value)}>{Object.entries(cfg.acs).map(([k, a]) => <option key={k} value={k}>{a.name}</option>)}</select>
  </div>)
}
export function AppBar({ title, sub, back, children }: { title: string; sub?: string; back?: () => void; children?: ReactNode }) {
  const { go, lang, setLang, cfg, theme, toggleTheme } = useApp()
  return (<header className="appbar"><div className="in">
    <button className="iconbtn" aria-label="Back" onClick={back ?? (() => go('scan'))}><ArrowLeft size={20} className="flip" /></button>
    <div className="grow"><h1>{title}</h1>{sub && <small>{sub}</small>}</div>
    {children}
    <div className="seg" role="group" aria-label="Language">{cfg.langs.map(l => <button key={l} className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>{LANG_LABEL[l]}</button>)}</div>
    <button className="iconbtn" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
    <button className="iconbtn" aria-label="Staff sign-in" onClick={() => go('home')}><Lock size={18} /></button>
  </div></header>)
}
export function Timeline({ items }: { items: [string, string, boolean][] }) {
  return <div className="tl">{items.map(([a, b, d]) => <div key={a} className={d ? 'done' : ''}><i /><div><b>{a}</b><small>{b}</small></div></div>)}</div>
}

export function BarChart({ data }: { data: [string, number][] }) {
  const max = Math.max(...data.map(d => d[1]))
  return (<div className="stack" style={{ gap: 9 }}>{data.map(([k, v]) => (
    <div key={k} className="row"><span style={{ width: 96, fontSize: 13 }} className="muted">{k}</span><div className="grow"><Meter pct={(v / max) * 100} /></div><b className="mono" style={{ width: 34, textAlign: 'right', fontSize: 13 }}>{v}</b></div>))}</div>)
}
export function DualChart({ turnout, wait }: { turnout: number[]; wait: number[] }) {
  const W = 480, H = 190, p = 26, hrs = ['7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6']
  const x = (i: number) => p + (i * (W - p * 2)) / (turnout.length - 1)
  const yT = (v: number) => H - p - (v / 100) * (H - p * 2)
  const mw = Math.max(...wait, 30); const yW = (v: number) => H - p - (v / mw) * (H - p * 2)
  const tl = turnout.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${yT(v)}`).join(' ')
  const wl = wait.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${yW(v)}`).join(' ')
  const mi = wait.indexOf(Math.max(...wait)); void niceStep
  return (<svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Turnout and queue wait by hour">
    <defs><linearGradient id="tg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--info)" stopOpacity=".4" /><stop offset="1" stopColor="var(--info)" stopOpacity="0" /></linearGradient></defs>
    {[0, 50, 100].map(v => <line key={v} x1={p} x2={W - p} y1={yT(v)} y2={yT(v)} stroke="var(--glass-bd)" strokeDasharray="3 5" />)}
    <path d={`${tl} L${x(11)},${yT(0)} L${x(0)},${yT(0)}Z`} fill="url(#tg)" /><path d={tl} fill="none" stroke="var(--info)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d={wl} fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeDasharray="6 5" strokeLinecap="round" />
    <circle cx={x(mi)} cy={yW(wait[mi])} r="5.5" fill="var(--crit)" stroke="var(--bg)" strokeWidth="2.5" /><text x={x(mi) + 9} y={yW(wait[mi]) - 6} fontSize="11" fill="var(--ink)" fontWeight="700">{wait[mi]}m</text>
    {hrs.map((h, i) => <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10.5" fill="var(--ink-faint)">{h}</text>)}
  </svg>)
}
export function MapSVG() {
  return (<div className="map" aria-hidden><svg viewBox="0 0 300 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="140" fill="color-mix(in srgb, var(--info) 8%, transparent)" />
    {[[20, 20, 60, 36], [110, 18, 70, 44], [210, 24, 64, 38], [30, 84, 80, 40], [150, 86, 58, 36]].map(([a, b, c, d], i) => <rect key={i} x={a} y={b} width={c} height={d} rx="6" fill="var(--glass-2)" />)}
    <path d="M0 70 H300 M95 0 V140 M195 0 V140" stroke="var(--glass-bd)" strokeWidth="6" fill="none" />
    <circle cx="150" cy="70" r="10" fill="var(--accent)" opacity=".35"><animate attributeName="r" values="8;22;8" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values=".5;0;.5" dur="2s" repeatCount="indefinite" /></circle>
    <path d="M150 82 c-8-10-12-16-12-22a12 12 0 0124 0c0 6-4 12-12 22z" fill="var(--accent)" stroke="#fff" strokeWidth="2" /><circle cx="150" cy="60" r="4" fill="#fff" />
  </svg></div>)
}
