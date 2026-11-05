export function inFmt(n: number): string {
  n = Math.round(n); const s = String(Math.abs(n)); let l3 = s.slice(-3); let rest = s.slice(0, -3)
  if (rest) l3 = ',' + l3
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return (n < 0 ? '-' : '') + rest + l3
}
export function hashStr(str: string): number { let s = 0; for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0; return s }
export function seeded(seed: string) { let s = hashStr(seed) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32 } }
export const qColor = (q: number) => (q >= 28 ? 'var(--crit)' : q >= 15 ? 'var(--warn)' : 'var(--ok)')
export const qLevel = (q: number) => (q >= 28 ? 'High' : q >= 15 ? 'Medium' : 'Low')
export const niceStep = (m: number) => { const raw = m / 4 || 1; const mag = 10 ** Math.floor(Math.log10(raw)); const n = raw / mag; const f = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10; return f * mag }

export function QR({ seed, size = '100%' }: { seed: string; size?: string }) {
  const rnd = seeded(seed); const N = 25; const cells: React.ReactElement[] = []
  const inFinder = (x: number, y: number) => (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && rnd() > 0.55) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />)
  const finder = (ox: number, oy: number) => (<g key={ox + '_' + oy}><rect x={ox} y={oy} width="7" height="7" /><rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" /><rect x={ox + 2} y={oy + 2} width="3" height="3" /></g>)
  return <svg viewBox="0 0 25 25" width={size} height={size} fill="#12102e" shapeRendering="crispEdges" role="img" aria-label="QR code">{cells}{finder(0, 0)}{finder(18, 0)}{finder(0, 18)}</svg>
}
