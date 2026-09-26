import { ArrowUpRight } from 'lucide-react'

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className={`project-art art-${project.number}`} aria-hidden="true">
        <span className="art-index">PROJECT / {project.number}</span><span className="art-symbol">{project.symbol}</span>
        <span className="art-cross cross-one" /><span className="art-cross cross-two" />
        <span className="art-line" />
      </div>
      <div className="project-copy">
        <div className="project-meta"><span>{project.category}</span><span>0{project.number} <ArrowUpRight size={14} /></span></div>
        <h3>{project.title}</h3><p>{project.description}</p>
        <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </article>
  )
}
