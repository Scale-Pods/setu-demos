import { BadgeCheck, BellRing, Check, ChevronLeft, ChevronRight, Clock3, Copy, Paperclip, Volume2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from './store'
import { Meter, Timeline } from './ui'
import { canSpeak, qColor, speak } from './utils'

const HOURS = ['7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6']
const HOUR_LABEL = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM']
const NOW = 8 // demo clock: 3 PM, matching the turnout "as of 3:00 PM"

/* ---------- Best time to vote ---------- */
export function BestTime() {
  const { cfg, booth, say, lang } = useApp()
  const [set, setSet] = useState(false)
  const { waits, best, saved } = useMemo(() => {
    const avg = cfg.wait.reduce((a, b) => a + b, 0) / cfg.wait.length
    const waits = cfg.wait.map(w => Math.max(2, Math.round(w * (booth.q / avg))))
    let best = NOW
    for (let i = NOW; i < waits.length; i++) if (waits[i] < waits[best]) best = i
    return { waits, best, saved: waits[NOW] - waits[best] }
  }, [cfg, booth])
  const max = Math.max(...waits)
  const msg = best === NOW ? `Now is a good time — about ${waits[NOW]} min wait.` : `Best time left today: ${HOUR_LABEL[best]} — about ${waits[best]} min, ${saved} min less than now.`
  return (
    <div className="glass card stack" data-tour="besttime">
      <div className="row between"><b className="row" style={{ gap: 8 }}><Clock3 size={18} color="var(--accent)" /> Best time to vote</b><span className="tag" style={{ color: qColor(waits[NOW]) }}>Now ~{waits[NOW]} min</span></div>
      <div className="bt-bars" role="img" aria-label="Expected queue wait by hour">
        {waits.map((w, i) => (
          <div key={i} className={'bt-col' + (i < NOW ? ' past' : '') + (i === best ? ' best' : '') + (i === NOW ? ' now' : '')}>
            <span className="bt-v">{w}</span>
            <i style={{ height: Math.max(8, (w / max) * 76), background: qColor(w) }} />
            <small>{HOURS[i]}</small>
          </div>
        ))}
      </div>
      <div className="note" style={{ background: 'color-mix(in srgb, var(--ok) 12%, transparent)', borderColor: 'color-mix(in srgb, var(--ok) 30%, transparent)' }}>{msg}</div>
      <div className="row">
        <button className="btn primary sm grow" disabled={set} onClick={() => { setSet(true); say(`🔔 Reminder set for ${HOUR_LABEL[best]} on poll day`) }}><BellRing size={16} /> {set ? 'Reminder set' : `Remind me at ${HOUR_LABEL[best]}`}</button>
        {canSpeak() && <button className="btn ghost sm" aria-label="Read aloud" onClick={() => speak(msg, lang)}><Volume2 size={16} /> Listen</button>}
      </div>
      <div className="faint">Estimated from today’s hourly pattern for this booth. Demo clock: 3:00 PM.</div>
    </div>
  )
}

/* ---------- Register / correct details (Forms 6, 7, 8) ---------- */
type FormKey = 'f6' | 'f8' | 'f7'
const FORMS: Record<FormKey, { title: string; sub: string; code: string; docs: string[] }> = {
  f6: { title: 'New voter registration', sub: 'Form 6 · for citizens turning 18 or moving constituency', code: 'F6', docs: ['Passport photo', 'Age proof', 'Address proof'] },
  f8: { title: 'Correct my details', sub: 'Form 8 · name, address, photo, age or replace EPIC', code: 'F8', docs: ['Supporting document'] },
  f7: { title: 'Delete / object to an entry', sub: 'Form 7 · deceased, shifted or duplicate entry', code: 'F7', docs: ['Supporting document'] },
}
export const regPreset: { form: FormKey | null } = { form: null }
const FIX = ['Name', 'Address', 'Photo', 'Age / DOB', 'Replace EPIC']

export function Register() {
  const { me, acd, say } = useApp()
  const [form, setForm] = useState<FormKey | null>(() => { const f = regPreset.form; regPreset.form = null; return f })
  const [step, setStep] = useState(form ? 1 : 0)
  const [name, setName] = useState(() => (form && form !== 'f6' ? me.nm : ''))
  const [dob, setDob] = useState(''); const [addr, setAddr] = useState(''); const [mob, setMob] = useState(''); const [fix, setFix] = useState('Name')
  const [attached, setAttached] = useState<string[]>([]); const [ok, setOk] = useState(false); const [ref, setRef] = useState(''); const [err, setErr] = useState('')
  const f = form ? FORMS[form] : null
  const age = dob ? Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000) : null

  const choose = (k: FormKey) => { setForm(k); setName(k === 'f6' ? '' : me.nm); setStep(1); setErr('') }
  const validate = () => {
    if (!name.trim()) return 'Enter your full name.'
    if (form === 'f6' && (!dob || age === null)) return 'Enter your date of birth.'
    if (form === 'f6' && age !== null && age < 18) return 'You must be 18 or older on the qualifying date to register.'
    if (!addr.trim()) return 'Enter your address.'
    if (!/^[6-9]\d{9}$/.test(mob)) return 'Enter a valid 10-digit mobile number.'
    return ''
  }
  const next = () => {
    if (step === 1) { const e = validate(); setErr(e); if (e) return }
    if (step === 2 && f && attached.length < f.docs.length) { setErr(`Attach ${f.docs.length > 1 ? 'all documents' : 'the document'} to continue (demo upload).`); return }
    setErr(''); setStep(s => s + 1)
  }
  const submit = () => {
    if (!ok) { setErr('Please tick the declaration.'); return }
    setRef(`${f!.code}-${String(Math.floor(100000 + Math.random() * 899999))}`); setStep(4); say('Application submitted')
  }
  const copy = async () => { try { await navigator.clipboard.writeText(ref); say('✓ Reference copied') } catch { say('Could not copy — long-press to copy') } }
  const toggleDoc = (d: string) => setAttached(a => (a.includes(d) ? a.filter(x => x !== d) : [...a, d]))
  const stepNames = ['Choose form', 'Your details', 'Documents', 'Review']
  const back = () => { setErr(''); if (step === 1) { setStep(0); setForm(null) } else setStep(s => s - 1) }

  if (step === 0 || !f) return (<>
    <p className="muted">Register to vote or fix your voter-roll entry — all in one place. Choose what you need.</p>
    {(Object.keys(FORMS) as FormKey[]).map(k => (
      <button key={k} className="glass cand" onClick={() => choose(k)}><div className="row between"><div><b>{FORMS[k].title}</b><div className="faint">{FORMS[k].sub}</div></div><ChevronRight size={20} /></div></button>
    ))}
    <div className="note">Applications go to the Electoral Registration Officer for {acd.name}. BLO field verification may follow.</div>
  </>)

  if (step === 4) return (<>
    <div className="okbar"><BadgeCheck size={18} />Application submitted — {f.title}</div>
    <div className="glass card stack">
      <div className="kv"><span>Reference</span><b className="mono">{ref}</b></div>
      <div className="kv"><span>Applicant</span><span>{name}</span></div>
      <div className="kv"><span>Constituency</span><span>{acd.name} ({acd.no})</span></div>
      <button className="btn ghost sm" onClick={copy}><Copy size={16} /> Copy reference</button>
    </div>
    <div className="glass card stack"><b>What happens next</b><Timeline items={[['Submitted online', 'Just now', true], ['BLO field verification', 'Within 7 days', false], ['ERO decision', 'Within 15 days', false], ['Updated roll / e-EPIC', 'You’ll get an SMS', false]]} /></div>
    <button className="btn ghost" onClick={() => { setStep(0); setForm(null); setAttached([]); setOk(false); setDob(''); setAddr(''); setMob('') }}>Start another application</button>
  </>)

  return (<>
    <div className="stack" style={{ gap: 8 }}>
      <div className="row between"><b>{f.title}</b><span className="faint mono">Step {step} of 3 · {stepNames[step]}</span></div>
      <Meter pct={(step / 3) * 100} />
    </div>
    {step === 1 && (<div className="glass card stack">
      {form === 'f8' && <div><div className="faint" style={{ marginBottom: 6 }}>What needs correcting?</div><div className="row" style={{ flexWrap: 'wrap' }}>{FIX.map(x => <button key={x} className={'chip' + (fix === x ? ' on' : '')} aria-pressed={fix === x} onClick={() => setFix(x)}>{x}</button>)}</div></div>}
      <label className="f">Full name<input className="inp" value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>
      {(form === 'f6' || fix === 'Age / DOB') && <label className="f">Date of birth<input className="inp" type="date" value={dob} onChange={e => setDob(e.target.value)} />{form === 'f6' && age !== null && <span className="hint">Age: {age} years{age < 18 ? ' — not yet eligible' : ' — eligible'}</span>}</label>}
      {form !== 'f6' && <div className="kv"><span>EPIC</span><span className="mono">{me.epic}</span></div>}
      <label className="f">{form === 'f7' ? 'Entry details / reason' : 'Address'}<textarea className="inp" rows={3} value={addr} onChange={e => setAddr(e.target.value)} /></label>
      <label className="f">Mobile number<input className="inp mono" inputMode="numeric" maxLength={10} value={mob} onChange={e => setMob(e.target.value.replace(/\D/g, ''))} placeholder="10-digit number" /></label>
    </div>)}
    {step === 2 && (<div className="stack">
      <div className="note">Attach clear photos of your documents. (Demo — nothing is uploaded.)</div>
      {f.docs.map(d => { const on = attached.includes(d); return <button key={d} className="dropzone" onClick={() => toggleDoc(d)}><b className="row" style={{ gap: 8 }}>{on ? <Check size={18} color="var(--ok)" /> : <Paperclip size={18} />} {d}</b><span className="hint">{on ? 'Attached (demo) — tap to remove' : 'Tap to attach'}</span></button> })}
    </div>)}
    {step === 3 && (<div className="glass card stack">
      <div className="kv"><span>Form</span><span>{f.sub.split(' · ')[0]}</span></div>
      <div className="kv"><span>Name</span><span>{name}</span></div>
      {dob && <div className="kv"><span>Date of birth</span><span>{dob}</span></div>}
      <div className="kv"><span>{form === 'f7' ? 'Details' : 'Address'}</span><span style={{ textAlign: 'right' }}>{addr}</span></div>
      <div className="kv"><span>Mobile</span><span className="mono">{mob}</span></div>
      <div className="kv"><span>Documents</span><span>{attached.length} attached</span></div>
      <label className="check"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />I declare that the information given is true to the best of my knowledge.</label>
    </div>)}
    {err && <div className="note warn" role="alert">{err}</div>}
    <div className="row">
      <button className="btn ghost" onClick={back}><ChevronLeft size={18} /> Back</button>
      {step < 3 ? <button className="btn primary grow" onClick={next}>Continue <ChevronRight size={18} /></button> : <button className="btn primary grow" onClick={submit}>Submit application</button>}
    </div>
  </>)
}
