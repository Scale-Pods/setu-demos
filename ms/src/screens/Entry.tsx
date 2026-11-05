import { ChevronRight, Lock, Moon, Play, ScanLine, Settings2, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../data'
import { useApp } from '../store'
import { Seal } from '../ui'
import { QR } from '../utils'

export function Scan() {
  const { go, st, ac, acd, me, tour, say } = useApp()
  const [busy, setBusy] = useState(false)
  const timer = useRef<number>(0)
  const enter = () => { setBusy(true); say('Opening Matdata Setu…'); window.setTimeout(() => go('citizen'), 750) }
  useEffect(() => { if (tour !== null) return; timer.current = window.setTimeout(enter, 5200); return () => clearTimeout(timer.current) /* eslint-disable-next-line */ }, [tour])
  const rows: [string, string][] = [['Elector', `${me.nm} · ${me.nmLoc}`], ['EPIC No.', me.epic], ['Part / Booth', `${me.part} · ${me.bid}`], ['Poll day', acd.pollDate]]
  return (
    <main className="screen wrap w-sm" style={{ paddingTop: 'clamp(20px,6vh,56px)' }}>
      <div className="row" style={{ justifyContent: 'center', marginBottom: 18 }}>
        <span className="avatar" style={{ borderRadius: 14 }}><Seal /></span>
        <div><b style={{ fontSize: 20 }}>Matdata Setu</b><div className="faint">मतदाता सेतु</div></div>
      </div>
      <section className="glass slip">
        <div className="head"><span className="livedot" /> Voter Information Slip · मतदाता सूचना पर्ची</div>
        <div className="slipbody">
          <div className="grow stack" style={{ gap: 2 }}>{rows.map(([a, b]) => <div key={a}><div className="faint" style={{ fontSize: 11.5 }}>{a}</div><div className={a === 'EPIC No.' ? 'mono' : ''} style={{ fontWeight: 600, fontSize: 14.5 }}>{b}</div></div>)}</div>
          <div className="qrbox sm" data-tour="qr"><i className="cn a" /><i className="cn b" /><i className="cn c" /><i className="cn d" /><QR seed={'matdata-setu-' + st + ac} /></div>
        </div>
        <div className="pad stack" style={{ paddingTop: 0 }}>
          <span className="tag acc" style={{ justifySelf: 'start' }}>● Interactive QR</span>
          <p className="muted" style={{ fontSize: 14 }}>Scanning the QR on your slip opens Matdata Setu — no app to install.</p>
          <button className="btn primary block" disabled={busy} onClick={() => { clearTimeout(timer.current); enter() }}><ScanLine size={18} /> {busy ? '✓ Opening Matdata Setu…' : 'Tap to scan'}</button>
          <button className="faint" style={{ textDecoration: 'underline' }} onClick={() => { clearTimeout(timer.current); go('home') }}>Election staff or admin? Sign in →</button>
        </div>
      </section>
      <p className="disc">{CONFIG[st].name} · {acd.name} ({acd.no}). Demo slip — all data fictional.</p>
    </main>
  )
}

const ROLES = [
  { k: 'citizen', icon: UserRound, t: 'Citizen', s: 'Scan your Voter Slip to begin', c: '#ff9933' },
  { k: 'officer', icon: ShieldCheck, t: 'Returning Officer', s: 'Sign in to the live command console', c: '#60a5fa' },
  { k: 'platform', icon: Settings2, t: 'Administrator', s: 'Platform configuration & integrations', c: '#a78bfa' },
] as const

export function Home() {
  const { go, st, ac, cfg, setState, setAc, setTour, theme, toggleTheme } = useApp()
  const [login, setLogin] = useState<'officer' | 'platform' | null>(null)
  const [pw, setPw] = useState('demo1234')
  const email = login === 'officer' ? `ro.${ac}@eci-demo.gov.in` : 'admin@matdata-setu-demo.in'
  return (
    <main className="screen wrap w-sm">
      <div className="hero">
        <div className="mark"><Seal size={40} /></div>
        <h1><span className="grad-text">Matdata Setu</span></h1>
        <div className="loc">मतदाता सेतु</div>
        <div style={{ marginTop: 14 }}><span className="tag acc">Concept demo</span></div>
        <div className="tricolor" style={{ width: 90, margin: '16px auto 0' }} />
        <p>Choose how to enter. Citizens scan their Voter Slip. Officials and admins sign in.</p>
      </div>
      <div className="roles">
        {ROLES.map(({ k, icon: I, t, s, c }) => (
          <button key={k} className="glass role" style={{ ['--rc' as string]: c }} onClick={() => (k === 'citizen' ? go('scan') : setLogin(k))}>
            <span className="ic"><I size={24} /></span><span><b>{t}</b><span>{s}</span></span><ChevronRight className="arr flip" />
          </button>
        ))}
      </div>
      {login && (
        <section className="glass pad stack" style={{ marginTop: 12 }}>
          <b className="row"><Lock size={16} /> {login === 'officer' ? 'Returning Officer' : 'Administrator'} sign-in</b>
          <label className="f">Official email<input className="inp" defaultValue={email} key={email} /></label>
          <label className="f">Password<input className="inp" type="password" value={pw} onChange={e => setPw(e.target.value)} /></label>
          <button className="btn primary" onClick={() => go(login)}>Sign in →</button>
          <p className="faint">Demo environment — credentials are illustrative; any value signs in. In production, access is role-based, OTP-verified and audit-logged.</p>
        </section>
      )}
      <section className="glass demo-ctl" aria-label="Demo controls">
        <div className="eyebrow">Demo controls — constituency used across all views</div>
        <select className="sel" aria-label="State" value={st} onChange={e => setState(e.target.value)}>{Object.entries(CONFIG).map(([k, c]) => <option key={k} value={k}>{c.name}</option>)}</select>
        <select className="sel" aria-label="Constituency" value={ac} onChange={e => setAc(e.target.value)}>{Object.entries(cfg.acs).map(([k, a]) => <option key={k} value={k}>{a.name}</option>)}</select>
        <div className="row"><button className="btn primary grow" onClick={() => setTour(0)}><Play size={18} /> Play guided demo</button><button className="iconbtn" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button></div>
      </section>
      <p className="disc">A concept demonstration by Kologic — Mitra assistant on the AARTHA voice engine. All data is fictional. The seal is a placeholder, not the State Emblem of India. Not affiliated with the ECI or any State Election Commission.</p>
    </main>
  )
}
