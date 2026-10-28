import { Fragment, useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Code2, Smartphone, Layers3, Sparkles, GraduationCap, MapPin, UserRound, Rocket, Globe, Bot, Network, Bug, Brain, FileText } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Section from './components/Section.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import Contact from './components/Contact.jsx'
import ContributionGraph from './components/ContributionGraph.jsx'
import ThemeSwitch from './components/ThemeSwitch.jsx'
import PortraitStage from './components/PortraitStage.jsx'
import { initSmoothScroll } from './lib/smoothScroll.js'
import { initInteractions } from './lib/interactions.js'
import { initEffects } from './lib/effects.js'
import Preloader from './components/Preloader.jsx'
import HeroField from './components/HeroField.jsx'
import SplitText, { ScrubText } from './components/SplitText.jsx'
import { siHtml5, siCss, siJavascript, siReact, siTypescript, siPhp, siLaravel, siMysql, siMongodb, siFlutter, siDart, siGit, siGithub, siPostman, siExpo, siPhpmyadmin } from 'simple-icons'

const projects = [
  { platform: 'web', number: 1, title: 'ITSO IP Management System', category: 'Office workflow', symbol: 'IP', description: 'A streamlined application process for the Innovation and Technology Support Office, from document submission through status tracking.', tags: ['Document tracking', 'Status monitoring', 'Workflows'] },
  { platform: 'web', number: 2, title: 'RPIC Research Management System', category: 'Research management', symbol: 'R/', description: 'An organized home for research workflows, defense schedules, document storage, and publication tracking.', tags: ['Research', 'Scheduling', 'Data organization'] },
  { platform: 'web', number: 3, title: 'Mechanic Booking System', category: 'Booking platform', symbol: 'M—', description: 'A service platform for choosing repairs, booking appointments, and managing mechanic schedules.', tags: ['Booking', 'Scheduling', 'Services'] },
  { platform: 'web', number: 4, title: 'Crochet Shop System', category: 'E-commerce', symbol: '✳', description: 'An online shop for browsing handmade crochet, placing orders, and requesting custom pieces.', tags: ['E-commerce', 'Orders', 'Custom work'] },
  { platform: 'web', number: 5, title: 'Gym Time-In & Time-Out', category: 'Membership system', symbol: '05', description: 'A simple gym attendance and membership system that checks members in with a unique ID.', tags: ['Attendance', 'Membership', 'Member ID'] },
  { platform: 'mobile', number: 6, title: 'TechSustain', category: 'Flutter app', symbol: '↗', description: 'A Flutter app encouraging everyday eco-friendly habits with practical tools, tips, and personal tracking.', tags: ['Flutter', 'Sustainability', 'Habit tracking'] },
  { platform: 'mobile', number: 7, title: 'Acid Reflux Tracker', category: 'Health tracker', symbol: '≈', description: 'A personal log for meals, symptoms, and habits that reveals patterns and possible triggers over time.', tags: ['Health tracking', 'Patterns', 'Logging'] },
]
const projectGroups = [
  { platform: 'web', title: 'Web applications', note: 'Systems for offices, services, and shops' },
  { platform: 'mobile', title: 'Mobile applications', note: 'Apps for everyday habits and health' },
]

