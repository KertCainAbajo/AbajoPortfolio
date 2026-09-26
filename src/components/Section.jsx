import { ArrowUpRight } from 'lucide-react'

export default function Section({ id, number, title, eyebrow, children, className = '' }) {
  return (
    <section id={id} className={`section-shell ${className}`}>
      <div className="section-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" />{number} / {eyebrow || title}</span>
          <h2>{title}</h2>
        </div>
        <a className="top-link" href="#top" aria-label="Back to top"><ArrowUpRight size={16} /></a>
      </div>
      {children}
    </section>
  )
}
