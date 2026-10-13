import { ArrowUpRight } from 'lucide-react'

export default function ProjectCard({ project }) {
  return (
    <article className={`project-card project-card-${project.number}`}>
      <div className={`project-art art-${project.number}`} aria-hidden="true">
        <span className="art-index">#{String(project.number).padStart(2, '0')}</span>
        <span className="art-symbol">{project.symbol}</span>
        <span className="art-sfx" lang="ja">{project.sfx}</span>
      </div>
      <div className="project-copy">
        <div className="project-meta"><span>{project.category}</span><ArrowUpRight size={15} /></div>
        <h3>{project.title}</h3><p>{project.description}</p>
        <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </article>
  )
}
