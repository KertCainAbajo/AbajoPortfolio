import { useEffect, useRef, useState } from 'react'
import { Layers, Sparkles, Plug, ShieldCheck, Workflow } from 'lucide-react'

const ITEMS = [
  { title: 'Scalable web and mobile applications', short: 'Scalable apps', icon: Layers, note: 'Building systems that stay fast and maintainable as users and data grow.', art: 'bars' },
  { title: 'AI-assisted development and productivity', short: 'AI-assisted dev', icon: Sparkles, note: 'Using AI tools to write, review and debug code faster without losing quality.', art: 'nodes' },
  { title: 'API development and integration', short: 'APIs & integration', icon: Plug, note: 'Designing clean APIs and connecting services so data flows where it is needed.', art: 'link' },
  { title: 'Software quality assurance and testing', short: 'QA & testing', icon: ShieldCheck, note: 'Catching issues early with structured testing and careful debugging.', art: 'checks' },
  { title: 'Modern full-stack development workflows', short: 'Full-stack workflows', icon: Workflow, note: 'Version control, reviews and tooling that keep a project moving smoothly.', art: 'loop' },
]

const reset = (a) => (a === null ? null : 0)

// Animated mini-demo per interest (illustrative sample content); plays each time a panel opens.
function Art({ kind }) {
  if (kind === 'bars') return (
    <span className="ia ix-scale">
      <span className="ix-card">
        <small>Active users</small>
        <b>12.4k <em>↑ 38%</em></b>
        <svg viewBox="0 0 200 50" aria-hidden="true"><path d="M0 44 C30 42 45 36 70 34 S110 22 130 20 S170 8 200 4" /></svg>
      </span>
      <span className="ix-servers">{['srv-1', 'srv-2', 'srv-3'].map((t, k) => <i key={t} style={{ '--k': k }}>{t}</i>)}<em>p95 · 42 ms</em></span>
    </span>
  )
  if (kind === 'nodes') return (
    <span className="ia ix-ai">
      <span className="ix-editor">
        <span><b className="tk-k">function</b> <b className="tk-n">total</b>(cart) {'{'}</span>
        <span className="ix-ghost">{'  '}<b className="tk-k">return</b> cart.<b className="tk-n">reduce</b>(addPrice, <b className="tk-a">0</b>)</span>
        <span>{'}'}</span>
      </span>
      <span className="ix-hint"><i>✦</i> Suggestion · <kbd>Tab</kbd> to accept</span>
    </span>
  )
  if (kind === 'link') return (
    <span className="ia ix-api">
      <span className="ix-req"><em>GET</em> /api/bookings/42</span>
      <span className="ix-wire"><i /></span>
      <span className="ix-res">
        <span className="ix-status"><i /> 200 OK <small>86 ms</small></span>
        <code>{'{'} <b className="tk-a">"id"</b>: <b className="tk-n">42</b>, <b className="tk-a">"status"</b>: <b className="tk-t">"confirmed"</b> {'}'}</code>
      </span>
    </span>
  )
  if (kind === 'checks') return (
    <span className="ia ix-qa">
      {['Login rejects wrong password', 'Booking blocks double slots', 'Report totals match'].map((t, k) => (
        <span className="ix-case" key={t} style={{ '--k': k }}><i>✓</i>{t}</span>
      ))}
      <span className="ix-cov"><small>Coverage</small><span><i /></span><b>92%</b></span>
    </span>
  )
  return (
    <span className="ia ix-git">
      <svg viewBox="0 0 220 70" aria-hidden="true">
        <path className="ix-main" d="M8 50 H212" />
        <path className="ix-branch" d="M50 50 C70 50 70 18 90 18 H140 C160 18 160 50 180 50" />
        {[[8, 50], [50, 50], [90, 18], [140, 18], [180, 50], [212, 50]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="5" style={{ '--k': k }} />)}
      </svg>
      <span className="ix-pr"><b>PR #12</b> feature/booking-form <em>Merged</em></span>
      <span className="ix-checks">{['lint', 'tests', 'build', 'deploy'].map((t, k) => <i key={t} style={{ '--k': k }}>✓ {t}</i>)}</span>
    </span>
  )
}

// Expanding panels: one is open at a time; hover, keyboard focus or tap opens one,
// clicking the open one closes it. Leaving the row or scrolling it out of view
// returns to the first panel, unless the user closed them all. After a click-close,
// hover stays off until the pointer leaves, so panels sliding under it don't reopen.
export default function Interests() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const held = useRef(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) setActive(reset) }, { threshold: 0 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div className="interest-panels reveal" ref={ref} onMouseLeave={() => { held.current = false; setActive(reset) }}>
      {ITEMS.map((item, i) => {
        const Icon = item.icon
        const open = active === i
        return (
          <button type="button" className="card interest-panel" data-open={open || undefined} key={item.title}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !held.current) setActive(i) }}
            onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) setActive(i) }}
            onClick={() => { held.current = active === i; setActive(held.current ? null : i) }} aria-expanded={open}>
            <span className="ip-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="ip-vertical" aria-hidden="true">{item.short}</span>
            <span className="ip-body">
              <span className="icon-tile"><Icon size={20} /></span>
              <strong>{item.title}</strong>
              <small>{item.note}</small>
            </span>
            <Art kind={item.art} />
          </button>
        )
      })}
    </div>
  )
}
