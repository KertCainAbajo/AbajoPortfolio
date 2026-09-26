import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, MoveUpRight, Code2, Smartphone, Layers3, Github, Sparkles } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Section from './components/Section.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import Contact from './components/Contact.jsx'
import AnimeCursor from './components/AnimeCursor.jsx'
import ContributionGraph from './components/ContributionGraph.jsx'

const projects = [
  { number: 1, title: 'ITSO IP Management System', category: 'WEB APPLICATION', symbol: 'IP', description: 'A streamlined application process for the Innovation and Technology Support Office, from document submission through status tracking.', tags: ['Document tracking', 'Status monitoring', 'Workflows'] },
  { number: 2, title: 'RPIC Research Management System', category: 'WEB APPLICATION', symbol: 'R/', description: 'An organized home for research workflows, defense schedules, document storage, and publication tracking.', tags: ['Research', 'Scheduling', 'Data organization'] },
  { number: 3, title: 'TechSustain', category: 'MOBILE APPLICATION', symbol: '↗', description: 'A Flutter app encouraging everyday eco-friendly habits with practical tools, tips, and personal tracking.', tags: ['Flutter', 'Sustainability', 'Habit tracking'] },
  { number: 4, title: 'Mechanic Booking System', category: 'WEB APPLICATION', symbol: 'M—', description: 'A service platform for choosing repairs, booking appointments, and managing mechanic schedules.', tags: ['Booking', 'Scheduling', 'Services'] },
  { number: 5, title: 'Crochet Shop System', category: 'E-COMMERCE', symbol: '✳', description: 'An online shop for browsing handmade crochet, placing orders, and requesting custom pieces.', tags: ['E-commerce', 'Orders', 'Custom work'] },
  { number: 6, title: 'Gym Time-In & Time-Out', category: 'MANAGEMENT SYSTEM', symbol: '06', description: 'A simple gym attendance and membership system that checks members in with a unique ID.', tags: ['Attendance', 'Membership', 'Member ID'] },
  { number: 7, title: 'Acid Reflux Tracker', category: 'MOBILE APPLICATION', symbol: '≈', description: 'A personal log for meals, symptoms, and habits that reveals patterns and possible triggers over time.', tags: ['Health tracking', 'Patterns', 'Logging'] },
]

