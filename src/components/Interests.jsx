import { useEffect, useRef, useState } from 'react'
import { Layers, Sparkles, Plug, ShieldCheck, Workflow } from 'lucide-react'

const ITEMS = [
  { title: 'Apps that keep up as they grow', short: 'Growing apps', icon: Layers, note: 'Making apps that stay quick and easy to update as more people start using them.', art: 'bars' },
  { title: 'Working smarter with AI', short: 'Working with AI', icon: Sparkles, note: 'Using AI to brainstorm and track down bugs, while still checking the answers myself.', art: 'nodes' },
  { title: 'Connecting apps together', short: 'Connecting apps', icon: Plug, note: 'Getting different apps and services to share information without anyone retyping it.', art: 'link' },
  { title: 'Testing and quality', short: 'Testing', icon: ShieldCheck, note: 'Finding problems early, before the people using the app ever see them.', art: 'checks' },
  { title: 'Working well as a team', short: 'Teamwork', icon: Workflow, note: 'Sharing code, reviewing each other’s work, and keeping a group project on track.', art: 'loop' },
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
      <span className="ix-servers">{['Fast', 'Mobile-ready', 'Easy updates'].map((t, k) => <i key={t} style={{ '--k': k }}>{t}</i>)}</span>
    </span>
  )
  if (kind === 'nodes') return (
    <span className="ia ix-ai">
      <span className="ix-ask">Give me 3 ideas for the booking page</span>
      <span className="ix-reply"><small><i>✦</i> AI</small><span className="ix-ghost">1. Show open time slots first<br />2. Add a reminder text<br />3. Let users reschedule</span></span>
      <span className="ix-hint">✓ I picked #1 and #3</span>
    </span>
  )
  if (kind === 'link') return (
    <span className="ia ix-api">
      <span className="ix-req"><em>📅</em> Booking app: “New booking for Sat, 10 AM”</span>
      <span className="ix-wire"><i /></span>
      <span className="ix-res">
        <span className="ix-status"><i /> Calendar updated <small>just now</small></span>
        <span className="ix-note">✉️ Confirmation email sent to the customer</span>
      </span>
    </span>
  )
  if (kind === 'checks') return (
    <span className="ia ix-qa">
      {['Login rejects wrong password', 'Booking blocks double slots', 'Report totals match'].map((t, k) => (
        <span className="ix-case" key={t} style={{ '--k': k }}><i>✓</i>{t}</span>
      ))}
      <span className="ix-cov"><small>Checks passed</small><span><i /></span><b>3/3</b></span>
    </span>
  )
  return (
    <span className="ia ix-git">
      <svg viewBox="0 0 220 70" aria-hidden="true">
        <path className="ix-main" d="M8 50 H212" />
        <path className="ix-branch" d="M50 50 C70 50 70 18 90 18 H140 C160 18 160 50 180 50" />
        {[[8, 50], [50, 50], [90, 18], [140, 18], [180, 50], [212, 50]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="5" style={{ '--k': k }} />)}
      </svg>
      <span className="ix-pr"><b>New booking form</b> by Kert <em>Approved</em></span>
      <span className="ix-checks">{['Reviewed', 'Tested', 'Live'].map((t, k) => <i key={t} style={{ '--k': k }}>✓ {t}</i>)}</span>
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
