import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, MoveUpRight, Code2, Smartphone, Layers3, Sparkles } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Section from './components/Section.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import Contact from './components/Contact.jsx'
import AnimeCursor from './components/AnimeCursor.jsx'
import ContributionGraph from './components/ContributionGraph.jsx'

const projects = [
  { number: 1, title: 'ITSO IP Management System', category: 'WEB APPLICATION', symbol: 'IP', sfx: 'ドン', description: 'A streamlined application process for the Innovation and Technology Support Office, from document submission through status tracking.', tags: ['Document tracking', 'Status monitoring', 'Workflows'] },
  { number: 2, title: 'RPIC Research Management System', category: 'WEB APPLICATION', symbol: 'R/', sfx: 'ゴゴゴ', description: 'An organized home for research workflows, defense schedules, document storage, and publication tracking.', tags: ['Research', 'Scheduling', 'Data organization'] },
  { number: 3, title: 'TechSustain', category: 'MOBILE APPLICATION', symbol: '↗', sfx: 'キラ', description: 'A Flutter app encouraging everyday eco-friendly habits with practical tools, tips, and personal tracking.', tags: ['Flutter', 'Sustainability', 'Habit tracking'] },
  { number: 4, title: 'Mechanic Booking System', category: 'WEB APPLICATION', symbol: 'M—', sfx: 'ガチャ', description: 'A service platform for choosing repairs, booking appointments, and managing mechanic schedules.', tags: ['Booking', 'Scheduling', 'Services'] },
  { number: 5, title: 'Crochet Shop System', category: 'E-COMMERCE', symbol: '✳', sfx: 'フワ', description: 'An online shop for browsing handmade crochet, placing orders, and requesting custom pieces.', tags: ['E-commerce', 'Orders', 'Custom work'] },
  { number: 6, title: 'Gym Time-In & Time-Out', category: 'MANAGEMENT SYSTEM', symbol: '06', sfx: 'ピッ', description: 'A simple gym attendance and membership system that checks members in with a unique ID.', tags: ['Attendance', 'Membership', 'Member ID'] },
  { number: 7, title: 'Acid Reflux Tracker', category: 'MOBILE APPLICATION', symbol: '≈', sfx: 'ザワ', description: 'A personal log for meals, symptoms, and habits that reveals patterns and possible triggers over time.', tags: ['Health tracking', 'Patterns', 'Logging'] },
]

const skills = ['Web & application development', 'Mobile application development', 'AI-assisted software development', 'System design & architecture', 'Software testing & debugging', 'Problem solving & analytical thinking', 'Technical documentation & reporting']
const techs = [
  { name: 'HTML5', icon: 'HTML' }, { name: 'CSS3', icon: 'CSS' }, { name: 'JavaScript', icon: 'JS' }, { name: 'React', icon: 'Re' }, { name: 'TypeScript', icon: 'TS' }, { name: 'PHP', icon: 'PHP' }, { name: 'Laravel', icon: 'Lv' }, { name: 'MySQL', icon: 'SQL' }, { name: 'MongoDB', icon: 'Mg' }, { name: 'Flutter', icon: 'Fl' }, { name: 'Dart', icon: 'Dt' }, { name: 'Git', icon: 'Git' }, { name: 'GitHub', icon: 'GH' }, { name: 'Postman', icon: 'PM' }, { name: 'Expo Go', icon: 'Ex' }, { name: 'phpMyAdmin', icon: 'PMA' },
]
const stack = [
  ['01', 'Frontend', 'HTML · CSS · JavaScript', 'React · TypeScript', <Code2 size={18} />],
  ['02', 'Backend & data', 'PHP · Laravel', 'MySQL · MongoDB', <Layers3 size={18} />],
  ['03', 'Mobile & tools', 'Flutter · Dart · Expo Go', 'Git · GitHub · Postman · phpMyAdmin', <Smartphone size={18} />],
]
const interests = ['Scalable web and mobile applications', 'AI-assisted development and productivity', 'API development and integration', 'Software quality assurance and testing', 'Modern full-stack development workflows']

