import { ArrowUpRight } from 'lucide-react'

export default function ProjectCard({ project, delay = 0 }) {
  return (
    <article className={`card project-card reveal art-${project.number}`} style={{ '--d': `${delay}ms` }} data-tilt="7">
      <div className="project-art" aria-hidden="true">
        <span className="art-index">{String(project.number).padStart(2, '0')}</span>
        <span className="art-orbit orbit-1"><i /></span><span className="art-orbit orbit-2"><i /></span><span className="art-symbol">{project.symbol}</span>
      </div>
      <div className="project-copy">
        <div className="project-meta"><span>{project.category}</span><ArrowUpRight size={16} /></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="chip-row project-tags">{project.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
      </div>
    </article>
  )
}
