import { ArrowUpRight } from 'lucide-react'

export default function Section({ id, number, title, eyebrow, jp, children, className = '' }) {
  return (
    <section id={id} className={`section-shell ${className}`}>
      <div className="section-heading">
        <div>
          <span className="eyebrow"><span className="chapter-tag">CH.{number}</span>{eyebrow || title}{jp && <span className="eyebrow-jp" lang="ja">{jp}</span>}</span>
          <h2>{title}</h2>
        </div>
        <a className="top-link" href="#top" aria-label="Back to top"><ArrowUpRight size={16} /></a>
      </div>
      {children}
    </section>
  )
}
