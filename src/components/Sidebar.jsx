import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { scrollToSection } from '../lib/smoothScroll.js'
import { Menu, X, ChevronsLeft, ChevronsRight, Github, Mail, MapPin, House, UserRound, Layers3, Zap, Award, FolderKanban, Lightbulb, Cpu, Activity, Send } from 'lucide-react'

const groups = [
  { label: 'Profile', links: [['about', 'Intro', House], ['education', 'About Me', UserRound], ['stack', 'Stack', Layers3], ['skills', 'Skills', Zap], ['leadership', 'Leadership', Award]] },
  { label: 'Work', links: [['projects', 'Projects', FolderKanban], ['interests', 'Interests', Lightbulb], ['technologies', 'Technologies', Cpu], ['contributions', 'Activity', Activity]] },
  { label: 'Connect', links: [['contact', 'Contact', Send]] },
]
const links = groups.flatMap((group) => group.links)
const GITHUB_URL = 'https://github.com/KertCainAbajo'

export default function Sidebar() {
  const [active, setActive] = useState('about')
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(() => {
    try { return window.localStorage.getItem('sidebar-compact') === '1' } catch { return false }
  })
  const navRef = useRef(null)
  const [indicator, setIndicator] = useState({ top: 0, height: 0 })
  const activeId = links.some(([id]) => id === active) ? active : links[0][0]

  // Main content reads --side from the root, so the collapsed width is mirrored there.
  useEffect(() => {
    document.documentElement.classList.toggle('sidebar-collapsed', compact)
    try { window.localStorage.setItem('sidebar-compact', compact ? '1' : '0') } catch { /* storage unavailable */ }
  }, [compact])

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const marker = window.innerHeight * 0.38
        let current = links[0][0]
        for (const [id] of links) {
          const section = document.getElementById(id)
          if (section && section.getBoundingClientRect().top <= marker) current = id
        }
        setActive((previous) => previous === current ? previous : current)
        // How far through the active section the reader is (fills the bar inside the active pill)
        const box = document.getElementById(current)?.getBoundingClientRect()
        if (box && navRef.current) navRef.current.style.setProperty('--progress', String(Math.min(1, Math.max(0, (marker - box.top) / box.height))))
      })
    }
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    updateActiveSection()
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  // Slide the rail marker to the active link; re-measure when the layout changes width.
  useLayoutEffect(() => {
    const measure = () => {
      const link = navRef.current?.querySelector(`[data-id="${activeId}"]`)
      if (link) setIndicator({ top: link.offsetTop, height: link.offsetHeight })
    }
    measure()
    const timer = window.setTimeout(measure, 320)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [activeId, compact, open])

  const navigate = (id) => {
    setActive(id)
    setOpen(false)
    scrollToSection(id)
  }

  let counter = 0
  return (
    <>
      <header className="mobile-header">
        <a className="brand" href="#top" onClick={() => setOpen(false)}><span className="brand-mark">KA</span><span className="brand-copy"><strong>Kert Cain Abajo</strong><small>Web &amp; Mobile Developer</small></span></a>
        <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </header>
      {open && <button aria-label="Close navigation overlay" className="nav-scrim" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${compact ? 'sidebar-compact' : ''} ${open ? 'sidebar-open' : ''}`}>
        <a className="brand desktop-brand" href="#top" onClick={() => navigate('about')}>
          <span className="brand-mark">KA</span>
          <span className="brand-copy"><strong>Kert Cain Abajo</strong><small>Web &amp; Mobile Developer</small></span>
        </a>

        <nav aria-label="Main navigation" className="side-nav" ref={navRef}>
          <span className="side-rail" aria-hidden="true"><span className="side-indicator" style={{ transform: `translateY(${indicator.top}px)`, height: indicator.height }}><i className="side-progress" /></span></span>
          {groups.map((group) => (
            <div className="side-group" key={group.label}>
              <span className="side-group-label">{group.label}</span>
              {group.links.map(([id, label, Icon]) => {
                counter += 1
                return (
                  <a className={`side-link ${activeId === id ? 'active' : ''}`} key={id} data-id={id} href={`#${id}`} style={{ '--n': counter }} title={compact ? label : undefined} aria-current={activeId === id ? 'location' : undefined} onClick={(event) => { event.preventDefault(); navigate(id) }}>
                    <span className="side-icon" key={activeId === id ? 'on' : 'off'}><Icon size={15} strokeWidth={2} /></span><span className="side-label">{label}</span><span className="side-index">{String(counter).padStart(2, '0')}</span>
                  </a>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="status-card" title={compact ? 'Open to opportunities · Davao City, PH' : undefined}>
            <span className="status-dot" aria-hidden="true" />
            <span className="status-copy"><strong>Open to opportunities</strong><small><MapPin size={11} /> Davao City, PH</small></span>
          </div>
          <div className="side-socials">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub profile" title="GitHub"><Github size={15} /></a>
            <a href="#contact" onClick={(event) => { event.preventDefault(); navigate('contact') }} aria-label="Contact" title="Contact"><Mail size={15} /></a>
          </div>
          <div className="side-controls">
            <button className="collapse-button" onClick={() => setCompact(!compact)} aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!compact} title={compact ? 'Expand sidebar' : undefined}><span>Collapse</span>{compact ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}</button>
          </div>
        </div>
      </aside>
    </>
  )
}