const skills = [
  { name: 'Web & application development', icon: Globe, note: 'Full-stack web apps, from interface to database.' },
  { name: 'Mobile application development', icon: Smartphone, note: 'Cross-platform apps with Flutter and Expo.' },
  { name: 'AI-assisted software development', icon: Bot, note: 'Using AI tools to build faster and cleaner.' },
  { name: 'System design & architecture', icon: Network, note: 'Structuring data, flows, and services.' },
  { name: 'Software testing & debugging', icon: Bug, note: 'QA testing and tracking down root causes.' },
  { name: 'Problem solving & analytical thinking', icon: Brain, note: 'Breaking real needs into workable steps.' },
  { name: 'Technical documentation & reporting', icon: FileText, note: 'Clear write-ups for users, teams, and reviewers.' },
]
const techs = [
  { name: 'HTML5', icon: siHtml5 }, { name: 'CSS3', icon: siCss }, { name: 'JavaScript', icon: siJavascript }, { name: 'React', icon: siReact },
  { name: 'TypeScript', icon: siTypescript }, { name: 'PHP', icon: siPhp }, { name: 'Laravel', icon: siLaravel }, { name: 'MySQL', icon: siMysql },
  { name: 'MongoDB', icon: siMongodb }, { name: 'Flutter', icon: siFlutter }, { name: 'Dart', icon: siDart }, { name: 'Git', icon: siGit },
  { name: 'GitHub', icon: siGithub }, { name: 'Postman', icon: siPostman }, { name: 'Expo Go', icon: siExpo }, { name: 'phpMyAdmin', icon: siPhpmyadmin },
]
const stack = [
  { name: 'Frontend', icon: <Code2 size={20} />, items: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'] },
  { name: 'Backend & data', icon: <Layers3 size={20} />, items: ['PHP', 'Laravel', 'MySQL', 'MongoDB'] },
  { name: 'Mobile & tools', icon: <Smartphone size={20} />, items: ['Flutter', 'Dart', 'Expo Go', 'Git', 'GitHub', 'Postman', 'phpMyAdmin'] },
]
const leadership = [
  { years: '2024 — 2025', role: 'Officer · Auditor', org: 'College of Computer Studies', mark: 'CCS' },
  { years: '2023 — 2024', role: 'Officer · Legislative', org: 'Society of Information Technology Education Students', mark: 'SITES' },
]
const interests = ['Scalable web and mobile applications', 'AI-assisted development and productivity', 'API development and integration', 'Software quality assurance and testing', 'Modern full-stack development workflows']
const stats = [['07', 'Projects built'], ['16', 'Tools & technologies'], ['02', 'Leadership roles']]
const statement = ['Web development', 'Mobile apps', 'System design', 'UI engineering', 'Problem solving']
const floaters = [{ tech: siReact, label: 'React', cls: 'float-a', depth: 30 }, { tech: siFlutter, label: 'Flutter', cls: 'float-b', depth: -40 }, { tech: siLaravel, label: 'Laravel', cls: 'float-c', depth: 24 }]

function TechLogo({ tech }) {
  return <span className="tech-chip" style={{ '--brand': `#${tech.icon.hex}` }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={tech.icon.path} /></svg>{tech.name}</span>
}

// Types the name, holds it for 5s, erases it, then types it again.
// Kept in its own component so each keystroke re-renders only this span, not the whole page.
function TypedName({ text }) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(text)
      return undefined
    }
    let index = 0
    let deleting = false
    let timer = 0
    const step = () => {
      index += deleting ? -1 : 1
      setTyped(text.slice(0, index))
      if (!deleting && index >= text.length) {
        deleting = true
        timer = window.setTimeout(step, 5000)
      } else if (deleting && index <= 0) {
        deleting = false
        timer = window.setTimeout(step, 450)
      } else {
        timer = window.setTimeout(step, deleting ? 26 : 48)
      }
    }
    timer = window.setTimeout(step, 48)
    return () => window.clearTimeout(timer)
  }, [text])
  return <span className="hero-name-typed" aria-hidden="true">{typed}<span className="typing-cursor" /></span>
}

