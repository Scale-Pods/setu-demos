import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CONFIG, TILES, UI, type AC, type Booth, type Lang, type StateCfg, type Voter } from './data'

export type Screen = 'scan' | 'home' | 'citizen' | 'officer' | 'platform'
const ACCENT2: Record<string, string> = { up: '#ff4f6d', uk: '#38bdf8', pb: '#818cf8', mh: '#f472b6' }
const safe = <V,>(fn: () => V, d: V): V => { try { return fn() } catch { return d } }

interface Ctx {
  screen: Screen; go: (s: Screen) => void
  journey: string | null; setJourney: (j: string | null) => void
  st: string; ac: string; cfg: StateCfg; acd: AC; me: Voter; booth: Booth
  setState: (k: string) => void; setAc: (k: string) => void
  lang: Lang; setLang: (l: Lang) => void
  pick: (o: Partial<Record<Lang, string>> & { en: string }) => string
  tr: (en: string) => string; ui: (k: string) => string; tile: (id: string) => string
  theme: 'dark' | 'light'; toggleTheme: () => void
  toast: string; say: (m: string) => void
  tour: number | null; setTour: (n: number | null) => void
  rev: number; bump: () => void
}
const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)
import { HI } from './data'

const readHash = (): Screen => { const h = location.hash.replace('#', ''); return h === 'citizen' || h === 'officer' || h === 'platform' ? h : 'scan' }

export function Provider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>(readHash)
  const [journey, setJourney] = useState<string | null>(null)
  const [st, setSt] = useState('up'); const [ac, setAcK] = useState('lucknow'); const [lang, setLangK] = useState<Lang>('en')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => safe(() => (localStorage.getItem('ms-theme') as 'dark' | 'light') || 'dark', 'dark'))
  const [toast, setToast] = useState(''); const [tour, setTour] = useState<number | null>(null); const [rev, setRev] = useState(0)

  const cfg = CONFIG[st]; const acd = cfg.acs[ac] ?? Object.values(cfg.acs)[0]
  const me = acd.voters[0]; const booth = acd.booths.find(b => b.id === me.bid) ?? acd.booths[0]

  useEffect(() => { const f = () => setScreen(readHash()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  useEffect(() => { document.documentElement.dataset.theme = theme; safe(() => localStorage.setItem('ms-theme', theme), undefined) }, [theme])
  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--accent', cfg.accent); r.style.setProperty('--accent-2', ACCENT2[st] ?? cfg.accent)
    r.dataset.lang = lang; r.dir = lang === 'ur' ? 'rtl' : 'ltr'
  }, [cfg, st, lang])

  const go = useCallback((s: Screen) => { location.hash = s === 'scan' || s === 'home' ? '' : s; setScreen(s); setJourney(null); scrollTo(0, 0) }, [])
  const say = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(t => (t === m ? '' : t)), 2800) }, [])
  const setLang = useCallback((l: Lang) => setLangK(l), [])
  const setState = useCallback((k: string) => {
    const c = CONFIG[k]; setSt(k); setAcK(Object.keys(c.acs)[0]); setLangK(l => (c.langs.includes(l) ? l : c.langs[0]))
  }, [])
  const setAc = useCallback((k: string) => setAcK(k), [])
  const pick = useCallback((o: Partial<Record<Lang, string>> & { en: string }) => o[lang] ?? o.en, [lang])
  const tr = useCallback((en: string) => (lang === 'hi' ? HI[en] ?? en : en), [lang])
  const ui = useCallback((k: string) => UI[k]?.[lang] ?? UI[k]?.en ?? k, [lang])
  const tile = useCallback((id: string) => { const t = TILES.find(x => x.id === id); return t ? t[lang] : id }, [lang])
  const toggleTheme = useCallback(() => setTheme(x => (x === 'dark' ? 'light' : 'dark')), [])
  const bump = useCallback(() => setRev(r => r + 1), [])

  const value = useMemo<Ctx>(() => ({ screen, go, journey, setJourney, st, ac, cfg, acd, me, booth, setState, setAc, lang, setLang, pick, tr, ui, tile, theme, toggleTheme, toast, say, tour, setTour, rev, bump }),
    [screen, go, journey, st, ac, cfg, acd, me, booth, setState, setAc, lang, setLang, pick, tr, ui, tile, theme, toggleTheme, toast, say, tour, rev, bump])
  return <C.Provider value={value}>{children}</C.Provider>
}
