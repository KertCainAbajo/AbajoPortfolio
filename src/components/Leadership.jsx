import { Award } from 'lucide-react'

function Emblem({ mark, org, id }) {
  const text = `${org.toUpperCase()} • `
  return (
    <div className="emblem" aria-hidden="true">
      <svg className="emblem-ring" viewBox="0 0 200 200">
        <defs><path id={`ring-${id}`} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
        <text><textPath href={`#ring-${id}`} textLength="486" lengthAdjust="spacing">{text.repeat(Math.max(1, Math.round(60 / text.length)))}</textPath></text>
      </svg>
      <span className="emblem-core"><b>{mark}</b></span>
    </div>
  )
}

// Leadership: a tenure timeline plus a credential card per role (oldest first).
export default function Leadership({ items }) {
  const roles = [...items].reverse()
  const years = [2023, 2024, 2025]
  return (
    <div className="lead">
      <div className="lead-timeline reveal" aria-hidden="true">
        <div className="lead-track">
          {roles.map((r, i) => <span className="lead-span" key={r.mark} style={{ '--i': i }}><em>{r.mark}</em></span>)}
          <i className="lead-glint" />
        </div>
        <div className="lead-years">{years.map((y) => <span key={y}><i />{y}</span>)}</div>
      </div>

      <div className="lead-cards">
        {roles.map((r, i) => {
          const [from, to] = r.years.split('—').map((s) => s.trim())
          return (
            <article className="card lead-card reveal" key={r.mark} style={{ '--d': `${i * 140}ms` }} data-tilt="5">
              <span className="lead-ghost" aria-hidden="true">{to.slice(2)}</span>
              <Emblem mark={r.mark} org={r.org} id={r.mark} />
              <div className="lead-body">
                <span className="lead-chip"><Award size={13} /> {from} — {to}</span>
                <h3>{r.role}</h3>
                <p>{r.org}</p>
                <span className="card-kicker">Student leadership · Role {String(i + 1).padStart(2, '0')}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
