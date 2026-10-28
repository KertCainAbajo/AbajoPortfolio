import { ArrowUpRight, Globe, Smartphone } from 'lucide-react'

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
      <div className="browser-bar"><span className="dots"><i /><i /><i /></span><span className="url">{project.url}</span></div>
      <div className="device-screen">
        <aside className="ui-side"><b>{project.symbol}</b>{[0, 1, 2, 3].map((i) => <i key={i} className={i === 0 ? 'on' : ''} />)}</aside>
        <MockScreen variant={project.mock} />
      </div>
      <span className="ui-cursor" />
    </div>
  )
}

// Sticky stacked project cards: each card pins, the next slides over it and the previous ones recede
// (scale/brightness driven by --stack, set in effects.js).
export default function ProjectShowcase({ projects }) {
  const total = projects.length
  return (
    <div className="showcase" data-stack>
      {projects.map((project, i) => (
        <article className="showcase-item" key={project.number} style={{ '--i': i }}>
          <div className="card showcase-card reveal">
            <div className="showcase-copy">
              <div className="showcase-top">
                <span className="showcase-index"><b>{String(i + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}</span>
                <span className="showcase-badge">{project.platform === 'mobile' ? <Smartphone size={13} /> : <Globe size={13} />}{project.platform === 'mobile' ? 'Mobile app' : 'Web app'}</span>
              </div>
              <span className="card-kicker">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="chip-row">{project.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
              <span className="showcase-more">Project highlight <ArrowUpRight size={16} /></span>
            </div>
            <div className="showcase-visual" aria-hidden="true">
              <span className="showcase-glow" />
              <span className="showcase-number">{String(i + 1).padStart(2, '0')}</span>
              <Device project={project} />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
