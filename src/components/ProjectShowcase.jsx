import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Globe, Maximize2, MousePointer2, Smartphone } from 'lucide-react'
import CrochetDemo, { CrochetUrl } from './CrochetDemo.jsx'
import GymDemo from './GymDemo.jsx'
import MechanicDemo, { MechanicUrl } from './MechanicDemo.jsx'
import PosDemo from './PosDemo.jsx'
import ProjectModal from './ProjectModal.jsx'
import { scrollToY } from '../lib/smoothScroll.js'

// Animated, illustrative UI sketch for each project (not a real screenshot).
function MockScreen({ variant }) {
  switch (variant) {
    case 'tracker':
      return (
        <div className="ui ui-tracker">
          <div className="ui-row ui-head"><i /><i /><i /></div>
          {['Submitted', 'In review', 'Approved', 'In review'].map((s, i) => (
            <div className="ui-row" key={i} style={{ '--r': i }}><b /><i /><span className={`ui-status s-${s.replace(' ', '').toLowerCase()}`}>{s}</span></div>
          ))}
          <div className="ui-progress"><i /></div>
        </div>
      )
    case 'calendar':
      return (
        <div className="ui ui-calendar">
          <div className="ui-cal-head"><b /><i /></div>
          <div className="ui-cal-grid">{Array.from({ length: 28 }, (_, d) => <span key={d} className={[3, 9, 10, 17, 24].includes(d) ? 'on' : ''} style={{ '--r': d }} />)}</div>
        </div>
      )
    case 'booking':
      return (
        <div className="ui ui-booking">
          <div className="ui-services">{[0, 1, 2].map((i) => <span key={i} className={i === 1 ? 'on' : ''}><i /><b /></span>)}</div>
          <div className="ui-slots">{Array.from({ length: 8 }, (_, i) => <span key={i} className={i === 5 ? 'on' : ''} style={{ '--r': i }} />)}</div>
          <div className="ui-cta" />
        </div>
      )
    case 'shop':
      return (
        <div className="ui ui-shop">
          {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} style={{ '--r': i }}><i /><b /><em /></span>)}
          <div className="ui-cart"><i />3</div>
        </div>
      )
    case 'scan':
      return (
        <div className="ui ui-scan">
          <div className="ui-card-id"><i /><div><b /><em /></div><span className="ui-qr" /></div>
          <div className="ui-beam" />
          <div className="ui-log">{[0, 1, 2].map((i) => <span key={i} style={{ '--r': i }}><i /><b /></span>)}</div>
        </div>
      )
    case 'habit':
      return (
        <div className="ui ui-habit">
          <div className="ui-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /><circle className="ring-fill" cx="18" cy="18" r="15" /></svg><b>72%</b></div>
          {[0, 1, 2].map((i) => <span className="ui-habit-row" key={i} style={{ '--r': i }}><i /><b /><em /></span>)}
        </div>
      )
    default:
      return (
        <div className="ui ui-log-chart">
          <div className="ui-bars">{[40, 65, 30, 80, 55, 70, 45].map((h, i) => <span key={i} style={{ '--h': `${h}%`, '--r': i }} />)}</div>
          {[0, 1].map((i) => <span className="ui-habit-row" key={i} style={{ '--r': i }}><i /><b /><em /></span>)}
        </div>
      )
  }
}

function Device({ project }) {
  if (project.platform === 'mobile') {
    return (
      <div className="device phone">
        <span className="phone-notch" />
        <div className="device-screen"><div className="app-bar"><b>{project.title}</b><i /></div><MockScreen variant={project.mock} /></div>
        <span className="ui-cursor" />
      </div>
    )
  }
  return (
    <div className="device browser">
      <div className="browser-bar"><span className="dots"><i /><i /><i /></span>{project.demo === 'crochet' ? <CrochetUrl /> : project.demo === 'mechanic' ? <MechanicUrl /> : <span className="url">{project.live ? new URL(project.live).host : project.url}</span>}</div>
      {project.demo === 'crochet' ? <CrochetDemo /> : project.demo === 'gym' ? <GymDemo /> : project.demo === 'mechanic' ? <MechanicDemo /> : project.demo === 'pos' ? <PosDemo /> : (
        <>
          <div className="device-screen">
            <aside className="ui-side"><b>{project.symbol}</b>{[0, 1, 2, 3].map((i) => <i key={i} className={i === 0 ? 'on' : ''} />)}</aside>
            <MockScreen variant={project.mock} />
          </div>
          <span className="ui-cursor" />
        </>
      )}
    </div>
  )
}

