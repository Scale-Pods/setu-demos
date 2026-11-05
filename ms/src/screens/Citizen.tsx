import { Accessibility, BadgeCheck, CalendarDays, ClipboardCheck, Clock, FileSearch, Headphones, Mic, Navigation, Phone, Search, Send, Share2, ShieldAlert, Siren, Timer, TrendingUp, UserSearch, Vote, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CAL, DOCS, DONTS, FIRST, GCATS, STEPS5, TILES, type Cand, type Voter } from '../data'
import { useApp } from '../store'
import { AppBar, MapSVG, Meter, Timeline } from '../ui'
import { inFmt, qColor } from '../utils'

const ICONS: Record<string, [LucideIcon, string]> = {
  booth: [Navigation, '#ff9933'], queue: [Timer, '#60a5fa'], enroll: [FileSearch, '#34d399'], candidate: [UserSearch, '#a78bfa'], prep: [ClipboardCheck, '#fbbf24'], calendar: [CalendarDays, '#f472b6'],
  access: [Accessibility, '#2dd4bf'], report: [Siren, '#fb7185'], track: [Clock, '#c084fc'], helpline: [Phone, '#38bdf8'], results: [TrendingUp, '#fb923c'], help: [Headphones, '#ff9933'],
}
const GROUPS: [string, string[]][] = [['Plan', ['booth', 'enroll', 'candidate', 'prep', 'calendar']], ['Vote', ['queue', 'results', 'access']], ['Help & report', ['report', 'track', 'helpline']]]

export function Citizen() {
  const { journey, setJourney, tile, ui, me, acd, go, lang, booth } = useApp()
  const first = (lang === 'en' ? me.nm : me.nmLoc).split(' ')[0]
  if (journey) return (<><AppBar title={tile(journey)} sub={`${me.nm} · ${acd.name}`} back={() => setJourney(null)} /><main className="screen wrap w-sm"><div className="stack"><Journey k={journey} /></div></main></>)
  return (<>
    <AppBar title="Matdata Setu" sub={`${first} · ${acd.name}`} back={() => go('scan')} />
    <main className="screen wrap w-sm"><div className="stack" style={{ gap: 18 }}>
      <div><h2 style={{ fontSize: 30, fontWeight: 800 }}>{ui('hello')}, {first} <span>🙏</span></h2><p className="muted">{ui('ask')}</p></div>
      <section className="glass ghatcard" data-tour="hero">
        <div className="eyebrow">Your booth</div>
        <b style={{ fontSize: 19, display: 'block', marginTop: 8 }}>{booth.id} · {booth.nm}</b>
        <div className="muted" style={{ fontSize: 14 }}>{booth.addr}</div>
        <div className="row" style={{ marginTop: 12, flexWrap: 'wrap' }}><span className="tag acc"><Vote size={13} /> {acd.pollDate}</span><span className="tag" style={{ color: qColor(booth.q) }}>~{booth.q} min queue</span><span className="tag">7 AM – 6 PM</span></div>
        <div className="row" style={{ marginTop: 14 }}><button className="btn primary sm grow" onClick={() => setJourney('booth')}><Navigation size={16} /> Find my booth</button><button className="btn ghost sm grow" onClick={() => setJourney('queue')}>Get queue token</button></div>
      </section>
      {GROUPS.map(([g, ids], gi) => (<section key={g}><div className="sec" style={{ marginBottom: 10 }}>{g}</div>
        <div className="grid2">{ids.map((id, i) => { const [I, c] = ICONS[id]; return <button key={id} className="tile" data-k={id} style={{ ['--tc' as string]: c, animationDelay: gi * 80 + i * 45 + 'ms' }} onClick={() => setJourney(id)}><span className="ti"><I size={21} /></span><b>{tile(id)}</b></button> })}</div></section>))}
      <button className="glass role" style={{ ['--rc' as string]: '#ff9933' }} data-tour="mitra" onClick={() => setJourney('help')}><span className="ic"><Mic size={24} /></span><span><b>{tile('help')}</b><span>Voice or chat · your language</span></span></button>
    </div></main></>)
}

function Journey({ k }: { k: string }) {
  const M: Record<string, () => React.ReactNode> = { booth: Booth, queue: Queue, enroll: Enroll, candidate: Candidate, prep: Prep, calendar: Calendar, access: Access, report: Report, track: Track, helpline: Helpline, results: Results, help: Help }
  const C = M[k]; return C ? <C /> : null
}

