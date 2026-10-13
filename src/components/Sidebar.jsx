import { useEffect, useState } from 'react'
import { Menu, X, ChevronsLeft, ChevronsRight } from 'lucide-react'

const links = [
  ['about', 'Intro'], ['education', 'About & Education'], ['stack', 'Stack'], ['skills', 'Skills'],
  ['leadership', 'Leadership'], ['projects', 'Projects'], ['interests', 'Interests'],
  ['technologies', 'Technologies'], ['contributions', 'Activity'], ['contact', 'Contact'],
]

export default function Sidebar() {
  const [active, setActive] = useState('about')
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(() => {
    try { return window.localStorage.getItem('sidebar-compact') === '1' } catch { return false }
  })
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

  const navigate = (id) => {
    setActive(id)
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="mobile-header">
        <a className="brand" href="#top" onClick={() => setOpen(false)}><span className="brand-mark">A<span>.</span></span><span>PORTFOLIO<small>2026 · DAVAO, PH</small></span></a>
        <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </header>
      {open && <button aria-label="Close navigation overlay" className="nav-scrim" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${compact ? 'sidebar-compact' : ''} ${open ? 'sidebar-open' : ''}`}>
        <a className="brand desktop-brand" href="#top" onClick={() => navigate('about')}><span className="brand-mark">A<span>.</span></span><span className="brand-copy">PORTFOLIO<small>2026 · DAVAO, PH</small></span></a>
        <div className="side-caption">INDEX <span>01—{String(links.length).padStart(2, '0')}</span></div>
        <nav aria-label="Main navigation" className="side-nav">
          {links.map(([id, label], index) => (
            <a className={`side-link ${activeId === id ? 'active' : ''}`} key={id} href={`#${id}`} title={compact ? label : undefined} aria-label={label} onClick={(event) => { event.preventDefault(); navigate(id) }}>
              <span className="side-index">{String(index + 1).padStart(2, '0')}</span><span className="side-label">{label}</span><span className="active-mark" />
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom"><span className="availability" title={compact ? 'Open to opportunities' : undefined}><i /><span>OPEN TO OPPORTUNITIES</span></span><button className="collapse-button" onClick={() => setCompact(!compact)} aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!compact} title={compact ? 'Expand sidebar' : undefined}><span>{compact ? 'EXPAND' : 'COLLAPSE'}</span>{compact ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}</button></div>
      </aside>
    </>
  )
}
