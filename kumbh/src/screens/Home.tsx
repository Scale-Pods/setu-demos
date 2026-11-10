import { ChevronRight, MapPinned, Moon, Play, ScanLine, Settings2, ShieldCheck, Sun, UserRound, Users } from 'lucide-react'
import { MELAS } from '../data'
import { useApp, type Route } from '../store'
import { Logo } from '../ui'

const ROLES: { r: Route; icon: typeof UserRound; t: string; s: string; c: string }[] = [
  { r: 'scan', icon: ScanLine, t: 'Pilgrim', s: 'Scan a QR — no pass needed', c: '#ff8a3d' },
  { r: 'volunteer', icon: Users, t: 'Sevak / Volunteer', s: 'Update live info for pilgrims', c: '#34d399' },
  { r: 'officer', icon: ShieldCheck, t: 'Mela Officer', s: 'Sign in to the command console', c: '#60a5fa' },
  { r: 'platform', icon: Settings2, t: 'Administrator', s: 'Platform configuration & integrations', c: '#a78bfa' },
]

export function Home() {
  const { go, mela, setMela, zone, setZone, setTour, theme, toggleTheme, t } = useApp()
  return (
    <main className="screen wrap w-sm">
      <div className="hero">
        <div className="mark"><Logo size={40} /></div>
        <h1><span className="grad-text">KUMBH MITRA</span></h1>
        <div className="loc">कुंभ मित्र</div>
        <div style={{ marginTop: 14 }}><span className="tag acc">Concept demo</span></div>
        <p>{t('choose')}. Pilgrims just scan any QR at the mela. Sevaks, officers and admins sign in.</p>
      </div>

      <div className="roles" data-tour="roles">
        {ROLES.map(({ r, icon: I, t: title, s, c }) => (
          <button key={r} className="glass role" style={{ ['--rc' as string]: c }} onClick={() => go(r)}>
            <span className="ic"><I size={24} /></span>
            <span><b>{title}</b><span>{s}</span></span>
            <ChevronRight className="arr" />
          </button>
        ))}
      </div>

      <section className="glass demo-ctl" aria-label="Demo controls">
        <div className="eyebrow">Demo controls — mela & zone used across all views</div>
        <select className="sel" aria-label="Mela" value={mela.id} onChange={e => setMela(e.target.value)}>
          {MELAS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className="sel" aria-label="Zone" value={zone} onChange={e => setZone(e.target.value)}>
          {mela.zones.map(z => <option key={z}>{z}</option>)}
        </select>
        <div className="row" style={{ marginTop: 4 }}>
          <button className="btn primary grow" onClick={() => setTour(0)}><Play size={18} /> Play guided demo</button>
          <button className="iconbtn" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
        </div>
      </section>
      <p className="disc">A concept demonstration by Kologic — the Sahayak assistant on the AARTHA voice engine. All pilgrims, IDs and figures are fictional. The seal is a placeholder. Not affiliated with the Mela administration, the Government of Uttarakhand, or the Akhara Parishad.</p>
    </main>
  )
}

export function Scan() {
  const { go, mela, zone, say } = useApp()
  const enter = () => { say('Opening Kumbh Mitra…'); setTimeout(() => go('citizen'), 700) }
  return (
    <main className="screen wrap w-sm" style={{ paddingTop: 'clamp(24px,8vh,80px)' }}>
      <div className="glass pad stack" style={{ textAlign: 'center', gap: 16 }}>
        <div className="row" style={{ justifyContent: 'center' }}><MapPinned size={18} color="var(--accent)" /><b>You scanned a Kumbh Mitra QR</b></div>
        <div className="qrbox" data-tour="qr">
          <i className="cn a" /><i className="cn b" /><i className="cn c" /><i className="cn d" />
          <svg viewBox="0 0 21 21" width="100%" shapeRendering="crispEdges" fill="#12102e">
            {Array.from({ length: 441 }, (_, i) => { const x = i % 21, y = Math.floor(i / 21); const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const on = finder ? (x % 14 === 0 || y % 14 === 0 || x % 14 === 6 || y % 14 === 6 || ((x % 14) > 1 && (x % 14) < 5 && (y % 14) > 1 && (y % 14) < 5)) : ((x * 7 + y * 13 + x * y) % 5 < 2); return on && <rect key={i} x={x} y={y} width="1" height="1" /> })}
          </svg>
        </div>
        <div><div className="faint">This QR is posted at</div><h2 style={{ fontSize: 20 }}>{mela.ghat}</h2><div className="muted">{zone}</div></div>
        <span className="tag acc" style={{ justifySelf: 'center' }}><span className="livedot" /> Interactive QR — ghats, gates, help desks & poles</span>
        <p className="muted" style={{ fontSize: 14 }}>Open Kumbh Mitra for everything around you — no pass, no app to install.</p>
        <button className="btn primary block" onClick={enter}>Enter — I’m here now</button>
        <button className="btn ghost block" onClick={() => { say('e-Pass linked (demo)'); setTimeout(() => go('citizen'), 700) }}>I have an e-Pass / wristband</button>
        <p className="faint" style={{ fontSize: 12.5 }}>An e-Pass (pre-registered parking, stay, groups or VIP snan) is optional — it links your group for instant lost-person alerts and your bookings.</p>
        <button className="faint" style={{ textDecoration: 'underline' }} onClick={() => go('volunteer')}>Mela staff, sevak or admin? Sign in →</button>
        <button className="faint" onClick={() => go('home')}>← Back</button>
      </div>
    </main>
  )
}