function OkBar({ children }: { children: React.ReactNode }) { return <div className="okbar"><BadgeCheck size={18} />{children}</div> }

/* ---------- 1 booth ---------- */
function Booth() {
  const { acd, me, say, pick } = useApp()
  const [v, setV] = useState<Voter>(me); const [search, setSearch] = useState(false); const [q, setQ] = useState(''); const [nav, setNav] = useState(false)
  const b = acd.booths.find(x => x.id === v.bid) ?? acd.booths[0]
  const ql = q.trim().toLowerCase()
  const hits = ql.length >= 2 ? acd.voters.filter(x => x.epic.toLowerCase().includes(ql) || x.nm.toLowerCase().includes(ql) || x.nmLoc.toLowerCase().includes(ql)) : []
  const share = async () => {
    const txt = `My polling booth — ${b.id}, ${b.nm}, ${b.addr} • Timing 7:00 AM–6:00 PM • Voter: ${v.nm} (${v.epic}) • via Matdata Setu`
    try { await navigator.clipboard.writeText(txt); say('✓ Booth details copied — paste into WhatsApp or SMS') } catch { say('Could not copy automatically — long-press to copy') }
  }
  return (<>
    <OkBar>{pick({ en: 'On the electoral roll', hi: 'मतदाता सूची में नाम है' })}</OkBar>
    <div className="glass card">
      <div className="row" style={{ marginBottom: 6 }}><span className="avatar">{v.nm[0]}</span><b>{v.nm}</b></div>
      <div className="kv"><span>EPIC</span><span className="mono">{v.epic}</span></div><div className="kv"><span>Constituency</span><span>{acd.name} ({acd.no})</span></div>
      <div className="kv"><span>Polling station</span><span>{b.id} · {b.nm}</span></div><div className="kv"><span>Part / Serial</span><span>{v.part} / {v.serial}</span></div>
      <div className="kv"><span>BLO</span><span>{b.blo} · {b.ph}</span></div><div className="kv"><span>Timing</span><span>7:00 AM – 6:00 PM</span></div>
    </div>
    <MapSVG />
    <div className="row" style={{ flexWrap: 'wrap' }}>{b.fac.map(f => <span key={f} className="tag ok">✓ {f}</span>)}</div>
    <div className="glass card stack" style={{ gap: 8 }}><div className="row between"><b>Queue now · {b.id}</b><b style={{ color: qColor(b.q) }}>~{b.q} min</b></div><Meter pct={Math.min(100, b.q * 2.5)} color={qColor(b.q)} /></div>
    <div className="row"><button className="btn primary grow" onClick={() => { setNav(true); say(`📍 Opening directions to ${b.id}…`) }}><Navigation size={18} /> Navigate</button><button className="btn ghost grow" onClick={share}><Share2 size={18} /> Share</button></div>
    {nav && <div className="note"><b>{b.id} · {b.nm}</b><br />~1.2 km · about 6 min on foot. Opening maps… In production this launches turn-by-turn navigation.</div>}
    <button className="btn ghost block" onClick={() => setSearch(s => !s)}><Search size={18} /> Look up another voter</button>
    {search && <div className="glass card stack">
      <label className="f">Enter Voter ID (EPIC) or name<input className="inp" value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. Imran or UPX2233445" /></label>
      <div className="row" style={{ flexWrap: 'wrap' }}>{acd.voters.map(x => <button key={x.epic} className="chip" onClick={() => { setV(x); setQ('') }}>{x.nm.split(' ')[0]}</button>)}</div>
      {ql.length >= 2 && hits.length === 0 && <div className="note warn">No match — check the EPIC or spelling.</div>}
      {hits.length > 0 && <div className="sugg">{hits.map(x => <button key={x.epic} onClick={() => { setV(x); setQ('') }}><span className="avatar" style={{ width: 32, height: 32 }}>{x.nm[0]}</span><span><b>{x.nm}</b><div className="faint mono">{x.epic} · {x.age}/{x.g}</div></span></button>)}</div>}
    </div>}
  </>)
}

