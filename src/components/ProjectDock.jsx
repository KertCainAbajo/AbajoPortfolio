import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { docTop, onLayoutChange } from '../lib/layoutCache.js'
import { isStacked, jumpToProject } from '../lib/projectNav.js'

// Floating "project dock" shown while the stacked projects are on screen: jump straight to any
// project instead of scrolling through each card. Click a number, or press on the numbers and drag
// across them (the highlight follows) and let go to jump there.
// On wide screens the current project is read from the --stack progress effects.js already writes
// (data-s on each card); on phones, where cards don't stack, it comes from cached card positions.
// Either way scrolling never forces a layout.
export default function ProjectDock({ projects, stackRef }) {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState(null) // project under the pointer while scrubbing
  const dotsRef = useRef(null)
  const scrub = useRef(null)

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return undefined
    const items = [...stack.querySelectorAll('.showcase-item')]
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '-35% 0px -35% 0px' })
    io.observe(stack)
    let frame = 0
    let tops = []
    const stopMeasuring = onLayoutChange(() => { tops = items.map((el) => docTop(el)) })
    const update = () => {
      frame = 0
      if (isStacked()) {
        // The card on top is the first one the next card hasn't covered yet
        const top = items.findIndex((el) => Number(el.dataset.s || 0) < 0.5)
        setActive(top === -1 ? items.length - 1 : top)
      } else {
        // The current card is the last one whose top has passed 40% of the screen
        const line = window.scrollY + window.innerHeight * 0.4
        let current = 0
        tops.forEach((top, i) => { if (top <= line) current = i })
        setActive(current)
      }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { io.disconnect(); stopMeasuring(); cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [stackRef])

  const jumpTo = (index) => jumpToProject(stackRef.current, index)

  // Scrubbing: the number nearest the pointer (dot centres are measured once, when the press starts)
  const nearest = (x) => {
    const centres = scrub.current.centres
    let best = 0
    centres.forEach((c, i) => { if (Math.abs(c - x) < Math.abs(centres[best] - x)) best = i })
    return best
  }
  const onDown = (event) => {
    if (event.button !== 0) return
    event.preventDefault()
    const dots = [...dotsRef.current.children]
    scrub.current = { centres: dots.map((d) => { const r = d.getBoundingClientRect(); return r.left + r.width / 2 }) }
    dotsRef.current.setPointerCapture(event.pointerId)
    setPreview(nearest(event.clientX))
  }
  const onMove = (event) => { if (scrub.current) setPreview(nearest(event.clientX)) }
  const onUp = (event) => {
    if (!scrub.current) return
    const target = nearest(event.clientX)
    scrub.current = null
    setPreview(null)
    jumpTo(target)
  }

  const shown = preview ?? active
  const no = (i) => String(i + 1).padStart(2, '0')
  return createPortal(
    <div className="pdock-wrap" data-show={visible || undefined}>
      <nav className="pdock" aria-label="Jump to a project">
        <button type="button" className="pdock-arrow" onClick={() => jumpTo(active - 1)} aria-label="Previous project" disabled={active === 0}><ChevronLeft size={17} /></button>
        <div className="pdock-dots" ref={dotsRef} data-scrubbing={preview !== null || undefined}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { scrub.current = null; setPreview(null) }}>
          {projects.map((p, i) => (
            // Pointer presses are handled by the scrubber above; onClick here is for the keyboard (Enter/Space)
            <button type="button" className="pdock-dot" key={p.number} data-on={shown === i || undefined} onClick={(event) => { if (event.detail === 0) jumpTo(i) }}
              aria-label={`Project ${no(i)}: ${p.title}`} aria-current={active === i ? 'true' : undefined}>
              {no(i)}<em className="pdock-tip">{p.title}</em>
            </button>
          ))}
        </div>
        <span className="pdock-now" aria-live="polite"><b>{no(shown)}</b>{projects[shown].title}</span>
        <button type="button" className="pdock-arrow" onClick={() => jumpTo(active + 1)} aria-label="Next project" disabled={active === projects.length - 1}><ChevronRight size={17} /></button>
      </nav>
    </div>,
    document.body,
  )
}