const skills = ['Web & application development', 'Mobile application development', 'AI-assisted software development', 'System design & architecture', 'Software testing & debugging', 'Problem solving & analytical thinking', 'Technical documentation & reporting']
const techs = [
  { name: 'HTML5', icon: '5' }, { name: 'CSS3', icon: '▱' }, { name: 'JavaScript', icon: 'JS' }, { name: 'React', icon: '◌' }, { name: 'TypeScript', icon: 'TS' }, { name: 'PHP', icon: 'php' }, { name: 'Laravel', icon: 'L' }, { name: 'MySQL', icon: '⌘' }, { name: 'MongoDB', icon: '◉' }, { name: 'Flutter', icon: '◈' }, { name: 'Dart', icon: '◆' }, { name: 'Git', icon: '⌘' }, { name: 'GitHub', icon: '◉' }, { name: 'Postman', icon: '↗' }, { name: 'Expo Go', icon: '◌' }, { name: 'phpMyAdmin', icon: 'php' },
]

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
      <div className="cursor-glow" aria-hidden="true" />
      <AnimeCursor />
      <Sidebar />
      <main className="main-content">
        <div className="topbar"><span>PORTFOLIO / 2026</span><span className="topbar-right"><span className="live-dot" /> AVAILABLE FOR OPPORTUNITIES <span className="topbar-loc">· DAVAO, PH</span></span></div>
        <section id="about" className="hero-section">
          <div className="hero-copy">
            <div className="hero-overline"><span className="eyebrow-dot" /> IT GRADUATE <span className="overline-slash">/</span> WEB + MOBILE DEVELOPER</div>
            <h1>{typed}<span className="typing-cursor">_</span></h1>
            <p className="hero-subtitle">Information Technology graduate <span>·</span> Web and mobile developer</p>
            <p className="hero-description">I build web applications, mobile apps, and digital systems that address practical needs.</p>
            <div className="hero-actions"><a className="primary-button" href="#projects">EXPLORE MY WORK <MoveUpRight size={15} /></a><a className="text-button" href="#contact">LET’S CONNECT <ArrowUpRight size={15} /></a></div>
          </div>
          <div className="hero-visual">
            <div className="visual-topline"><span>FIG. 01</span><span>PROFILE STUDY / 001</span></div>
            <div className="portrait-art" ref={portraitRef} aria-label="Interactive portrait: move your pointer to reveal the alternate image" role="img" onPointerEnter={activatePortrait} onPointerMove={movePortraitSpot} onPointerLeave={deactivatePortrait} onPointerDown={activatePortrait} onPointerUp={(event) => { if (event.pointerType === 'touch') deactivatePortrait() }}>
              <div className="portrait-grid" /><div className="portrait-halo" /><div className="portrait-moon" />
              <svg className="portrait-svg" viewBox="0 0 440 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs><linearGradient id="jacket" x1="198" y1="295" x2="220" y2="510" gradientUnits="userSpaceOnUse"><stop stopColor="#777"/><stop offset=".48" stopColor="#292929"/><stop offset="1" stopColor="#111"/></linearGradient><linearGradient id="face" x1="207" y1="132" x2="287" y2="302" gradientUnits="userSpaceOnUse"><stop stopColor="#F5F5F2"/><stop offset="1" stopColor="#A3A3A3"/></linearGradient><pattern id="hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><path d="M0 0V8" stroke="#fff" strokeOpacity=".13" strokeWidth="2"/></pattern></defs>
                <ellipse cx="235" cy="487" rx="155" ry="16" fill="#fff" fillOpacity=".08"/><path d="M83 507c5-65 39-121 92-155l37-24h70l42 25c51 32 75 84 81 154H83Z" fill="url(#jacket)" stroke="#bbb" strokeOpacity=".7"/><path d="m181 351 38 42 27-43 36 10 8 147H146l3-138 32-18Z" fill="#101010" stroke="#999" strokeOpacity=".65"/><path d="m219 393 24-43 16 18-17 27 31 112h-63l-15-112 24-2Z" fill="#ececea"/><path d="m181 350 39 43-32 105-46-30 27-100 12-18ZM288 350l-44 43 44 105 39-31-26-99-13-18Z" fill="url(#hatch)" stroke="#888" strokeOpacity=".65"/><path d="m210 284 2 57c14 20 48 26 66 2l-2-58-66-1Z" fill="#aaa"/><path d="M167 170c1-61 37-102 92-102 56 0 83 48 79 108l-8 59c-7 47-43 81-81 83-36 2-71-35-77-82l-5-66Z" fill="url(#face)" stroke="#f2f2f2" strokeWidth="2"/><path d="M158 169c-7-67 34-130 105-124 61 5 86 53 77 121l-21-17-21-42-18 33-22-49-35 45-8-34-27 46-30 21Z" fill="#181818" stroke="#bbb" strokeOpacity=".8"/><path d="m169 180-31 44 38 13M330 182l27 42-34 18" stroke="#222" strokeWidth="9"/><path d="M190 218c12-9 26-10 38-2M264 215c12-8 26-7 37 1" stroke="#202020" strokeWidth="4"/><path d="M196 220c7 15 20 15 26 1M271 219c7 14 20 13 25-1" stroke="#111" strokeWidth="4"/><path d="m248 223-8 36 17 2" stroke="#777" strokeWidth="2"/><path d="M221 278c17 9 34 9 50-1" stroke="#303030" strokeWidth="3"/><path d="m168 166 27-20-9 38-19 14m147-37-20-27-1 34 19 25" fill="#fff" fillOpacity=".15"/>
                <path d="m91 507 11-86 36-57 11 58 37-50-39 135H91ZM347 507l-13-113 33 36 13-52 26 129h-59Z" fill="#111" stroke="#999" strokeOpacity=".5"/><path d="M220 393 199 506m44-113 26 113" stroke="#e8e8e8" strokeOpacity=".45"/><path d="m210 343 24 36 27-36" stroke="#eee" strokeOpacity=".6" strokeWidth="2"/>
              </svg>
              <img className="portrait-photo portrait-base" src="/assets/1p.png" alt="Kert Cain Arvie P. Abajo" onError={(event) => { event.currentTarget.style.display = 'none' }} />
              <img className="portrait-photo portrait-reveal" src="/assets/2p.jpg" alt="" aria-hidden="true" onError={(event) => { event.currentTarget.style.display = 'none' }} />
              <span className="portrait-label label-a">静 / 01</span><span className="portrait-label label-b">DESIGN<br />SYSTEMS</span>
              <span className="portrait-crosshair" />
            </div>
            <div className="visual-bottomline"><span>INFORMATION TECHNOLOGY</span><span>13°05′N  <i>·</i>  123°36′E</span></div>
          </div>
          <a className="scroll-cue" href="#education"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
          <span className="hero-side-note">PORTFOLIO — SELECTED WORK & PROFILE</span>
        </section>

        <Section id="education" number="01" title="A little about me" eyebrow="PROFILE">
          <div className="about-grid">
            <article className="about-card about-main"><span className="card-kicker">01 / THE PERSON</span><p>I am a Bachelor of Science in Information Technology graduate from the University of the Immaculate Conception. I build web applications, mobile apps, and digital systems that address practical needs.</p><div className="about-card-foot"><span>DAVAO CITY, PHILIPPINES</span><span>✳</span></div></article>
            <article className="about-card"><span className="card-kicker">02 / HOW I WORK</span><p>I work across frontend and backend development, including technical support and QA testing, with a focus on efficient, user-centered solutions. I use AI-assisted tools to improve productivity, code quality, and problem-solving.</p><div className="about-card-foot"><span>FRONTEND ↔ BACKEND</span><Code2 size={14} /></div></article>
            <article className="about-card"><span className="card-kicker">03 / WHAT’S NEXT</span><p>I aim to apply my technical and leadership experience to improve how organizations work through useful digital systems. I keep learning and follow modern development practices.</p><div className="about-card-foot"><span>LEARNING IN PROGRESS</span><Sparkles size={14} /></div></article>
          </div>
          <div className="education-strip"><div className="education-year"><span>2023</span><i>—</i><span>2026</span></div><div className="education-info"><span className="card-kicker">EDUCATION / 01</span><h3>Bachelor of Science in Information Technology</h3><p>University of the Immaculate Conception <span>·</span> Davao City, Philippines</p></div><ArrowUpRight className="education-arrow" size={18} /></div>
        </Section>

        <Section id="stack" number="02" title="Tech Stack" eyebrow="TECH STACK">
          <div className="stack-grid">
            {[['01', 'Frontend', 'HTML · CSS · JavaScript', 'React · TypeScript', <Code2 size={18} />], ['02', 'Backend & data', 'PHP · Laravel', 'MySQL · MongoDB', <Layers3 size={18} />], ['03', 'Mobile & tools', 'Flutter · Dart · Expo Go', 'Git · GitHub · Postman · phpMyAdmin', <Smartphone size={18} />]].map(([no, name, line1, line2, icon]) => <article className="stack-card" key={no}><div className="stack-card-top"><span>{no} / 03</span>{icon}</div><h3>{name}</h3><p>{line1}<br />{line2}</p><span className="stack-bracket">[ + ]</span></article>)}
          </div>
        </Section>

        <Section id="skills" number="03" title="Things I do well" eyebrow="CORE SKILLS">
          <div className="skills-grid">{skills.map((skill, index) => <div className="skill-row" key={skill}><span className="skill-no">{String(index + 1).padStart(2, '0')}</span><span>{skill}</span><ArrowUpRight size={15} /></div>)}</div>
        </Section>

        <Section id="leadership" number="04" title="Leadership in practice" eyebrow="LEADERSHIP">
          <div className="leadership-grid"><article className="leadership-card"><div className="leadership-mark">CCS<span>✳</span></div><div className="leadership-body"><span className="card-kicker">2024 — 2025 / COLLEGE OF COMPUTER STUDIES</span><h3>Officer / Auditor</h3><p>College of Computer Studies</p></div><span className="leadership-count">01</span></article><article className="leadership-card"><div className="leadership-mark">SITES<span>↗</span></div><div className="leadership-body"><span className="card-kicker">2023 — 2024 / STUDENT ORGANIZATION</span><h3>Officer / Legislative</h3><p>Society of Information Technology Education Students</p></div><span className="leadership-count">02</span></article></div>
        </Section>

        <Section id="projects" number="05" title="Selected projects" eyebrow="FEATURED PROJECTS" className="projects-section">
          <div className="projects-intro"><p>A selection of systems and apps designed around everyday workflows.</p><span>07 PROJECTS <i>✳</i> 2023 — 2026</span></div>
          <div className="projects-grid">{projects.map((project) => <ProjectCard key={project.number} project={project} />)}</div>
        </Section>

        <Section id="interests" number="06" title="Always curious about" eyebrow="CURRENT INTERESTS">
          <div className="interests-grid">{['Scalable web and mobile applications', 'AI-assisted development and productivity', 'API development and integration', 'Software quality assurance and testing', 'Modern full-stack development workflows'].map((item, i) => <div className="interest-item" key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p><ArrowUpRight size={14} /></div>)}</div>
        </Section>

        <Section id="technologies" number="07" title="In my toolkit" eyebrow="TECHNOLOGIES I USE">
          <div className="tech-grid">{techs.map((tech, index) => <div className="tech-item" key={tech.name}><span className={`tech-icon tech-icon-${index}`}>{tech.icon}</span><span>{tech.name}</span></div>)}</div>
          <p className="tech-note">TOOLS CHANGE. CURIOSITY COMPOUNDS.</p>
        </Section>

        <Section id="contributions" number="08" title="Showing up, consistently" eyebrow="CONTRIBUTION GRAPH">
          <ContributionGraph />
        </Section>

        <section className="quote-section"><span className="quote-index">09 / A LITTLE MOTIVATION</span><span className="quote-star">✳</span><blockquote>“Great things are done by a series of small things brought together.”</blockquote><cite>— VINCENT VAN GOGH</cite><span className="quote-ornament">”</span></section>

        <Contact />
        <footer className="site-footer"><a className="footer-brand" href="#top">A<span>.</span></a><span>BUILT WITH INTENTION · DAVAO CITY, PH</span><a href="#top">BACK TO TOP ↑</a><span className="footer-year">© 2026</span></footer>
      </main>
    </div>
  )
}

export default App
