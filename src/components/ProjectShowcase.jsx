import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Globe, Maximize2, Smartphone } from 'lucide-react'
import CrochetDemo, { CrochetUrl } from './CrochetDemo.jsx'
import GymDemo from './GymDemo.jsx'
import ProjectModal from './ProjectModal.jsx'
import ProjectDock from './ProjectDock.jsx'
import { isStacked, jumpToProject } from '../lib/projectNav.js'

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
      <div className="browser-bar"><span className="dots"><i /><i /><i /></span>{project.demo === 'crochet' ? <CrochetUrl /> : <span className="url">{project.live ? new URL(project.live).host : project.url}</span>}</div>
      {project.demo === 'crochet' ? <CrochetDemo /> : project.demo === 'gym' ? <GymDemo /> : (
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

// Sticky stacked project cards: each card pins, the next slides over it and the previous ones recede
// (scale/brightness driven by --stack, set in effects.js). Clicking a card opens its full details;
// grabbing it with the mouse and pulling it up/left (or down/right) moves to the next (or previous) project.
const SWITCH_AT = 110 // px of pull needed to switch project
export default function ProjectShowcase({ projects }) {
  const total = projects.length
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((dir) => setOpen((i) => (i + dir + total) % total), [total])
  const stackRef = useRef(null)
  const justDragged = useRef(false)

  // Card dragging (mouse only; touch keeps normal page scrolling)
  useEffect(() => {
    const stack = stackRef.current
    let drag = null
    let frame = 0
    // Glide toward the pointer once per frame (pointer events arrive unevenly, which looked jittery)
    const follow = () => {
      frame = 0
      if (!drag?.moved) return
      const { card } = drag
      drag.cx += (drag.dx - drag.cx) * 0.28
      drag.cy += (drag.dy - drag.cy) * 0.28
      card.style.translate = `${(drag.cx * 0.45).toFixed(1)}px ${(drag.cy * 0.3).toFixed(1)}px`
      card.style.rotate = `${(drag.cx * 0.012).toFixed(2)}deg`
      if (Math.abs(drag.dx - drag.cx) > 0.3 || Math.abs(drag.dy - drag.cy) > 0.3) frame = requestAnimationFrame(follow)
    }
    const end = () => {
      if (!drag) return
      cancelAnimationFrame(frame)
      frame = 0
      const { card, dx, dy, moved, index } = drag
      drag = null
      if (!moved) return
      justDragged.current = true
      setTimeout(() => { justDragged.current = false }, 0)
      delete card.dataset.dragging
      delete card.dataset.dir
      // Spring back into place (CSS transition on translate/rotate), then switch if pulled far enough
      card.style.translate = ''
      card.style.rotate = ''
      const pull = Math.abs(dx) > Math.abs(dy) ? -dx : -dy
      if (pull > SWITCH_AT) jumpToProject(stack, index + 1)
      else if (pull < -SWITCH_AT) jumpToProject(stack, index - 1)
    }
    const down = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !isStacked() || event.target.closest('a, button')) return
      const card = event.target.closest('.showcase-card')
      if (!card) return
      const index = [...stack.querySelectorAll('.showcase-item')].indexOf(card.parentElement)
      drag = { card, index, x: event.clientX, y: event.clientY, dx: 0, dy: 0, cx: 0, cy: 0, moved: false }
    }
    const move = (event) => {
      if (!drag) return
      drag.dx = event.clientX - drag.x
      drag.dy = event.clientY - drag.y
      if (!drag.moved) {
        if (Math.hypot(drag.dx, drag.dy) < 6) return
        drag.moved = true
        drag.card.dataset.dragging = ''
        window.getSelection()?.removeAllRanges()
      }
      // Follow the pointer with some resistance, tilting slightly in the drag direction
      const { card, dx, dy } = drag
      if (!frame) frame = requestAnimationFrame(follow)
      const pull = Math.abs(dx) > Math.abs(dy) ? -dx : -dy
      const total = stack.querySelectorAll('.showcase-item').length
      const dir = pull > SWITCH_AT && drag.index < total - 1 ? 'next' : pull < -SWITCH_AT && drag.index > 0 ? 'prev' : 'hold'
      if (card.dataset.dir !== dir) card.dataset.dir = dir
    }
    // No text selection while a card is being dragged (a class on <html> would restyle the whole page)
    const noSelect = (event) => { if (drag?.moved) event.preventDefault() }
    stack.addEventListener('pointerdown', down)
    document.addEventListener('selectstart', noSelect)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      cancelAnimationFrame(frame)
      stack.removeEventListener('pointerdown', down)
      document.removeEventListener('selectstart', noSelect)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }, [])

  return (
    <div className="showcase" data-stack ref={stackRef}>
      {projects.map((project, i) => (
        <article className="showcase-item" key={project.number} style={{ '--i': i }}>
          <div className="card showcase-card reveal" onClick={(event) => { if (!justDragged.current && !event.target.closest('a, button')) setOpen(i) }}>
            <span className="showcase-drag" aria-hidden="true" />
            <div className="showcase-copy">
              <div className="showcase-top">
                <span className="showcase-index"><b>{String(i + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}</span>
                <span className="showcase-badge">{project.platform === 'mobile' ? <Smartphone size={13} /> : <Globe size={13} />}{project.platform === 'mobile' ? 'Mobile app' : 'Web app'}</span>
              </div>
              <span className="card-kicker">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="chip-row">{project.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
              <div className="showcase-actions">
                <button type="button" className="showcase-more showcase-details" onClick={() => setOpen(i)}><Maximize2 size={15} /> View full details</button>
                {project.live && <a className="showcase-more showcase-live" href={project.live} target="_blank" rel="noopener noreferrer"><span className="live-dot" /> Visit live site <ArrowUpRight size={16} /></a>}
              </div>
            </div>
            <div className="showcase-visual" aria-hidden="true">
              <span className="showcase-glow" />
              <span className="showcase-number">{String(i + 1).padStart(2, '0')}</span>
              <Device project={project} />
            </div>
          </div>
        </article>
      ))}
      <ProjectDock projects={projects} stackRef={stackRef} />
      {open !== null && (
        <ProjectModal project={projects[open]} index={open} total={total} onClose={close} onStep={step}
          visual={<Device project={projects[open]} />} />
      )}
    </div>
  )
}
