import { useEffect, useRef, useState } from 'react'

const CYCLE_MS = 5000

// One animated mini-demo per skill (illustrative sample content)
function Scene({ index }) {
  switch (index) {
    // 01 Websites & web apps: a working dashboard with a menu, live numbers and a request list
    case 0: return (
      <div className="sc sx-web">
        <div className="sx-window">
          <div className="sx-bar"><span className="sx-dots"><i /><i /><i /></span><span className="sx-url">rpic.app/requests</span></div>
          <div className="sx-split">
            <div className="sx-side">
              <b>RPIC</b>
              {['Dashboard', 'Requests', 'Schedule', 'Reports'].map((t, k) => <span key={t} className={k === 1 ? 'on' : ''} style={{ '--k': k }}>{t}</span>)}
            </div>
            <div className="sx-app">
              <div className="sx-stats">{[['Requests', '128'], ['Approved', '96'], ['Pending', '32']].map(([l, v], k) => <span key={l} style={{ '--k': k + 3 }}><small>{l}</small><b>{v}</b></span>)}</div>
              <div className="sx-table">{['IP-0412 · Patent', 'IP-0413 · Copyright', 'IP-0414 · Trademark'].map((r, k) => <span key={r} style={{ '--k': k + 6 }}>{r}<em className={k === 1 ? 'wait' : ''}>{k === 1 ? 'Review' : 'Done'}</em></span>)}</div>
            </div>
          </div>
        </div>
      </div>
    )
    // 02 Mobile application development: a real-looking habit app with a push notification
    case 1: return (
      <div className="sc sx-mobile">
        <div className="sx-phone">
          <span className="sx-notch" />
          <div className="sx-screen">
            <div className="sx-app-head"><small>Good morning 👋</small><b>Today’s habits</b></div>
            <div className="sx-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /><circle className="fill" cx="18" cy="18" r="15" /></svg><b>3/4</b></div>
            {[['♻️', 'Sort recyclables', true], ['🥤', 'Bring a tumbler', true], ['🚶', 'Walk to class', true], ['💡', 'Lights off', false]].map(([e, t, done], k) => (
              <span className={`sx-habit ${done ? 'done' : ''}`} key={t} style={{ '--k': k }}><i>{e}</i>{t}<em>{done ? '✓' : ''}</em></span>
            ))}
            <div className="sx-nav"><i className="on" /><i /><i /><i /></div>
          </div>
          <div className="sx-toast"><b>TechSustain</b>You saved 3 plastic cups this week!</div>
        </div>
      </div>
    )
    // 03 Working with AI: asking for help in plain words, then checking the answer
    case 2: return (
      <div className="sc sx-ai">
        <span className="sx-msg me" style={{ '--k': 0 }}>Why does the cart total show “NaN”?</span>
        <span className="sx-msg bot" style={{ '--k': 1 }}>
          <small><i>✦</i> AI assistant</small>
          The prices are saved as text, so they can’t be added up. Turn them into numbers first.
        </span>
        <span className="sx-msg me" style={{ '--k': 2 }}>Checked it. That was it, thanks!</span>
        <span className="sx-msg bot typing" style={{ '--k': 3 }}><i /><i /><i /></span>
      </div>
    )
    // 04 System design & architecture: labelled request flow between services
    case 3: return (
      <div className="sc sx-system">
        <svg viewBox="0 0 400 240" aria-hidden="true">
          {[['M80 120 L200 60', 0], ['M80 120 L200 180', 1], ['M200 60 L320 120', 2], ['M200 180 L320 120', 3]].map(([d, k]) => <g key={k}><path className="sx-edge" d={d} /><path className="sx-pulse" d={d} style={{ '--k': k }} /></g>)}
        </svg>
        {[['🌐', 'Website', 'what people see', 20, 50], ['⚙️', 'Server', 'does the work', 50, 25], ['🔐', 'Login', 'keeps accounts safe', 50, 75], ['🗄️', 'Database', 'saves everything', 80, 50]].map(([e, t, s, x, y], k) => (
          <span className="sx-node" key={t} style={{ left: `${x}%`, top: `${y}%`, '--k': k }}><i>{e}</i><b>{t}</b><small>{s}</small></span>
        ))}
        
      </div>
    )
    // 05 Software testing & debugging: a test run that finds and fixes a failure
    case 4: return (
      <div className="sc sx-test">
        <div className="sx-term">
          <span className="sx-cmd" style={{ '--k': 0 }}>Running checks…</span>
          {['✓ Wrong password is rejected', '✓ A booking saves the right time', '✓ Admin can approve a request', 'Empty cart shows a ₱0 total', '✓ Report downloads as PDF'].map((t, k) => (
            <span key={t} style={{ '--k': k + 1 }} className={k === 3 ? 'fail' : 'pass'}>{k === 3 ? <><b className="x">✕</b><b className="ok">✓</b></> : null}{k === 3 ? ' ' + t : t}</span>
          ))}
          <span className="sx-sum" style={{ '--k': 6 }}><b>All 5 checks passed</b></span>
        </div>
        <span className="sx-bugfix"><i>🐞</i> Bug fixed: an empty cart showed <em>NaN</em></span>
      </div>
    )
    // 06 Problem solving: a real need broken down into steps, ticked off in turn
    case 5: return (
      <div className="sc sx-solve">
        <span className="sx-problem">“Students wait in long lines to book a mechanic.”</span>
        <div className="sx-steps">{['Understand the need', 'Break it into tasks', 'Build a booking flow', 'Test with users', 'Ship & improve'].map((t, k) => (
          <span key={t} style={{ '--k': k }}><i>{k + 1}</i>{t}</span>
        ))}</div>
      </div>
    )
    // 07 Technical documentation & reporting: a user guide being written, then reviewed
    default: return (
      <div className="sc sx-docs">
        <div className="sx-page">
          <small>Booking System · v1.0</small>
          <h5>User Guide</h5>
          <b>1. Overview</b>
          <p>This guide explains how students book a mechanic and track the status of a request.</p>
          <b>2. Booking a service</b>
          <ol><li>Choose a service</li><li>Pick a date &amp; time</li><li>Confirm the booking</li></ol>
          <span className="sx-stamp">✓ Reviewed</span>
        </div>
        <span className="sx-pen">✎</span>
      </div>
    )
  }
}

