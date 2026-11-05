import { Check, Copy, Plug } from 'lucide-react'
import { useState } from 'react'
import { INTEGRATIONS, MELAS, UC } from '../data'
import { useApp } from '../store'
import { AppBar } from '../ui'

export function Platform() {
  const { mela, setMela, say } = useApp()
  const [cfg, setCfg] = useState(() => JSON.stringify(mela, null, 2))
  const load = (id: string) => { setMela(id); setCfg(JSON.stringify(MELAS.find(m => m.id === id), null, 2)) }
  const apply = () => { try { const j = JSON.parse(cfg); document.documentElement.style.setProperty('--accent', j.accent); say('Config applied live') } catch { say('Invalid JSON') } }
  return (<>
    <AppBar title="Platform & config" sub="One platform, configured per mela" />
    <main className="screen wrap w-lg"><div className="stack" style={{ gap: 18 }}>
      <p className="muted">Languages, zones, ghats, bathing dates, branding and dashboards all come from a per-mela config. Tap a mela to re-skin every view live.</p>
      <div className="sec">Load a mela</div>
      <div className="melas">{MELAS.map(m => (
        <button key={m.id} className={'glass mela' + (mela.id === m.id ? ' on' : '')} style={{ ['--mc' as string]: m.accent, ['--mc2' as string]: m.accent2 }} onClick={() => load(m.id)}>
          <div className="row between"><b style={{ fontSize: 17 }}>{m.name.split(' · ')[0]}</b>{mela.id === m.id && <Check size={18} color={m.accent} />}</div>
          <div className="faint">{m.nameLoc}</div>
          <div className="stack" style={{ gap: 3, marginTop: 10, fontSize: 13.5 }}><span>{m.pilgrims}</span><span>{m.ghats}</span><span>{m.river} · {m.window}</span><span className="faint">{m.langs}</span></div>
        </button>))}</div>
      <div className="sec">System integrations</div>
      <div className="glass card">{INTEGRATIONS.map(([n, s]) => <div className="kv" key={n}><span className="row"><Plug size={15} />{n}</span><span className={'tag ' + (s === 'CONNECTED' ? 'ok' : s === 'CONFIG' ? 'warn' : 'info')}>{s}</span></div>)}</div>
      <div className="sec">Use-cases covered</div>
      <div className="ucgrid">{UC.map(u => <div className="uc" key={u}><Check size={15} color="var(--ok)" />{u}</div>)}</div>
      <div className="sec">Developer & admin — configure as data, not code</div>
      <div className="glass card stack">
        <div className="faint">Editing: {mela.name} ({mela.id})</div>
        <textarea className="cfgta" spellCheck={false} value={cfg} onChange={e => setCfg(e.target.value)} aria-label="Config JSON" />
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button className="btn primary sm" onClick={apply}>Apply to current</button>
          <button className="btn ghost sm" onClick={() => { try { const j = JSON.parse(cfg); MELAS.push({ ...j, id: j.id + '-' + MELAS.length }); say('Added as new mela'); load(MELAS[MELAS.length - 1].id) } catch { say('Invalid JSON') } }}>Add as new mela</button>
          <button className="btn ghost sm" onClick={() => { navigator.clipboard?.writeText(cfg); say('Copied') }}><Copy size={14} /> Copy</button>
        </div>
      </div>
      <div className="sec">Compliance & data</div>
      <div className="glass card">{['DPDPA 2023 · consent-first', 'Crowd-safety decisions are human-in-the-loop', 'Anonymous & aggregate analytics', 'Only registered sevaks update official data · pilgrim reports shown as unverified'].map(x => <div className="kv" key={x}><span>{x}</span></div>)}</div>
      <p className="disc">Concept demonstration by Kologic. Not affiliated with any Mela administration, State Government or the Akhara Parishad. All data fictional.</p>
    </div></main>
  </>)
}