function App() {
  const [ready, setReady] = useState(false)
  const title = 'Kert Cain Arvie P. Abajo'

  useEffect(() => initSmoothScroll(), [])
  useEffect(() => (ready ? initInteractions() : undefined), [ready])
  useEffect(() => (ready ? initEffects() : undefined), [ready])

  const half = Math.ceil(techs.length / 2)
  return (
    <div className="app-frame" id="top">
      <Preloader onReveal={() => setReady(true)} />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" /><div className="cursor-ring" aria-hidden="true" />
      <div className="backdrop" aria-hidden="true"><span className="backdrop-grid" /><span className="backdrop-glow glow-a" /><span className="backdrop-glow glow-b" /></div>
      <Sidebar />
      <main className="main-content">
        <div className="topbar">
          <span className="topbar-left">Portfolio <i>/</i> 2026</span>
          <span className="status-pill"><span className="live-dot" /> Available for opportunities</span>
        </div>

        <section id="about" className="hero-section">
          <HeroField />
          <div className="hero-waves" aria-hidden="true"><i /><i /><i /></div>
          <span className="hero-sun" aria-hidden="true" />
          <div className="hero-copy">
            <span className="hero-badge reveal" style={{ '--d': '150ms' }}><Sparkles size={14} /> IT Graduate <i /> Web &amp; Mobile Developer</span>
            <h1 className="reveal" style={{ '--d': '250ms' }} aria-label={title}><span className="hero-name-ghost" aria-hidden="true">{title}</span><TypedName text={title} /></h1>
            <p className="hero-description reveal" style={{ '--d': '380ms' }}>I build web applications, mobile apps, and digital systems that address practical needs — from clean interfaces to the data behind them.</p>
            <div className="hero-actions reveal" style={{ '--d': '480ms' }}>
              <a className="btn btn-primary" href="#projects" data-magnetic>Explore my work <ArrowUpRight size={16} /></a>
              <a className="btn btn-ghost" href="#contact" data-magnetic>Let’s connect</a>
            </div>
            <dl className="hero-stats reveal" style={{ '--d': '580ms' }}>
              {stats.map(([value, label]) => <div key={label}><dt data-count={Number(value)}>{value}</dt><dd>{label}</dd></div>)}
            </dl>
          </div>

          <div className="hero-visual reveal" style={{ '--d': '300ms' }}>
            {floaters.map((f) => <span className={`floater ${f.cls}`} data-depth={f.depth} key={f.label} aria-hidden="true" style={{ '--brand': `#${f.tech.hex}` }}><span className="floater-inner"><svg viewBox="0 0 24 24"><path d={f.tech.path} /></svg>{f.label}</span></span>)}
            <div className="portrait-card" data-tilt="6">
              <div className="visual-topline"><span className="visual-label">The developer</span><ThemeSwitch /></div>
              <div className="portrait-art" aria-label="Portrait of Kert Cain Arvie P. Abajo" role="img">
                <PortraitStage>
                  <div className="portrait-speedlines" />
                  <img className="portrait-photo portrait-base" src="/assets/1p-cutout.webp" alt="Kert Cain Arvie P. Abajo" onError={(event) => { event.currentTarget.style.display = 'none' }} />
                  <img className="portrait-photo portrait-base-head" src="/assets/1p-cutout.webp" alt="" aria-hidden="true" onError={(event) => { event.currentTarget.style.display = 'none' }} />
                </PortraitStage>
              </div>
              <div className="visual-bottomline"><span>Information Technology</span><span><MapPin size={13} /> Davao City, PH</span></div>
            </div>
          </div>
          <a className="scroll-cue" href="#education"><span>Scroll to explore</span><ArrowDown size={14} /></a>
        </section>

        <div className="statement" aria-hidden="true">
          <div className="statement-track">{[0, 1].map((copy) => statement.map((word, i) => <span key={`${copy}-${i}`} className={i % 2 ? 'outline' : ''}>{word}<i>✦</i></span>))}</div>
        </div>

        <Section id="education" number="01" title="A little about me" eyebrow="About">
          <div className="bento about-grid">
            <article className="card about-card about-main reveal"><span className="card-mesh" aria-hidden="true" /><span className="card-kicker"><span className="kicker-icon"><UserRound size={14} /></span>The person</span><ScrubText text="I am a Bachelor of Science in Information Technology graduate from the University of the Immaculate Conception. I build web applications, mobile apps, and digital systems that address practical needs." /><div className="about-card-foot"><MapPin size={14} /> Davao City, Philippines</div></article>
            <article className="card about-card reveal" style={{ '--d': '90ms' }}><span className="card-kicker"><span className="kicker-icon"><Code2 size={14} /></span>How I work</span><p>I work across frontend and backend development, including technical support and QA testing, with a focus on efficient, user-centered solutions. I use AI-assisted tools to improve productivity, code quality, and problem-solving.</p><div className="about-card-foot"><Layers3 size={14} /> Frontend ↔ Backend</div></article>
            <article className="card about-card reveal" style={{ '--d': '180ms' }}><span className="card-kicker"><span className="kicker-icon"><Rocket size={14} /></span>What’s next</span><p>I aim to apply my technical and leadership experience to improve how organizations work through useful digital systems. I keep learning and follow modern development practices.</p><div className="about-card-foot"><Sparkles size={14} /> Always learning</div></article>
            <article className="card education-card reveal" style={{ '--d': '120ms' }}>
              <span className="education-icon"><GraduationCap size={24} /></span>
              <div className="education-info"><span className="card-kicker">Education</span><h3>Bachelor of Science in Information Technology</h3><p>University of the Immaculate Conception · Davao City, Philippines</p></div>
              <div className="edu-timeline" aria-label="2023 to 2026"><span>2023</span><span className="edu-track"><i /><b /></span><span>2026</span></div>
            </article>
          </div>
        </Section>

        <Section id="stack" number="02" title="Tech stack" eyebrow="Stack" description="The languages, frameworks, and tools I reach for across the whole product.">
          <div className="stack-grid">
            {stack.map((group, i) => (
              <article className="card stack-card reveal" key={group.name} style={{ '--d': `${i * 90}ms` }}>
                <span className="dot-reveal" aria-hidden="true" />
                <span className="card-ghost" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="icon-tile">{group.icon}</span>
                <div><h3>{group.name}</h3><span className="stack-count">{group.items.length} tools</span></div>
                <div className="chip-row">{group.items.map((item, c) => <span className="chip" key={item} style={{ '--c': c }}>{item}</span>)}</div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="skills" number="03" title="Things I do well" eyebrow="Skills">
          <div className="skills-bento">
            {skills.map(({ name, icon: Icon, note }, index) => (
              <article className={`card skill-tile reveal skill-${index + 1}`} key={name} style={{ '--d': `${index * 60}ms` }}>
                <span className="dot-reveal" aria-hidden="true" />
                <span className="card-ghost" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div className="skill-top">
                  <span className="icon-tile"><Icon size={20} /></span>
                  <svg className="skill-check" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m7.5 12.5 3 3 6-7" /></svg>
                </div>
                <h3>{name}</h3>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="leadership" number="04" title="Leadership in practice" eyebrow="Leadership">
          <div className="timeline reveal">
            <span className="timeline-line" aria-hidden="true"><i /></span>
            {leadership.map((item, i) => (
              <div className="timeline-item" key={item.mark} style={{ '--d': `${i * 220 + 200}ms` }}>
                <span className="timeline-node" aria-hidden="true" />
                <span className="timeline-year">{item.years}</span>
                <article className="card leadership-card"><div className="leadership-mark">{item.mark}</div><div className="leadership-body"><span className="card-kicker">Student leadership</span><h3>{item.role}</h3><p>{item.org}</p></div></article>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" number="05" title="Selected projects" eyebrow="Work" description="A selection of systems and apps designed around everyday workflows · 2023 — 2026." className="projects-section">
          <div className="h-scroll" data-hscroll>
            <div className="h-sticky">
              <div className="h-track">
                {projectGroups.map((group, g) => {
                  const items = projects.filter((project) => project.platform === group.platform)
                  return (
                    <Fragment key={group.platform}>
                      <div className="card h-intro reveal">
                        <span className="card-kicker">{String(g + 1).padStart(2, '0')} · {group.platform === 'web' ? 'Web' : 'Mobile'}</span>
                        <h3>{group.title}</h3>
                        <p>{group.note}</p>
                        <span className="h-count">{String(items.length).padStart(2, '0')}<small>{items.length === 1 ? 'project' : 'projects'}</small></span>
                        {g === 0 && <span className="h-hint">Keep scrolling <ArrowUpRight size={14} /></span>}
                      </div>
                      {items.map((project, i) => <ProjectCard key={project.number} project={project} delay={i * 70} />)}
                    </Fragment>
                  )
                })}
              </div>
              <div className="h-progress" aria-hidden="true"><i /></div>
            </div>
          </div>
        </Section>

        <Section id="interests" number="06" title="Always curious about" eyebrow="Interests">
          <div className="interest-list">{interests.map((item, i) => <div className="interest-row reveal" key={item} style={{ '--d': `${i * 70}ms` }}><span className="interest-no">{String(i + 1).padStart(2, '0')}</span><span className="interest-text">{item}</span><ArrowUpRight className="interest-arrow" size={26} /></div>)}</div>
        </Section>

        <Section id="technologies" number="07" title="In my toolkit" eyebrow="Technologies" description="Tools change. Curiosity compounds.">
          <div className="marquee reveal">
            <div className="marquee-row"><div className="marquee-track">{[...techs.slice(0, half), ...techs.slice(0, half)].map((tech, i) => <TechLogo tech={tech} key={`a${i}`} />)}</div></div>
            <div className="marquee-row marquee-reverse"><div className="marquee-track">{[...techs.slice(half), ...techs.slice(half)].map((tech, i) => <TechLogo tech={tech} key={`b${i}`} />)}</div></div>
          </div>
        </Section>

        <Section id="contributions" number="08" title="Showing up, consistently" eyebrow="Activity">
          <ContributionGraph />
        </Section>

        <section className="quote-section reveal">
          <span className="quote-mark" aria-hidden="true">“</span>
          <ScrubText as="blockquote" text="Great things are done by a series of small things brought together." />
          <cite>— Vincent van Gogh</cite>
        </section>

        <Contact />
        <div className="footer-mark reveal" aria-hidden="true"><SplitText text="Kert Cain Abajo" /></div>
        <footer className="site-footer">
          <a className="footer-brand" href="#top"><span className="brand-mark">KA</span> Kert Cain Abajo</a>
          <span>Built with React · Davao City, PH · © 2026</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </main>
    </div>
  )
}

export default App
