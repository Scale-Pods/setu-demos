import { Activity, AlertTriangle, BarChart3, Clock, FlaskConical, HeartPulse, LayoutDashboard, Siren, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store'
import { AppBar, AreaChart, BarChart, Funnel, Meter, MelaZone, fmt, sev } from '../ui'

function Flash({ v, children }: { v: number | string; children: React.ReactNode }) {
  const [f, setF] = useState(false); const prev = useRef(v)
  useEffect(() => { if (prev.current !== v) { prev.current = v; setF(true); const id = setTimeout(() => setF(false), 1000); return () => clearTimeout(id) } }, [v])
  return <span className={f ? 'flash' : ''}>{children}</span>
}

const NAV = [['Overview', LayoutDashboard], ['Incidents', Siren], ['Lost & found', Users], ['Medical', HeartPulse], ['Analytics', BarChart3]] as const

export function Officer() {
  const { zone, kpi, ghats, hours, reports } = useApp()
  const [tab, setTab] = useState('Overview')
  const h = ghats[0]
  const incidents: [string, string, string, string][] = [
    ['INC-221', 'Surge at Gate 2 steps', 'Critical', '06 min'], ['INC-219', 'Medical — heat stroke', 'High', '11 min'], ['INC-216', 'Lost child, 6 yrs', 'High', '19 min'], ['INC-210', 'Overflowing toilet block 3', 'Medium', '32 min'],
  ]
  return (<>
    <AppBar title="Command console" sub={`${zone} · Z-01`}><span className="tag ok"><span className="livedot" /> LIVE</span></AppBar>
    <main className="screen wrap w-lg">
      <div className="console">
        <nav className="glass side" aria-label="Console sections">{NAV.map(([n, I]) => <button key={n} className={tab === n ? 'on' : ''} onClick={() => setTab(n)}><I size={18} />{n}</button>)}</nav>
        <div className="stack" style={{ gap: 14 }}>
          <MelaZone />
          {h.pct >= 85 && <div className="alert crit"><AlertTriangle size={19} color="var(--crit)" /><span><b>{h.code} {h.name.split(' (')[0]} at {h.pct}%</b> — divert inflow & open holding area.</span></div>}
          <div className="alert warn"><Clock size={19} color="var(--warn)" /><span><b>G-HKP — 4 open incidents</b>, approaching SLA.</span></div>

          {(tab === 'Overview' || tab === 'Analytics') && (<>
            <div className="kpis">
              <K lb="Pilgrims on-site" v={fmt(kpi.onsite)} n="▲ live across the mela" />
              <K lb="Peak ghat density" v={`${h.pct}%`} n="divert inflow at 90%" c={sev(h.pct)} />
              <K lb="Avg wait at ghats" v={`${kpi.wait} min`} n="▼ after slotting" />
              <K lb="Lost & found" v="12 open" n="486 reunited · ~40 min" />
              <K lb="Medical cases" v="137" n="camps + ambulances" />
              <K lb="Active SOS" v={String(kpi.sos)} n="6 open · target 15 min" c="var(--crit)" />
              <K lb="Field data freshness" v={`${kpi.fresh}%`} n="142 sevaks · <15 min" />
            </div>
            <div className="panels" style={{ marginTop: 0 }}>
              <div className="glass card stack"><h3>Help requests by type</h3><BarChart data={[['Wayfinding', 88], ['Crowd info', 71], ['Snan dates', 44], ['Lost & Found', 33], ['Medical', 22], ['SOS', 9], ['Helpline', 29]]} /></div>
              <div className="glass card stack"><h3>Crowd density by hour</h3><AreaChart data={hours} /><div className="faint">The red dot flags the crush window.</div></div>
              <div className="glass card stack"><h3>Lost & found reunification</h3><Funnel /></div>
              <div className="glass card stack"><h3>Language of interaction</h3><BarChart data={[['Hindi', 74], ['English', 12], ['Punjabi', 8], ['Other', 6]]} /></div>
            </div>
          </>)}
          {(tab === 'Overview' || tab === 'Incidents') && (
            <div className="glass card"><h3 style={{ marginBottom: 8 }}>Open incidents</h3>
              <table className="bt"><thead><tr><th>ID</th><th>Incident</th><th>Severity</th><th>Age</th></tr></thead>
                <tbody>{incidents.map(([a, b, c, d]) => <tr key={a}><td className="mono">{a}</td><td>{b}</td><td><span className={'tag ' + (c === 'Critical' ? 'crit' : c === 'High' ? 'warn' : 'info')}>{c}</span></td><td className="mono">{d}</td></tr>)}</tbody></table></div>)}
          {tab === 'Lost & found' && <div className="glass card stack"><h3>Lost & found reunification</h3><Funnel /></div>}
          {tab === 'Medical' && <div className="glass card stack"><h3>Medical camps</h3>{[['Camp 1 · Har Ki Pauri', 48], ['Camp 2 · Mansa Devi', 71], ['Camp 3 · Bairagi', 29]].map(([n, p]) => <div key={n as string}><div className="row between"><span>{n}</span><b className="mono">{p}%</b></div><Meter pct={p as number} /></div>)}</div>}
          <div className="glass card stack"><h3 className="row"><Activity size={17} /> Public reports · unverified</h3>{reports.slice(0, 4).map(r => <div className="kv" key={r.id}><span className="mono">{r.id}</span><span>{r.text}</span></div>)}</div>
          <p className="faint"><FlaskConical size={13} style={{ verticalAlign: -2 }} /> Values update live as fresh data arrives.</p>
        </div>
      </div>
    </main>
  </>)

  function K({ lb, v, n, c }: { lb: string; v: string; n: string; c?: string }) {
    return <div className="glass kpi"><div className="lb">{lb}</div><div className="v" style={{ color: c }}><Flash v={v}>{v}</Flash></div><div className="n">{n}</div></div>
  }
}
