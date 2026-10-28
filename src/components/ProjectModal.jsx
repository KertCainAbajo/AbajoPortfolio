import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Smartphone, X } from 'lucide-react'
import { setSmoothScrollPaused } from '../lib/smoothScroll.js'

const Logo = ({ icon }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>

// Full-screen project details: a large live screen plus what the system does, how it flows and what
// it's built with. Each section only appears when the project has that information.
// Rendered into <body> so the stacked cards' transforms don't trap it; Esc, the close button or a
// click on the backdrop closes it, and the arrows step through the other projects.
export default function ProjectModal({ project, index, total, visual, onClose, onStep }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const d = project.details || {}

  // Lock the page behind the dialog and return focus to the card afterwards
  useEffect(() => {
    const opener = document.activeElement
    const root = document.documentElement
    root.classList.add('modal-open')
    setSmoothScrollPaused(true)
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      root.classList.remove('modal-open')
      setSmoothScrollPaused(false)
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
    }
  }, [])

  // New project: start at the top of the dialog
  useEffect(() => { panelRef.current?.scrollTo({ top: 0 }) }, [project])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') onStep(1)
      else if (event.key === 'ArrowLeft') onStep(-1)
      else if (event.key === 'Tab') {
        // Keep keyboard focus inside the dialog
        const items = [...panelRef.current.querySelectorAll('a[href], button:not([disabled])')]
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  const isMobile = project.platform === 'mobile'
  const no = String(index + 1).padStart(2, '0')
  const facts = [
    ['Type', project.category],
    ['Platform', isMobile ? 'Mobile app' : 'Web app'],
    ...(d.facts || []),
    ...(project.live ? [['Status', 'Live online']] : []),
  ]

  return createPortal(
    <div className="pm" data-lenis-prevent onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="pm-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="pm-title" key={project.number}>
        <header className="pm-top">
          <span className="pm-index"><b>{no}</b> / {String(total).padStart(2, '0')}</span>
          <span className="showcase-badge">{isMobile ? <Smartphone size={13} /> : <Globe size={13} />}{isMobile ? 'Mobile app' : 'Web app'}</span>
          <span className="pm-nav">
            <button type="button" className="pm-icon-btn" onClick={() => onStep(-1)} aria-label="Previous project"><ArrowLeft size={17} /></button>
            <button type="button" className="pm-icon-btn" onClick={() => onStep(1)} aria-label="Next project"><ArrowRight size={17} /></button>
            <button type="button" className="pm-icon-btn pm-close" ref={closeRef} onClick={onClose} aria-label="Close project details"><X size={18} /></button>
          </span>
        </header>

        <section className="pm-hero">
          <div className="pm-intro">
            <span className="card-kicker">{project.category}</span>
            <h2 id="pm-title">{project.title}</h2>
            <p className="pm-lede">{d.overview || project.description}</p>
            <div className="chip-row">{project.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
            {project.live && (
              <a className="showcase-more showcase-live pm-live" href={project.live} target="_blank" rel="noopener noreferrer"><span className="live-dot" /> Visit live site <ArrowUpRight size={16} /></a>
            )}
          </div>
          <div className="pm-visual" aria-hidden="true"><span className="pm-glow" />{visual}</div>
        </section>

        <dl className="pm-facts">
          {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>

        {d.features?.length > 0 && (
          <section className="pm-block">
            <h3 className="pm-h">What it does</h3>
            <div className="pm-features">
              {d.features.map(([title, text], k) => (
                <article className="pm-feature" key={title} style={{ '--k': k }}><span className="pm-feature-no">{String(k + 1).padStart(2, '0')}</span><b>{title}</b><p>{text}</p></article>
              ))}
            </div>
          </section>
        )}

        {d.flow?.length > 0 && (
          <section className="pm-block">
            <h3 className="pm-h">How it works</h3>
            <ol className="pm-flow">
              {d.flow.map((step, k) => <li key={step} style={{ '--k': k }}><span>{k + 1}</span>{step}</li>)}
            </ol>
          </section>
        )}

        {d.stack?.length > 0 && (
          <section className="pm-block">
            <h3 className="pm-h">Built with</h3>
            <div className="pm-stack">
              {d.stack.map(([group, items]) => (
                <div className="pm-stack-group" key={group}>
                  <span className="pm-stack-label">{group}</span>
                  <div className="pm-stack-items">
                    {items.map(([name, icon]) => (
                      <span className="pm-tool" key={name} style={icon ? { '--brand': `#${icon.hex}` } : undefined}>
                        {icon ? <span className="pm-tool-logo"><Logo icon={icon} /></span> : null}{name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="pm-foot">
          <button type="button" className="pm-step" onClick={() => onStep(-1)}><ArrowLeft size={16} /> Previous project</button>
          <button type="button" className="pm-step" onClick={() => onStep(1)}>Next project <ArrowRight size={16} /></button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