// Feature tabs: auto-advance while visible, pause on hover, click to jump.
export default function Skills({ skills }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const t = window.setTimeout(() => setActive((a) => (a + 1) % skills.length), CYCLE_MS)
    return () => window.clearTimeout(t)
  }, [active, paused, inView, skills.length])

  const current = skills[active]
  const Icon = current.icon
  return (
    <div className="skills-show" ref={ref} data-paused={paused || !inView || undefined} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="skill-tabs reveal" role="tablist" aria-label="Skills">
        {skills.map(({ name, icon: TabIcon }, i) => (
          <button type="button" role="tab" aria-selected={active === i} className="skill-tab" data-on={active === i || undefined} key={name} onClick={() => setActive(i)} onFocus={() => setActive(i)}>
            <span className="skill-tab-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="skill-tab-icon"><TabIcon size={16} /></span>
            <span className="skill-tab-name">{name}</span>
            {active === i && <span className="skill-tab-bar" key={`bar-${active}`} style={{ animationDuration: `${CYCLE_MS}ms` }} />}
          </button>
        ))}
      </div>

      <div className="card skill-stage reveal" role="tabpanel">
        <div className="skill-stage-visual" key={active}><Scene index={active} /></div>
        <div className="skill-stage-copy" key={`c${active}`}>
          <span className="icon-tile"><Icon size={20} /></span>
          <div>
            <span className="card-kicker">Skill {String(active + 1).padStart(2, '0')} / {String(skills.length).padStart(2, '0')}</span>
            <h3>{current.name}</h3>
            <p>{current.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