// Project theater: the active project's screen stands centre stage, its neighbours angled to either side
// in 3D. Drag/swipe the stage (it follows the pointer, then settles on the nearest project), click a side
// project, use the arrows, the arrow keys or the strip below. Clicking the centre screen opens the details.
// Slide transforms are set inline from one position value per slide, so dragging only moves composited layers.
const STEP = 0.58 // how far apart neighbours sit, as a fraction of a slide's width

function place(p) {
  const a = Math.abs(p)
  return {
    transform: `translate3d(calc(-50% + ${(p * STEP * 100).toFixed(2)}%), 0, 0) rotateY(${(Math.max(-1, Math.min(1, p)) * -34).toFixed(2)}deg) scale(${(1 - Math.min(a, 2) * 0.17).toFixed(3)})`,
    opacity: a > 2.6 ? 0 : String(Math.min(1, 1.6 - a * 0.42).toFixed(2)),
    zIndex: 20 - Math.round(a * 4),
  }
}

export default function ProjectShowcase({ projects }) {
  const total = projects.length
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((dir) => setOpen((i) => (i + dir + total) % total), [total])
  const stageRef = useRef(null)
  const theaterRef = useRef(null)
  const justDragged = useRef(false)
  const activeRef = useRef(0)
  activeRef.current = active

  const go = useCallback((i) => setActive(Math.max(0, Math.min(total - 1, i))), [total])

  // Drag / swipe: the slides follow the pointer (position = index - active - drag), then settle
  useEffect(() => {
    const stage = stageRef.current
    let drag = null
    let frame = 0
    const slides = () => [...stage.querySelectorAll('.slide')]
    const paint = () => {
      frame = 0
      if (!drag) return
      const shift = drag.dx / drag.stepPx
      // Rubber band past the first / last project
      const edge = activeRef.current - shift
      const damped = edge < 0 ? shift + edge * 0.7 : edge > total - 1 ? shift + (edge - (total - 1)) * 0.7 : shift
      slides().forEach((el, i) => Object.assign(el.style, place(i - activeRef.current + damped)))
    }
    const down = (event) => {
      if (event.button !== 0 || event.target.closest('a, button')) return
      const centre = stage.querySelector('.slide[data-pos="0"]')
      drag = { x: event.clientX, y: event.clientY, dx: 0, moved: false, id: event.pointerId, stepPx: (centre?.offsetWidth || 600) * STEP }
    }
    const move = (event) => {
      if (!drag || event.pointerId !== drag.id) return
      drag.dx = event.clientX - drag.x
      if (!drag.moved) {
        // Horizontal intent starts a drag; vertical movement is left to page scrolling
        if (Math.abs(drag.dx) < 8) return
        if (Math.abs(event.clientY - drag.y) > Math.abs(drag.dx)) { drag = null; return }
        drag.moved = true
        stage.dataset.dragging = ''
        window.getSelection()?.removeAllRanges()
      }
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const end = () => {
      if (!drag) return
      const { moved, dx, stepPx } = drag
      drag = null
      cancelAnimationFrame(frame)
      frame = 0
      if (!moved) return
      justDragged.current = true
      setTimeout(() => { justDragged.current = false }, 0)
      delete stage.dataset.dragging
      // Settle on the nearest project; a quick flick of a third of a step is enough to move one
      const shift = dx / stepPx
      const target = Math.abs(shift) < 0.33 ? activeRef.current : activeRef.current - Math.round(shift + Math.sign(shift) * 0.17)
      const next = Math.max(0, Math.min(total - 1, target))
      slides().forEach((el, i) => Object.assign(el.style, place(i - next)))
      setActive(next)
    }
    const noSelect = (event) => { if (drag?.moved) event.preventDefault() }
    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    document.addEventListener('selectstart', noSelect)
    return () => {
      cancelAnimationFrame(frame)
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      document.removeEventListener('selectstart', noSelect)
    }
  }, [total])

  const onKey = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1) }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1) }
  }
  const showProject = (i) => {
    go(i)
    const top = theaterRef.current.getBoundingClientRect().top + window.scrollY - 40
    if (Math.abs(top - window.scrollY) > 120) scrollToY(top)
  }

  const liveProjects = projects.map((p, i) => [p, i]).filter(([p]) => p.live)
  const web = projects.filter((p) => p.platform !== 'mobile').length
  const summary = [[total, 'Projects'], [liveProjects.length, 'Live online'], [web, 'Web apps'], [total - web, 'Mobile apps']]
  const project = projects[active]
  const d = project.details || {}
  const highlights = d.features?.length ? d.features.slice(0, 3).map(([title]) => title) : null
  const tools = (d.stack || []).flatMap(([, items]) => items).filter(([, icon]) => icon)
  const no = (i) => String(i + 1).padStart(2, '0')

  return (
    <>
      {/* Overview: counts, quick links to the deployed projects */}
      <div className="sc-summary reveal">
        <dl className="sc-stats">
          {summary.map(([value, label]) => <div key={label}><dt>{String(value).padStart(2, '0')}</dt><dd>{label}</dd></div>)}
        </dl>
        <div className="sc-live">
          <span className="sc-label">Live now</span>
          <div className="sc-live-links">
            {liveProjects.map(([p, i]) => (
              <button type="button" key={p.number} style={{ '--pc': p.accent }} onClick={() => showProject(i)}>
                <span className="live-dot" />{p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="theater reveal" ref={theaterRef} style={{ '--pc': project.accent }} onKeyDown={onKey}>
        <div className="theater-stage" ref={stageRef} aria-roledescription="carousel" aria-label="Projects">
          <span className="theater-spot" aria-hidden="true" />
          {projects.map((p, i) => {
            const off = i - active
            return (
              <div className="slide" key={p.number} data-pos={off === 0 ? '0' : off < 0 ? '-' : '+'} style={{ ...place(off), '--pc': p.accent }}
                aria-hidden={off !== 0} onClick={() => { if (justDragged.current) return; if (off === 0) setOpen(i); else go(i) }}>
                <div className="slide-frame">
                  <span className="slide-glow" />
                  <span className="slide-tag">{p.live ? <><span className="live-dot" /> Live · {new URL(p.live).host}</> : 'Interface preview'}</span>
                  <Device project={p} />
                  <span className="slide-open"><Maximize2 size={14} /> Click for the full story</span>
                </div>
              </div>
            )
          })}
          <button type="button" className="theater-arrow prev" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous project"><ArrowLeft size={20} /></button>
          <button type="button" className="theater-arrow next" onClick={() => go(active + 1)} disabled={active === total - 1} aria-label="Next project"><ArrowRight size={20} /></button>
          <span className="theater-hint" aria-hidden="true"><MousePointer2 size={13} /> Drag to explore</span>
        </div>

        <div className="theater-info" key={active} aria-live="polite">
          <div className="ti-main">
            <div className="ti-top">
              <span className="showcase-index"><b>{no(active)}</b> / {no(total - 1)}</span>
              <span className="sc-status" data-live={project.live ? '' : undefined}>{project.live ? <><span className="live-dot" /> Live</> : 'Interface preview'}</span>
              <span className="showcase-badge">{project.platform === 'mobile' ? <Smartphone size={13} /> : <Globe size={13} />}{project.platform === 'mobile' ? 'Mobile app' : 'Web app'}</span>
            </div>
            <span className="card-kicker">{project.category}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
          <div className="ti-side">
            {highlights
              ? <ul className="sc-highlights">{highlights.map((h) => <li key={h}><span><Check size={12} strokeWidth={3} /></span>{h}</li>)}</ul>
              : <div className="chip-row">{project.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>}
            {tools.length > 0 && (
              <div className="sc-tools">
                <span className="sc-label">Built with</span>
                <span className="sc-tool-row">
                  {tools.slice(0, 8).map(([name, icon]) => <span className="sc-tool" key={name} title={name} style={{ '--brand': `#${icon.hex}` }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg><em>{name}</em></span>)}
                  {tools.length > 8 && <span className="sc-tool sc-tool-more">+{tools.length - 8}</span>}
                </span>
              </div>
            )}
            <div className="showcase-actions">
              <button type="button" className="showcase-more showcase-details" onClick={() => setOpen(active)}><Maximize2 size={15} /> View full details</button>
              {project.live && <a className="showcase-more showcase-live" href={project.live} target="_blank" rel="noopener noreferrer"><span className="live-dot" /> Visit live site <ArrowUpRight size={16} /></a>}
            </div>
          </div>
        </div>

        <div className="theater-strip" role="tablist" aria-label="Choose a project">
          {projects.map((p, i) => (
            <button type="button" role="tab" aria-selected={i === active} className="strip-item" data-on={i === active || undefined} key={p.number} style={{ '--pc': p.accent }} onClick={() => go(i)}>
              <span className="strip-no">{no(i)}{p.live && <span className="live-dot" />}</span>
              <b>{p.title}</b>
              <small>{p.category}</small>
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <ProjectModal project={projects[open]} index={open} total={total} onClose={close} onStep={step}
          visual={<Device project={projects[open]} />} />
      )}
    </>
  )
}
