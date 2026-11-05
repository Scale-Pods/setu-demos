import { Minus, Plus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { FOOD, STAYS } from '../data'
import { useApp } from '../store'
import { AppBar, fmt } from '../ui'

const POSTS = ['Bhandara counter — ISKCON Annakshetra', 'Accommodation desk — Govt Tent City', 'Sanitation point — Toilet block', 'Crowd marshal — Ghat crowd', 'Lost & found — Kho-Khoya reunion desk']

export function Sevak() {
  const { sevak, setSevak, say } = useApp()
  const [f, setF] = useState({ name: '', phone: '', post: POSTS[0] })
  if (!sevak) {
    return (<>
      <AppBar title="Sevak" sub="Volunteer field app" />
      <main className="screen wrap w-sm"><div className="glass pad stack">
        <h2 style={{ fontSize: 24 }}>Register as a Sevak 🙏</h2>
        <p className="muted">Only registered volunteers can update the live info pilgrims see.</p>
        <div className="eyebrow row"><ShieldCheck size={15} /> Sevak verification</div>
        <div className="note">In production this is a phone number + OTP, mapped to the post you are assigned. For the demo, any details work.</div>
        <label className="f">Your name<input className="inp" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
        <label className="f">Phone number<input className="inp" inputMode="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></label>
        <label className="f">Assigned post<select className="sel" value={f.post} onChange={e => setF({ ...f, post: e.target.value })}>{POSTS.map(p => <option key={p}>{p}</option>)}</select></label>
        <button className="btn primary" onClick={() => { setSevak({ name: f.name || 'Demo Sevak', phone: f.phone, post: f.post }); say('Verified · welcome 🙏') }}>Verify & start →</button>
        <p className="faint">Pilgrims can report what they see, but those stay unverified until a registered sevak confirms them.</p>
      </div></main>
    </>)
  }
  return <Console />
}

function Console() {
  const { sevak, setSevak, open, setOpen, served, bump, reports, say } = useApp()
  const [beds, setBeds] = useState<Record<string, number>>(Object.fromEntries(STAYS.map(s => [s.id, s.free])))
  return (<>
    <AppBar title={`Namaste, ${sevak!.name}`} sub={sevak!.post} />
    <main className="screen wrap w-sm"><div className="stack">
      <div className="note warn">Data nudge: bed counts at Rain Basera are 10 min old — please refresh.</div>
      <div className="sec">Bhandara kitchens</div>
      {FOOD.slice(0, 3).map(f => (
        <div className="glass card stack" key={f.id}>
          <b>{f.name}</b>
          <div className="seg" style={{ width: '100%' }}>{(['open', 'soon', 'closed'] as const).map(s => <button key={s} className={open[f.id] === s ? 'on' : ''} style={{ flex: 1 }} onClick={() => { setOpen(f.id, s); say(`${f.name}: ${s}`) }}>{s === 'soon' ? 'Opening soon' : s[0].toUpperCase() + s.slice(1)}</button>)}</div>
          <div className="row between"><span className="muted">Meals served today</span>
            <div className="row"><button className="iconbtn" aria-label="Decrease" onClick={() => bump(f.id, -100)}><Minus size={16} /></button><b className="mono" style={{ minWidth: 70, textAlign: 'center' }}>{fmt(served[f.id])}</b><button className="iconbtn" aria-label="Increase" onClick={() => bump(f.id, 100)}><Plus size={16} /></button></div></div>
        </div>))}
      <div className="sec">Beds free</div>
      {STAYS.slice(0, 3).map(s => (
        <div className="glass card row between" key={s.id}><b>{s.name}</b>
          <div className="row"><button className="iconbtn" aria-label="Decrease" onClick={() => setBeds(b => ({ ...b, [s.id]: Math.max(0, b[s.id] - 5) }))}><Minus size={16} /></button><b className="mono" style={{ minWidth: 40, textAlign: 'center' }}>{beds[s.id]}</b><button className="iconbtn" aria-label="Increase" onClick={() => setBeds(b => ({ ...b, [s.id]: b[s.id] + 5 }))}><Plus size={16} /></button></div></div>))}
      <button className="btn primary" onClick={() => say('Update sent — live for pilgrims ✓')}>Send update</button>
      <div className="sec">Public reports to verify</div>
      {reports.filter(r => !r.verified).slice(0, 3).map(r => <div className="glass card row between" key={r.id}><div><span className="mono faint">{r.id}</span><div>{r.text}</div></div><button className="btn ghost sm" onClick={() => say('Verified ' + r.id)}>Confirm</button></div>)}
      <button className="btn ghost" onClick={() => setSevak(null)}>Sign out</button>
    </div></main>
  </>)
}
