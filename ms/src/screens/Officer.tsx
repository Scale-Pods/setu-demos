import { AlertTriangle, Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { GCATS, GSTAT } from '../data'
import { useApp } from '../store'
import { AppBar, BarChart, DualChart, Meter, StateSelects } from '../ui'
import { inFmt, qColor, qLevel, seeded } from '../utils'

export function Officer() {
  const { st, ac, cfg, acd, say } = useApp()
  const [live, setLive] = useState<Record<string, number>>({})
  const [sent, setSent] = useState<Record<string, boolean>>({})
  useEffect(() => { setLive({}); setSent({}) }, [st, ac])
  useEffect(() => { const id = setInterval(() => setLive(l => Object.fromEntries(acd.booths.map(b => [b.id, Math.max(2, (l[b.id] ?? b.q) + Math.round((Math.random() - 0.5) * 4))]))), 4000); return () => clearInterval(id) }, [acd])
  const booths = acd.booths.map(b => ({ ...b, q: live[b.id] ?? b.q }))
  const avg = Math.round(booths.reduce((a, b) => a + b.q, 0) / booths.length)
  const grievances = useMemo(() => {
    const r = seeded(st + ac)
    return Array.from({ length: 7 }, () => { const c = GCATS[Math.floor(r() * GCATS.length)]; const b = acd.booths[Math.floor(r() * acd.booths.length)]; const s = GSTAT[Math.min(3, Math.floor(r() * 4.2))]; return { cat: c, b, s, mins: 8 + Math.floor(r() * 95), id: 'CVG-' + (100000 + Math.floor(r() * 899999)) } })
  }, [st, ac, acd])
  const open = grievances.filter(g => g.s[0] !== 'Closed').length
  const alerts = booths.filter(b => b.q >= 28).slice(0, 2); const grvB = booths.find(b => b.grv >= 3)
  const kpis: [string, string, string][] = [
    ['QR scans today', inFmt(Math.round(acd.totalVoters * 0.21)), '▲ 18% vs last poll'], ['Turnout now', cfg.turnout[8] + '%', 'as of 3:00 PM'], ['Avg queue wait', avg + ' min', '▼ 9 min after slotting'],
    ['Grievances open / closed', `${open} / ${241 + grievances.length - open}`, '94% within SLA'], ['Accessibility requests', inFmt(Math.round(acd.totalVoters * 0.012)), 'wheelchair, escort, home-vote'], ['Booths reporting', inFmt(acd.totalBooths), `${cfg.langs.length} languages served`],
  ]
  const fmax = 248
  return (<>
    <AppBar title="Command console" sub={`${acd.name} (${acd.no}) · ${acd.ro}`}><span className="tag ok"><span className="livedot" /> LIVE</span></AppBar>
    <main className="screen wrap w-lg"><div className="stack" style={{ gap: 14 }}>
      <div className="row between" style={{ flexWrap: 'wrap' }}><StateSelects /><span className="faint">Updated just now · {acd.pollDate}</span></div>
      {alerts.map(b => <div key={b.id} className="alert crit"><AlertTriangle size={19} color="var(--crit)" /><span><b>{b.id} {b.nm}</b> — queue ~{b.q} min. Send a marshal.</span></div>)}
      {grvB && <div className="alert warn"><Clock size={19} color="var(--warn)" /><span><b>{grvB.id}</b> — {grvB.grv} grievances open, approaching SLA.</span></div>}
      <div className="kpis">{kpis.map(([l, v, n]) => <div className="glass kpi" key={l}><div className="lb">{l}</div><div className="v">{v}</div><div className="n">{n}</div></div>)}</div>
      <div className="panels" style={{ marginTop: 0 }}>
        <div className="glass card stack"><h3>Scans by touchpoint</h3><div className="faint">Demand signal for staffing.</div><BarChart data={cfg.scans} /></div>
        <div className="glass card stack"><h3>Turnout & queue wait</h3><div className="faint">Provisional, round-wise — queue line flags the crush early.</div><DualChart turnout={cfg.turnout} wait={cfg.wait} />
          <div className="row faint"><span style={{ color: 'var(--info)' }}>● Turnout %</span><span style={{ color: 'var(--accent)' }}>● Queue wait (min)</span></div></div>
        <div className="glass card stack"><h3>Grievance funnel</h3><div className="faint">Reports → verification → action, vs the 100-minute clock.</div>
          {([['Reported', fmax], ['Verified', Math.round(fmax * 0.86)], ['Actioned', Math.round(fmax * 0.79)]] as [string, number][]).map(([k, v]) => <div key={k} style={{ width: 30 + (v / fmax) * 66 + '%', padding: '9px 14px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 14, background: 'color-mix(in srgb, var(--accent) 30%, transparent)' }}><span>{k}</span><span className="mono">{v}</span></div>)}
          <div className="faint">94% actioned within target</div></div>
        <div className="glass card stack"><h3>Language of interaction</h3><div className="faint">An English-only portal would miss most voters.</div><BarChart data={cfg.lang} /></div>
      </div>
      <div className="glass card stack"><div className="row between"><h3>Live grievance queue</h3><span className="tag warn">{open} open</span></div>
        {grievances.map(g => <button key={g.id} className="kv" style={{ alignItems: 'center', textAlign: 'left', width: '100%' }} onClick={() => say(`Grievance ${g.id} assigned to the Field Verification Team`)}>
          <span className="row"><span style={{ fontSize: 20 }}>{g.cat[1]}</span><span><b style={{ color: 'var(--ink)' }}>{g.cat[0]} · {g.b.id}</b><div className="faint mono">{g.id} · {g.mins} min ago</div></span></span>
          <span className="tag" style={{ color: g.s[1] }}>{g.s[0]}</span></button>)}</div>
      <div className="glass card scroll-x"><h3 style={{ marginBottom: 8 }}>Booths needing attention</h3>
        <table className="bt"><thead><tr><th>Booth</th><th>Queue</th><th>Turnout</th><th>Grv.</th><th>Action</th></tr></thead><tbody>
          {[...booths].sort((a, b) => b.q - a.q).map(b => <tr key={b.id}><td><b>{b.id}</b><div className="faint">{b.nm}</div></td>
            <td><span className="tag" style={{ color: qColor(b.q), background: `color-mix(in srgb, ${qColor(b.q)} 16%, transparent)` }}>~{b.q}m {qLevel(b.q)}</span></td>
            <td style={{ minWidth: 80 }}><span className="mono">{b.turn}%</span><Meter pct={b.turn} /></td><td className="mono">{b.grv}</td>
            <td>{sent[b.id] ? <span className="tag ok">Dispatched ✓</span> : <button className="btn ghost sm" onClick={() => { setSent(s => ({ ...s, [b.id]: true })); say(`✓ Marshal dispatched to ${b.id} · ETA ~8 min`) }}>Send →</button>}</td></tr>)}
        </tbody></table></div>
    </div></main></>)
}