/* ---------- 2 queue ---------- */
function Queue() {
  const { booth, lang, ui, setJourney } = useApp(); const [tok, setTok] = useState<{ n: number; a: number } | null>(null)
  return (<>
    <p className="muted">{booth.nm} · {booth.addr}</p>
    <div className="glass card stack"><div className="row between"><b>{ui('live')} · {booth.id}</b><b style={{ color: qColor(booth.q) }}>~{booth.q} min</b></div><Meter pct={Math.min(100, booth.q * 2.5)} color={qColor(booth.q)} /><div className="faint">{booth.evms - 1} of {booth.evms} EVMs active · token service on</div></div>
    <button className="btn primary" onClick={() => { const a = booth.q + 1 + Math.floor(Math.random() * 6); setTok({ n: 1200 + a, a }) }}><Timer size={18} /> {ui('tok')}</button>
    {tok && <OkBar>{ui('tokd')} · #{tok.n} · ~{tok.a} ahead</OkBar>}
    <div className="sec">{ui('how')}</div>
    <ol className="glass card steps">{STEPS5[lang].map(([a, b]) => <li key={a}><span><b>{a}</b><div className="faint">{b}</div></span></li>)}</ol>
    <button className="btn ghost" onClick={() => setJourney('help')}>💬 {ui('askm')}</button>
  </>)
}

/* ---------- 3 enroll ---------- */
function Enroll() {
  const { acd, me, say, tr } = useApp(); const [q, setQ] = useState(me.epic); const [app, setApp] = useState(false)
  const v = acd.voters.find(x => x.epic.toLowerCase() === q.trim().toLowerCase()) ?? me
  return (<>
    <label className="f">{tr('Check enrolment status')} — EPIC or mobile<div className="row"><input className="inp mono" value={q} onChange={e => setQ(e.target.value)} /><button className="btn primary" onClick={() => say('Status refreshed')}>{tr('Check status')}</button></div></label>
    <OkBar>{tr('You are enrolled')}</OkBar>
    <div className="glass card"><div className="kv"><span>{v.nm}</span><span>{v.age} / {v.g}</span></div><div className="kv"><span>EPIC</span><span className="mono">{v.epic}</span></div><div className="kv"><span>Status</span><span className="tag ok">Active</span></div><div className="kv"><span>Part / Serial</span><span>{v.part} / {v.serial}</span></div></div>
    <button className="btn ghost" onClick={() => say('e-EPIC downloaded (demo).')}>⬇ {tr('Download e-EPIC')}</button>
    <div className="row" style={{ flexWrap: 'wrap' }}>{['Form 6 (new voter)', 'Form 8 (correction)', 'Form 7 (objection)'].map(f => <button key={f} className="chip" onClick={() => say(`✓ ${f} started — you will be guided through the fields (demo).`)}>{tr(f)}</button>)}</div>
    <button className="btn ghost" onClick={() => setApp(a => !a)}><FileSearch size={18} /> {tr('Track application')}</button>
    {app && <div className="glass card stack"><b>Application status · F8-{778001 + (Number(v.serial) % 900)}</b><Timeline items={[['Submitted online', '18 Apr · 10:22 AM', true], ['BLO field verification', '20 Apr · 2:40 PM', true], ['ERO approved', '22 Apr · 11:05 AM', true], ['e-EPIC generated', 'Pending', false]]} /></div>}
  </>)
}

/* ---------- 4 candidate ---------- */
function Candidate() {
  const { acd, tile } = useApp(); const [mode, setMode] = useState<'list' | 'cmp' | Cand>('list')
  const tot = (c: Cand) => c.mov + c.immov
  if (mode === 'cmp') return (<>
    <button className="chip" style={{ justifySelf: 'start' }} onClick={() => setMode('list')}>← All candidates</button>
    <div className="glass scroll-x"><table className="cmp"><thead><tr><th />{acd.cands.map(c => <th key={c.nm}>{c.sym} {c.nm.split(' ')[0]}</th>)}</tr></thead><tbody>
      {([['Party', (c: Cand) => c.party], ['Age', (c: Cand) => String(c.age)], ['Education', (c: Cand) => c.edu], ['Profession', (c: Cand) => c.prof], ['Assets', (c: Cand) => `₹${tot(c).toFixed(1)} Cr`], ['Liabilities', (c: Cand) => `₹${c.liab} Cr`], ['Cases', (c: Cand) => String(c.cases.length)]] as [string, (c: Cand) => string][]).map(([l, f]) => <tr key={l}><td>{l}</td>{acd.cands.map(c => <td key={c.nm}>{f(c)}</td>)}</tr>)}</tbody></table></div>
    <p className="faint">Self-declared figures from candidate affidavits (Form 26), via ECINET.</p></>)
  if (typeof mode === 'object') { const c = mode; return (<>
    <button className="chip" style={{ justifySelf: 'start' }} onClick={() => setMode('list')}>← All candidates</button>
    <div className="row"><span className="avatar" style={{ background: c.col, color: '#fff' }}>{c.sym}</span><div><b style={{ fontSize: 18 }}>{c.nm}</b><div className="muted">{c.party} · {c.nmLoc}</div></div></div>
    <div className="sec">Personal</div><div className="glass card"><div className="kv"><span>Age</span><span>{c.age}</span></div><div className="kv"><span>Profession</span><span>{c.prof}</span></div><div className="kv"><span>Education</span><span>{c.edu}</span></div></div>
    <div className="sec">Assets declared</div><div className="glass card"><div className="kv"><span>Movable</span><span>₹{c.mov} Cr</span></div><div className="kv"><span>Immovable</span><span>₹{c.immov} Cr</span></div><div className="kv"><span>Total</span><span>₹{tot(c).toFixed(1)} Cr</span></div><div className="kv"><span>Liabilities</span><span>₹{c.liab} Cr</span></div></div>
    <div className="sec">Criminal cases</div>{c.cases.length ? <div className="glass card">{c.cases.map(x => <div className="kv" key={x.s}><span>{x.s}</span><span className={'tag ' + (x.st.includes('Acquit') ? 'ok' : 'warn')}>{x.st}</span></div>)}</div> : <OkBar>None declared</OkBar>}
    <p className="faint">Source: candidate affidavit (Form 26) as published on ECINET. Figures self-declared.</p></>) }
  return (<>
    <div className="row between"><p className="muted">Affidavit summary · {acd.name} ({acd.no})</p><button className="chip" onClick={() => setMode('cmp')}>⇅ Compare all</button></div>
    {acd.cands.map(c => <button key={c.nm} className="glass cand" onClick={() => setMode(c)}>
      <div className="row"><span className="avatar" style={{ background: c.col, color: '#fff' }}>{c.sym}</span><div><b>{c.nm}</b><div className="faint">{c.party} · {c.age} yrs · {c.prof}</div></div></div>
      <div className="cells"><div className="cell"><small>Assets</small><b>₹{tot(c).toFixed(1)} Cr</b></div><div className="cell"><small>Cases</small><b style={{ color: c.cases.length ? 'var(--crit)' : 'var(--ok)' }}>{c.cases.length}</b></div><div className="cell"><small>Education</small><b>{c.edu}</b></div><div className="cell"><span className="tag acc">📄 Full affidavit</span></div></div></button>)}
    <span className="hint">{tile('candidate')}</span>
  </>)
}

/* ---------- 5 prep ---------- */
function Prep() {
  const { say, tr } = useApp(); const [slip, setSlip] = useState(false); const [pl, setPl] = useState(false)
  return (<>
    <p className="muted">Get ready before polling day — documents, a first-time guide, and your pledge to vote.</p>
    <div className="sec">🪪 {tr('Documents you can carry')}</div><div className="note">Carry your voter slip and ANY ONE of these photo IDs.</div>
    <div className="row" style={{ flexWrap: 'wrap' }}>{DOCS.map(d => <span key={d} className="chip">{d}</span>)}</div>
    <button className="btn primary" onClick={() => { setSlip(true); say('Voter photo slip generated (demo).') }}>🖨️ {tr('Get my voter slip')}</button>{slip && <OkBar>Voter photo slip generated (demo).</OkBar>}
    <div className="sec">🗳️ {tr('First-time voter — 4 steps')}</div><ol className="glass card steps">{FIRST.map(([a, b]) => <li key={a}><span><b>{a}</b><div className="faint">{b}</div></span></li>)}</ol>
    <div className="sec">✅ {tr('Do’s & don’ts')}</div><div className="glass card">{DONTS.map(d => <div className="kv" key={d}><span style={{ color: 'var(--ink)' }}>{d}</span></div>)}</div>
    <div className="sec">🤝 {tr('Pledge to vote')}</div><button className="btn primary" onClick={() => { setPl(true); say('🤝 Pledge recorded') }}>{tr('I pledge to vote')}</button>{pl && <OkBar>Thank you for pledging 🙏 Every vote counts — bring a friend along.</OkBar>}
  </>)
}

/* ---------- 6 calendar ---------- */
function Calendar() {
  const { say, tr } = useApp(); const [r, setR] = useState(false)
  return (<>
    <p className="muted">Key election dates for your constituency — set a reminder so you don’t miss polling day.</p>
    <div className="glass card"><Timeline items={CAL.map(([a, b, c]) => [a, b, c])} /></div>
    <button className="btn primary" onClick={() => setR(true)}>🔔 {tr('Remind me on poll day')}</button>{r && <OkBar>Reminder set — we’ll alert you the day before and on poll day.</OkBar>}
    <button className="btn ghost" onClick={() => say('Added to your calendar (demo).')}>🗓️ {tr('Add to my calendar')}</button>
  </>)
}

/* ---------- 7 access ---------- */
function Access() {
  const { tr } = useApp(); const [ref, setRef] = useState(''); const [el, setEl] = useState(''); const [age, setAge] = useState(''); const [pwd, setPwd] = useState(false)
  const opts = ['Wheelchair at the booth', 'Volunteer escort', 'Sign-language help', 'Priority entry (senior)']
  const check = () => { const a = Number(age); setEl(a >= 85 || pwd ? 'Eligible — Form 12D can be filed. A BLO will visit.' : 'Not eligible for home voting (85+ or PwD 40%+); booth support is available.') }
  return (<>
    <p className="muted">Saksham · request help before you arrive</p>
    <div className="note">This booth: ramp ✓ · wheelchair ✓ · Braille/AVIS ✓</div>
    <div className="row" style={{ flexWrap: 'wrap' }}>{opts.map((o, i) => <button key={o} className="chip" onClick={() => setRef(`Request logged — BLO & Saksham volunteer notified. Ref SAK-${4200 + i * 37}`)}>{tr(o)}</button>)}</div>
    {ref && <OkBar>{ref}</OkBar>}
    <div className="note">Audio-first — Mitra reads every screen aloud and takes voice answers.</div>
    <div className="glass card stack"><b>Home-voting eligibility (85+ / PwD 40%+)</b>
      <label className="f">Age<input className="inp" inputMode="numeric" value={age} onChange={e => setAge(e.target.value)} /></label>
      <label className="check"><input type="checkbox" checked={pwd} onChange={e => setPwd(e.target.checked)} />Person with disability (40%+)</label>
      <button className="btn primary" onClick={check}>{tr('Check eligibility')}</button>{el && <div className={'note ' + (el.startsWith('Eligible') ? '' : 'warn')}>{el}</div>}</div>
  </>)
}

/* ---------- 8 report ---------- */
function Report() {
  const { st, say, tr, setJourney } = useApp(); const [cat, setCat] = useState(''); const [ev, setEv] = useState(''); const [anon, setAnon] = useState(false); const [id, setId] = useState('')
  const cats = ['Cash / gift distribution', 'Posters without permission', 'Paid transport of voters', 'Intimidation / threats', 'Other']
  const capture = () => { const c = st === 'mh' ? '21.14°N, 79.08°E' : '26.85°N, 80.95°E'; setEv(`✓ Evidence attached (demo) · ${c} · ${new Date().toLocaleTimeString()}`) }
  const submit = () => { if (!cat) return say('Pick a category first'); setId('CVG-' + String(Math.floor(100000 + Math.random() * 899999))); say('Report filed. Flying squad notified.') }
  return (<>
    <p className="muted">Model Code of Conduct · routed to cVIGIL</p>
    <div className="sec">{tr('Select a category')}</div>
    <div className="row" style={{ flexWrap: 'wrap' }}>{cats.map(c => <button key={c} className={'chip' + (cat === c ? ' on' : '')} aria-pressed={cat === c} onClick={() => setCat(c)}>{tr(c)}</button>)}</div>
    <button className="dropzone" onClick={capture}><b>📷 Capture evidence</b><span className="hint">Live photo/video only · auto geo-tagged</span></button>{ev && <OkBar>{ev}</OkBar>}
    <label className="check"><input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} />{tr('Report anonymously')}</label>
    <button className="btn danger" onClick={submit}><ShieldAlert size={18} /> {tr('Submit report')}</button>
    {id && <div className="glass card stack"><OkBar>Report filed. Flying squad notified.</OkBar><div className="kv"><span>Tracking ID</span><b className="mono">{id}</b></div><div className="kv"><span>SLA</span><span className="tag warn">Target: 100 minutes</span></div><button className="btn ghost" onClick={() => setJourney('track')}>📬 {tr('Track this report')}</button></div>}
  </>)
  void GCATS
}