function App() {
  const [typed, setTyped] = useState('')
  const portraitRef = useRef(null)
  const portraitTargetRef = useRef({ x: 0, y: 0 })
  const portraitCurrentRef = useRef({ x: 0, y: 0 })
  const portraitFrameRef = useRef(0)
  const title = 'KERT CAIN ARVIE P. ABAJO'
  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTyped(title.slice(0, index))
      if (index >= title.length) window.clearInterval(timer)
    }, 48)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => () => window.cancelAnimationFrame(portraitFrameRef.current), [])

  const movePortraitSpot = (event) => {
    const portrait = portraitRef.current
    const bounds = portrait?.getBoundingClientRect()
    if (!bounds) return
    portraitTargetRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    if (portraitFrameRef.current) return

    const animate = () => {
      const current = portraitCurrentRef.current
      const target = portraitTargetRef.current
      current.x += (target.x - current.x) * 0.2
      current.y += (target.y - current.y) * 0.2
      portrait?.style.setProperty('--spot-x', `${current.x}px`)
      portrait?.style.setProperty('--spot-y', `${current.y}px`)
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.3) {
        portraitFrameRef.current = window.requestAnimationFrame(animate)
      } else {
        current.x = target.x
        current.y = target.y
        portrait?.style.setProperty('--spot-x', `${current.x}px`)
        portrait?.style.setProperty('--spot-y', `${current.y}px`)
        portraitFrameRef.current = 0
      }
    }
    portraitFrameRef.current = window.requestAnimationFrame(animate)
  }

  const activatePortrait = (event) => {
    const portrait = portraitRef.current
    const bounds = portrait?.getBoundingClientRect()
    if (!portrait || !bounds) return
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    portraitTargetRef.current = point
    portraitCurrentRef.current = point
    portrait.style.setProperty('--spot-x', `${point.x}px`)
    portrait.style.setProperty('--spot-y', `${point.y}px`)
    portrait.classList.add('portrait-revealing')
  }

  const deactivatePortrait = () => portraitRef.current?.classList.remove('portrait-revealing')

  return (
    <div className="app-frame" id="top">
      <AnimeCursor />
      <Sidebar />
      <main className="main-content">
        <div className="topbar"><span>VOL. 01 <i>/</i> PORTFOLIO 2026</span><span className="topbar-right"><span className="live-dot" /> AVAILABLE FOR OPPORTUNITIES <span className="topbar-loc">· DAVAO, PH</span></span></div>
        <section id="about" className="hero-section">
          <div className="hero-copy">
            <div className="hero-overline"><span className="overline-ep" lang="ja">第一話</span> IT GRADUATE <span className="overline-slash">/</span> WEB + MOBILE DEVELOPER</div>
            <h1 aria-label={title}><span className="hero-name-ghost" aria-hidden="true">{title}</span><span className="hero-name-typed" aria-hidden="true">{typed}<span className="typing-cursor">_</span></span></h1>
            <div className="speech-bubble">
              <p className="hero-subtitle">Information Technology graduate <span>·</span> Web and mobile developer</p>
              <p className="hero-description">I build web applications, mobile apps, and digital systems that address practical needs.</p>
            </div>
            <div className="hero-actions"><a className="primary-button" href="#projects">EXPLORE MY WORK <MoveUpRight size={15} /></a><a className="text-button" href="#contact">LET’S CONNECT <ArrowUpRight size={15} /></a></div>
          </div>
          <div className="hero-visual">
            <div className="visual-topline"><span>FIG. 01</span><span>THE DEVELOPER <span lang="ja">開発者</span></span></div>
            <div className="portrait-art" ref={portraitRef} aria-label="Interactive portrait: move your pointer to reveal an anime version beneath the photo" role="img" onPointerEnter={activatePortrait} onPointerMove={movePortraitSpot} onPointerLeave={deactivatePortrait} onPointerDown={activatePortrait} onPointerUp={(event) => { if (event.pointerType === 'touch') deactivatePortrait() }}>
              <div className="portrait-speedlines" />
              <img className="portrait-photo portrait-base" src="/assets/1p.png" alt="Kert Cain Arvie P. Abajo" onError={(event) => { event.currentTarget.style.display = 'none' }} />
              <div className="portrait-reveal" aria-hidden="true"><img className="portrait-alt" src="/assets/anime.jpg" alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div>
              <span className="portrait-scope" aria-hidden="true"><span className="scope-tag">ANIME</span></span>
              <span className="portrait-caption"><span className="caption-hover">HOVER TO REVEAL</span><span className="caption-touch">HOLD TO REVEAL</span></span>
            </div>
            <div className="visual-bottomline"><span>INFORMATION TECHNOLOGY</span><span>7°04′N <i>·</i> 125°36′E</span></div>
          </div>
          <a className="scroll-cue" href="#education"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
        </section>

        <Section id="education" number="01" title="A little about me" eyebrow="PROFILE" jp="プロフィール">
          <div className="about-grid">
            <article className="panel about-card about-main"><span className="card-kicker">01 / THE PERSON</span><p>I am a Bachelor of Science in Information Technology graduate from the University of the Immaculate Conception. I build web applications, mobile apps, and digital systems that address practical needs.</p><div className="about-card-foot"><span>DAVAO CITY, PHILIPPINES</span><span>✳</span></div></article>
            <article className="panel about-card"><span className="card-kicker">02 / HOW I WORK</span><p>I work across frontend and backend development, including technical support and QA testing, with a focus on efficient, user-centered solutions. I use AI-assisted tools to improve productivity, code quality, and problem-solving.</p><div className="about-card-foot"><span>FRONTEND ↔ BACKEND</span><Code2 size={14} /></div></article>
            <article className="panel about-card"><span className="card-kicker">03 / WHAT’S NEXT <span lang="ja">次回予告</span></span><p>I aim to apply my technical and leadership experience to improve how organizations work through useful digital systems. I keep learning and follow modern development practices.</p><div className="about-card-foot"><span>LEARNING IN PROGRESS</span><Sparkles size={14} /></div></article>
          </div>
          <div className="panel education-strip"><div className="education-year"><span>2023</span><i>—</i><span>2026</span></div><div className="education-info"><span className="card-kicker">EDUCATION / 01</span><h3>Bachelor of Science in Information Technology</h3><p>University of the Immaculate Conception <span>·</span> Davao City, Philippines</p></div><ArrowUpRight className="education-arrow" size={18} /></div>
        </Section>

        <Section id="stack" number="02" title="Tech Stack" eyebrow="TECH STACK" jp="技術">
          <div className="stack-grid">
            {stack.map(([no, name, line1, line2, icon]) => <article className="panel stack-card" key={no}><div className="stack-card-top"><span>{no} / 03</span>{icon}</div><h3>{name}</h3><p>{line1}<br />{line2}</p></article>)}
          </div>
        </Section>

        <Section id="skills" number="03" title="Things I do well" eyebrow="SPECIAL MOVES" jp="得意技">
          <div className="skills-grid">{skills.map((skill, index) => <div className="skill-row" key={skill}><span className="skill-no">技 {String(index + 1).padStart(2, '0')}</span><span>{skill}</span><ArrowUpRight size={15} /></div>)}</div>
        </Section>

        <Section id="leadership" number="04" title="Leadership in practice" eyebrow="LEADERSHIP" jp="仲間">
          <div className="leadership-grid"><article className="panel leadership-card"><div className="leadership-mark">CCS</div><div className="leadership-body"><span className="card-kicker">2024 — 2025 / COLLEGE OF COMPUTER STUDIES</span><h3>Officer / Auditor</h3><p>College of Computer Studies</p></div><span className="leadership-count">01</span></article><article className="panel leadership-card"><div className="leadership-mark">SITES</div><div className="leadership-body"><span className="card-kicker">2023 — 2024 / STUDENT ORGANIZATION</span><h3>Officer / Legislative</h3><p>Society of Information Technology Education Students</p></div><span className="leadership-count">02</span></article></div>
        </Section>

        <Section id="projects" number="05" title="Selected projects" eyebrow="FEATURED WORK" jp="作品" className="projects-section">
          <div className="projects-intro"><p>A selection of systems and apps designed around everyday workflows.</p><span>07 PROJECTS <i>✳</i> 2023 — 2026</span></div>
          <div className="projects-grid">{projects.map((project) => <ProjectCard key={project.number} project={project} />)}</div>
        </Section>

        <Section id="interests" number="06" title="Always curious about" eyebrow="CURRENT INTERESTS" jp="興味">
          <div className="interests-grid">{interests.map((item, i) => <div className="interest-item" key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p><ArrowUpRight size={14} /></div>)}</div>
        </Section>

        <Section id="technologies" number="07" title="In my toolkit" eyebrow="TECHNOLOGIES I USE" jp="道具">
          <div className="tech-grid">{techs.map((tech) => <div className="tech-item" key={tech.name}><span className="tech-icon">{tech.icon}</span><span>{tech.name}</span></div>)}</div>
          <p className="tech-note">TOOLS CHANGE. CURIOSITY COMPOUNDS.</p>
        </Section>

        <Section id="contributions" number="08" title="Showing up, consistently" eyebrow="TRAINING ARC" jp="修行">
          <ContributionGraph />
        </Section>

        <section className="quote-section"><span className="quote-index">CH.09 / A LITTLE MOTIVATION <span lang="ja">名言</span></span><blockquote>“Great things are done by a series of small things brought together.”</blockquote><cite>— VINCENT VAN GOGH</cite></section>

        <Contact />
        <footer className="site-footer"><a className="footer-brand" href="#top">A<span>.</span></a><span>BUILT WITH INTENTION · DAVAO CITY, PH</span><a href="#top">BACK TO TOP ↑</a><span className="footer-year">© 2026 · <span lang="ja">完</span></span></footer>
      </main>
    </div>
  )
}

export default App
