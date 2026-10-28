import SplitText from './SplitText.jsx'

export default function Section({ id, number, title, eyebrow, description, children, className = '' }) {
  const label = eyebrow || title
  return (
    <section id={id} className={`section-shell ${className}`}>
      <span className="section-ghost" data-parallax="0.18" aria-hidden="true">{number}</span>
      <header className="section-heading reveal">
        <span className="eyebrow"><span className="eyebrow-no">{number}</span><span className="scramble" data-text={label}>{label}</span></span>
        <h2><SplitText text={title} /></h2>
        {description && <p className="section-description">{description}</p>}
      </header>
      {children}
    </section>
  )
}