/* ---------- 9 track ---------- */
function Track() {
  const { tr } = useApp(); const [q, setQ] = useState('CVG-' + String(Math.floor(100000 + Math.random() * 899999))); const [show, setShow] = useState(false)
  useEffect(() => { const el = document.querySelector('[data-auto-track]') as HTMLElement | null; void el }, [])
  return (<>
    <label className="f">Enter your cVIGIL / grievance tracking ID<div className="row"><input className="inp mono" value={q} onChange={e => setQ(e.target.value)} placeholder="CVG-123456" /><button className="btn primary" data-auto-track onClick={() => setShow(true)}>{tr('Track')}</button></div></label>
    {show && <div className="glass card stack"><div className="row between"><b>{tr('Status')} · <span className="mono">{q}</span></b><span className="tag warn">Action taken</span></div>
      <Timeline items={[['Report received', 'Today · 11:04 AM', true], ['Assigned to Field Verification Team', 'Today · 11:09 AM', true], ['Field team reached location', 'Today · 11:38 AM', true], ['Action taken — materials removed', 'Today · 12:31 PM', true], ['Closed & citizen notified', 'Pending', false]]} />
      <div className="note">94% of reports in this constituency were actioned within the 100-minute target.</div></div>}
  </>)
}

/* ---------- 10 helpline ---------- */
function Helpline() {
  const { cfg, say, setJourney, tr } = useApp(); const [dial, setDial] = useState(false)
  const rows: [string, string, () => void][] = [['📱 Voter Helpline App', 'Open →', () => say('Opening the official portal… (demo)')], ['🌐 Voters’ Service Portal', 'Open →', () => say('Opening the official portal… (demo)')], ['🧾 Enrolment & corrections (Forms 6/7/8)', 'Go →', () => setJourney('enroll')], ['🚨 Report a violation (cVIGIL)', 'Go →', () => setJourney('report')], ['📬 Grievance status', 'Go →', () => setJourney('track')]]
  return (<>
    <p className="muted">Voter helpline & quick services</p>
    <button className="btn primary" onClick={() => setDial(true)}><Phone size={18} /> {tr('Call Voter Helpline 1950').replace('1950', cfg.helpline)}</button>{dial && <OkBar>Dialling {cfg.helpline}… (demo). Toll-free, in your language.</OkBar>}
    <button className="btn ghost" onClick={() => say('Voter slip downloaded (demo).')}>🖨️ {tr('Download voter slip')}</button>
    <div className="sec">🔗 {tr('Official voter services')}</div>
    <div className="glass card">{rows.map(([a, b, f]) => <div className="kv" key={a} style={{ alignItems: 'center' }}><span style={{ color: 'var(--ink)' }}>{a}</span><button className="chip" onClick={f}>{b}</button></div>)}</div>
  </>)
}

