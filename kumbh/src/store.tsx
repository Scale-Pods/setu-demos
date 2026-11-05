import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MELAS, SEED_REPORTS, type Lang, type Mela, T } from './data'

export type Route = 'home' | 'scan' | 'citizen' | 'volunteer' | 'officer' | 'platform'
const ROUTES: Route[] = ['home', 'scan', 'citizen', 'volunteer', 'officer', 'platform']

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
const safe = <V,>(fn: () => V, d: V): V => { try { return fn() } catch { return d } }

export interface Report { id: string; text: string; ago: string; verified: boolean }
export interface Sevak { name: string; phone: string; post: string }

interface Ctx {
  route: Route; go: (r: Route) => void
  lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string
  theme: 'dark' | 'light'; toggleTheme: () => void
  mela: Mela; setMela: (id: string) => void; zone: string; setZone: (z: string) => void
  ghats: { code: string; name: string; pct: number }[]
  kpi: { onsite: number; wait: number; lost: number; sos: number; fresh: number }
  hours: { h: string; density: number; wait: number }[]
  toast: string; say: (m: string) => void
  reports: Report[]; addReport: (text: string, verified?: boolean) => string
  sevak: Sevak | null; setSevak: (s: Sevak | null) => void
  tour: number | null; setTour: (n: number | null) => void
  citizenView: string | null; setCitizenView: (v: string | null) => void
  open: Record<string, 'open' | 'soon' | 'closed'>; setOpen: (id: string, v: 'open' | 'soon' | 'closed') => void
  served: Record<string, number>; bump: (id: string, n: number) => void
}

const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)

function readRoute(): Route {
  const h = location.hash.replace('#', '') as Route
  return ROUTES.includes(h) ? h : 'home'
}

export function Provider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(readRoute)
  const [lang, setLang] = useState<Lang>('en')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => safe(() => (localStorage.getItem('kumbh-theme') as 'dark' | 'light') || 'dark', 'dark'))
  const [melaId, setMelaId] = useState('haridwar')
  const mela = MELAS.find(m => m.id === melaId)!
  const [zone, setZone] = useState(MELAS[0].zones[0])
  const [toast, setToast] = useState('')
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS)
  const [sevak, setSevak] = useState<Sevak | null>(null)
  const [tour, setTour] = useState<number | null>(null)
  const [citizenView, setCitizenView] = useState<string | null>(null)
  const [open, setOpenMap] = useState<Ctx['open']>({ f1: 'open', f2: 'open', f3: 'soon', f4: 'open' })
  const [served, setServed] = useState<Record<string, number>>({ f1: 8420, f2: 12100, f3: 0, f4: 5310 })

  const [ghats, setGhats] = useState([
    { code: 'G-HKP', name: 'Har Ki Pauri (Brahmakund)', pct: 94 },
    { code: 'G-SUB', name: 'Subhash Ghat', pct: 72 },
    { code: 'G-KUSH', name: 'Kushavart Ghat', pct: 36 },
  ])
  const [kpi, setKpi] = useState({ onsite: 1840000, wait: 14, lost: 12, sos: 3, fresh: 62 })
  const hours = useMemo(() => [
    ['4a', 18, 4], ['5a', 34, 6], ['6a', 61, 9], ['7a', 83, 15], ['8a', 99, 24], ['9a', 94, 21], ['10a', 78, 14], ['11a', 62, 11], ['12p', 55, 9], ['1p', 48, 8], ['2p', 52, 9], ['3p', 58, 10],
  ].map(([h, density, wait]) => ({ h: h as string, density: density as number, wait: wait as number })), [])

  useEffect(() => {
    const on = () => setRoute(readRoute())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safe(() => localStorage.setItem('kumbh-theme', theme), undefined)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.lang = lang
    document.documentElement.style.setProperty('--accent', mela.accent)
    document.documentElement.style.setProperty('--accent-2', mela.accent2)
  }, [lang, mela])

  useEffect(() => {
    const id = setInterval(() => {
      setGhats(g => g.map(x => ({ ...x, pct: clamp(Math.round(x.pct + (Math.random() - 0.5) * 6), 20, 99) })))
      setKpi(k => ({
        onsite: k.onsite + Math.round((Math.random() - 0.4) * 9000),
        wait: clamp(k.wait + Math.round((Math.random() - 0.5) * 3), 6, 30),
        lost: k.lost, sos: k.sos, fresh: clamp(k.fresh + Math.round((Math.random() - 0.45) * 5), 30, 95),
      }))
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const go = useCallback((r: Route) => { location.hash = r === 'home' ? '' : r; setRoute(r); setCitizenView(null); scrollTo(0, 0) }, [])
  const say = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(t => (t === m ? '' : t)), 2400) }, [])
  const t = useCallback((k: string) => T[k]?.[lang] ?? T[k]?.en ?? k, [lang])
  const setMela = useCallback((id: string) => {
    setMelaId(id); const m = MELAS.find(x => x.id === id)!; setZone(m.zones[0]); say(`Loaded ${m.name}`)
  }, [say])
  const addReport = useCallback((text: string, verified = false) => {
    const id = 'PR-' + (4486 + Math.floor(Math.random() * 400))
    setReports(r => [{ id, text, ago: 'just now', verified }, ...r]); return id
  }, [])
  const setOpen = useCallback((id: string, v: 'open' | 'soon' | 'closed') => setOpenMap(o => ({ ...o, [id]: v })), [])
  const bump = useCallback((id: string, n: number) => setServed(s => ({ ...s, [id]: Math.max(0, (s[id] ?? 0) + n) })), [])
  const toggleTheme = useCallback(() => setTheme(x => (x === 'dark' ? 'light' : 'dark')), [])

  const value: Ctx = {
    route, go, lang, setLang, t, theme, toggleTheme, mela, setMela, zone, setZone, ghats, kpi, hours, toast, say,
    reports, addReport, sevak, setSevak, tour, setTour, citizenView, setCitizenView, open, setOpen, served, bump,
  }
  return <C.Provider value={value}>{children}</C.Provider>
}
