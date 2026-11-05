import { Check, Copy, Plug } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CONFIG, INTEG, UC, type StateCfg } from '../data'
import { useApp } from '../store'
import { AppBar } from '../ui'

export function Platform() {
  const { st, cfg, setState, say, bump } = useApp()
  const [json, setJson] = useState(''); const [key, setKey] = useState('')
  useEffect(() => { setJson(JSON.stringify(cfg, null, 1)) }, [st, cfg])
  const parse = (): StateCfg | null => {
    try {
      const j = JSON.parse(json); const miss = ['name', 'nameLoc', 'accent', 'accentSoft', 'langs', 'electors', 'booths', 'acs'].filter(k => !(k in j))
      if (miss.length) { say('Missing: ' + miss.join(', ')); return null }
      if (!Object.keys(j.acs).length) { say('Need at least one constituency in “acs”.'); return null }
      if (!Array.isArray(j.langs) || !j.langs.length) { say('“langs” must be a non-empty array.'); return null }
      return { turnout: cfg.turnout, wait: cfg.wait, scans: cfg.scans, lang: cfg.lang, ceo: '', helpline: '1950', ...j }
    } catch (e) { say('Invalid JSON — ' + (e as Error).message); return null }
  }
  return (<>
    <AppBar title="Platform & config" sub="One platform, configured per state" />
    <main className="screen wrap w-lg"><div className="stack" style={{ gap: 18 }}>
      <p className="muted">Languages, constituencies, candidates, booth data, branding and dashboards all come from a per-state config. Tap a state to load it live across every view.</p>
      <div className="sec">Load a state</div>
      <div className="melas">{Object.entries(CONFIG).map(([k, c]) => (
        <button key={k} className={'glass mela' + (k === st ? ' on' : '')} style={{ ['--mc' as string]: c.accent, ['--mc2' as string]: c.accent }} onClick={() => { setState(k); say('Loaded ' + c.name) }}>
          <div className="row between"><b style={{ fontSize: 17 }}>{c.name}</b>{k === st && <Check size={18} color={c.accent} />}</div><div className="faint">{c.nameLoc}</div>
          <div className="stack" style={{ gap: 3, marginTop: 10, fontSize: 13.5 }}><span>Electors <b>{c.electors}</b></span><span>Booths <b>{c.booths}</b></span><span>Sample seat <b>{Object.values(c.acs)[0].name}</b></span></div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginTop: 10 }}>{c.langs.map(l => <span key={l} className="tag">{l}</span>)}</div></button>))}</div>
      <div className="sec">System integrations</div>
      <div className="glass card">{INTEG.map(([n, d, s]) => <div className="kv" key={n}><span className="row"><Plug size={15} /><span><b style={{ color: 'var(--ink)' }}>{n}</b><div className="faint" style={{ textAlign: 'left', fontWeight: 400 }}>{d}</div></span></span><span className={'tag ' + (s === 'Connected' ? 'ok' : s === 'Config' ? 'warn' : 'info')}>{s}</span></div>)}</div>
      <div className="sec">Use-cases covered</div>
      <div className="ucgrid">{UC.map(([t, d]) => <div className="uc" key={t} style={{ alignItems: 'flex-start' }}><Check size={15} color="var(--ok)" style={{ marginTop: 3, flex: 'none' }} /><span><b>{t}</b><div className="faint">{d}</div></span></div>)}</div>
      <div className="sec">Developer & admin — configure as data, not code</div>
      <div className="panels" style={{ marginTop: 0 }}>
        <div className="glass card stack">
          <div className="faint">Editing: {cfg.name} ({st})</div>
          <input className="inp mono" placeholder="state key, e.g. gj" value={key} onChange={e => setKey(e.target.value)} aria-label="State key" />
          <textarea className="cfgta" spellCheck={false} value={json} onChange={e => setJson(e.target.value)} aria-label="Config JSON" />
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button className="btn primary sm" onClick={() => { const j = parse(); if (j) { CONFIG[st] = j; bump(); say('Applied to ' + j.name + '.') } }}>Apply to current</button>
            <button className="btn ghost sm" onClick={() => { const k = key.toLowerCase().replace(/[^a-z0-9]/g, ''); if (!k) return say('Enter a short state key, e.g. “gj”.'); const j = parse(); if (j) { CONFIG[k] = j; setState(k); say(`Added “${j.name}” (${k}) — now in every view.`) } }}>Add as new state</button>
            <button className="btn ghost sm" onClick={() => { navigator.clipboard?.writeText(json); say('Copied.') }}><Copy size={14} /> Copy</button></div></div>
        <div className="glass card stack"><h3>Config schema</h3>
          {['name · nameLoc', 'accent · accentSoft', 'langs (en, hi, ur, pa, mr)', 'electors · booths', 'acs → voters, booths, candidates', 'turnout · wait · scans · lang'].map(x => <div className="kv" key={x}><span className="mono" style={{ fontSize: 13 }}>{x}</span></div>)}
          <div className="faint">Copy the JSON, change values, set langs, then Add as new state — it appears everywhere.</div></div>
      </div>
      <div className="sec">Compliance & data</div>
      <div className="row" style={{ flexWrap: 'wrap' }}>{['DPDPA 2023 · consent-first', 'Officials own all data entry', 'Aadhaar-OTP e-sign for roll changes', 'Anonymous & aggregate analytics'].map(x => <span key={x} className="chip">{x}</span>)}</div>
      <p className="disc">Concept demonstration by Kologic. No open ECI API exists; a live build is a sponsored engagement (MoU with a State CEO, or via the SI/NIC stack). Most of this app needs no electoral-roll access. Not affiliated with the ECI or any State Election Commission. All data fictional.</p>
    </div></main></>)
}