/* ---------- 11 results ---------- */
function Results() {
  const { cfg, acd, tr } = useApp(); const lead = acd.cands[0]; const hrs = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM']
  return (<>
    <div className="glass card stack"><div className="eyebrow">{tr('Live turnout')} · {acd.name}</div><div className="turnout">{cfg.turnout[8]}%</div><div className="faint">as of 3:00 PM</div><Meter pct={cfg.turnout[8]} /></div>
    <div className="glass card"><h3 style={{ marginBottom: 6 }}>{tr('Hourly turnout')}</h3>{hrs.map((h, i) => <div className="kv" key={h} style={{ alignItems: 'center' }}><span>{h}</span><span style={{ width: '60%' }}><Meter pct={cfg.turnout[i]} /></span><b className="mono">{cfg.turnout[i]}%</b></div>)}</div>
    <div className="note">Provisional, round-wise figures from the Voter Turnout feed — not final.</div>
    <div className="glass card stack"><b>Result (counting-day demo)</b><div className="row between"><span className="row"><span className="avatar" style={{ background: lead.col, color: '#fff' }}>{lead.sym}</span>{lead.nm} <span className="tag ok">Leading</span></span></div>
      <div className="kv"><span>Margin</span><span>+ {inFmt(8000 + acd.no.charCodeAt(0) * 53)} votes</span></div><div className="faint">Counting in progress · Round 12 of 24</div></div>
  </>)
}

/* ---------- 12 help (Mitra) ---------- */
function Help() {
  const { me, acd, booth, lang, pick, tr } = useApp()
  const first = me.nm.split(' ')[0]; const [rec, setRec] = useState(false); const [txt, setTxt] = useState(''); const end = useRef<HTMLDivElement>(null)
  const chips = lang === 'hi' ? ['मतदान में क्या ले जाऊँ?', 'मेरा मतदान दिवस कब?', 'क्या मेरा नाम सूची में है?', 'कतार कितनी लंबी है?'] : lang === 'mr' ? ['मतदानाला काय न्यावे?', 'माझा मतदान दिवस कधी?', 'माझे नाव यादीत आहे का?', 'रांग किती आहे?'] : ['What do I carry to vote?', 'When is my polling day?', 'Is my name on the list?', 'How long is the queue?']
  const ans = ['Carry your EPIC (Voter ID). If you don’t have it, any one of 12 approved photo IDs — Aadhaar, passport, licence, PAN and others — works.', `Polling in ${acd.name} is ${acd.pollDate}, 7:00 AM–6:00 PM. I can set a reminder.`, 'Share your EPIC or mobile and I’ll confirm your enrolment and booth instantly.', `The nearest booth (${booth.id}) is about ${booth.q} minutes right now. I can suggest a quieter slot.`]
  const [msgs, setMsgs] = useState<{ me?: boolean; t: string }[]>([{ t: `${pick({ en: 'Namaste', hi: 'नमस्ते', mr: 'नमस्कार', pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', ur: 'نمستے' })} ${first} 🙏 — ${pick({ en: 'I’m Mitra. Ask me about your booth, documents, dates or status.', hi: 'मैं मित्र हूँ। बूथ, दस्तावेज़, तिथि या स्थिति पूछें।', mr: 'मी मित्र आहे. बूथ, कागदपत्रे किंवा स्थिती विचारा.', pa: 'ਮੈਂ ਮਿੱਤਰ ਹਾਂ। ਬੂਥ, ਦਸਤਾਵੇਜ਼ ਜਾਂ ਸਥਿਤੀ ਪੁੱਛੋ।', ur: 'میں مِتر ہوں۔ بوتھ، دستاویزات یا حیثیت پوچھیں۔' })}` }])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs])
  const ask = (q: string, i = 3) => { setMsgs(m => [...m, { me: true, t: q }]); setTimeout(() => setMsgs(m => [...m, { t: ans[i] }]), 260) }
  return (<>
    <div className="glass card chat" style={{ minHeight: 220 }}>{msgs.map((m, i) => <div key={i} className={'bub ' + (m.me ? 'me' : 'bot')}>{m.t}</div>)}<div ref={end} /></div>
    <div className="row" style={{ flexWrap: 'wrap' }}>{chips.map((c, i) => <button key={c} className="chip" onClick={() => ask(c, i)}>{c}</button>)}</div>
    <div className="row"><input className="inp" placeholder={tr('Type your question…')} value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && txt.trim()) { ask(txt.trim()); setTxt('') } }} /><button className="iconbtn" aria-label="Send" onClick={() => { if (txt.trim()) { ask(txt.trim()); setTxt('') } }}><Send size={18} /></button></div>
    <button className={'mic' + (rec ? ' rec' : '')} onPointerDown={() => setRec(true)} onPointerUp={() => { setRec(false); ask(chips[1], 1) }} onPointerLeave={() => setRec(false)}>
      {rec ? <span className="wave"><i /><i /><i /><i /><i /></span> : <Mic size={22} />}{rec ? 'Listening…' : tr('Hold to speak')}</button>
  </>)
  void TILES
}
