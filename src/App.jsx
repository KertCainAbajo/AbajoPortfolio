import { Fragment, useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Code2, Smartphone, Layers3, Sparkles, MapPin, Globe, Bot, Network, Bug, Brain, FileText } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Section from './components/Section.jsx'
import ProjectShowcase from './components/ProjectShowcase.jsx'
import Toolkit from './components/Toolkit.jsx'
import Interests from './components/Interests.jsx'
import TechStack from './components/TechStack.jsx'
import AboutMe from './components/AboutMe.jsx'
import Leadership from './components/Leadership.jsx'
import Skills from './components/Skills.jsx'
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
  { platform: 'web', number: 1, mock: 'tracker', url: 'ITSO · Applications', title: 'ITSO IP Management System', category: 'Office workflow', symbol: 'IP', description: 'Lets the university’s Innovation and Technology Support Office receive applications online and follow each one from submission to approval.', tags: ['Document tracking', 'Status monitoring', 'Workflows'] },
  { platform: 'web', number: 2, mock: 'calendar', url: 'RPIC · Defense schedule', title: 'RPIC Research Management System', category: 'Research management', symbol: 'R/', description: 'Keeps research papers, defense schedules, files, and publications in one place, so nothing gets lost along the way.', tags: ['Research', 'Scheduling', 'Data organization'] },
  { platform: 'web', number: 3, mock: 'booking', url: 'Mechanic · Book a service', title: 'Mechanic Booking System', category: 'Booking platform', symbol: 'M—', description: 'Customers pick a repair and book a time, and the shop keeps its mechanics’ schedules organized.', tags: ['Booking', 'Scheduling', 'Services'] },
  { platform: 'web', number: 4, mock: 'shop', url: 'Crochet · Shop', title: 'Crochet Shop System', category: 'E-commerce', symbol: '✳', description: 'An online shop where people can browse handmade crochet, place orders, and ask for custom pieces.', tags: ['E-commerce', 'Orders', 'Custom work'] },
  { platform: 'web', number: 5, mock: 'scan', url: 'Gym · Check-in', title: 'Gym Time-In & Time-Out', category: 'Membership system', symbol: '05', description: 'Members check in and out with their own ID, and the gym keeps track of attendance and memberships.', tags: ['Attendance', 'Membership', 'Member ID'] },
  { platform: 'mobile', number: 6, mock: 'habit', url: '', title: 'TechSustain', category: 'Flutter app', symbol: '↗', description: 'A Flutter app that helps people build small eco-friendly habits, with simple tips and a personal tracker.', tags: ['Flutter', 'Sustainability', 'Habit tracking'] },
  { platform: 'mobile', number: 7, mock: 'log', url: '', title: 'Acid Reflux Tracker', category: 'Health tracker', symbol: '≈', description: 'A personal log for meals and symptoms that helps spot what might be causing flare-ups over time.', tags: ['Health tracking', 'Patterns', 'Logging'] },
]

const skills = [
  { name: 'Building websites & web apps', icon: Globe, note: 'From the screens people click on to the data behind them.' },
  { name: 'Making mobile apps', icon: Smartphone, note: 'Apps for Android and iPhone, built with Flutter and Expo.' },
  { name: 'Working smarter with AI', icon: Bot, note: 'I use AI to get unstuck faster, and I still check every answer myself.' },
  { name: 'Planning how a system fits together', icon: Network, note: 'Deciding what each part does before writing the code.' },
  { name: 'Testing & fixing bugs', icon: Bug, note: 'Trying to break things on purpose, so users never have to.' },
  { name: 'Solving real problems', icon: Brain, note: 'Breaking a messy problem into small steps I can actually finish.' },
  { name: 'Writing clear guides & reports', icon: FileText, note: 'Plain write-ups that users, teammates, and teachers can follow.' },
]
const techs = [
  { name: 'HTML5', icon: siHtml5 }, { name: 'CSS3', icon: siCss }, { name: 'JavaScript', icon: siJavascript }, { name: 'React', icon: siReact },
  { name: 'TypeScript', icon: siTypescript }, { name: 'PHP', icon: siPhp }, { name: 'Laravel', icon: siLaravel }, { name: 'MySQL', icon: siMysql },
  { name: 'MongoDB', icon: siMongodb }, { name: 'Flutter', icon: siFlutter }, { name: 'Dart', icon: siDart }, { name: 'Git', icon: siGit },
  { name: 'GitHub', icon: siGithub }, { name: 'Postman', icon: siPostman }, { name: 'Expo Go', icon: siExpo }, { name: 'phpMyAdmin', icon: siPhpmyadmin },
]
// Each tool: [name, logo, what I use it for (plain words)]
const stack = [
  { name: 'Frontend', plain: 'What people see', icon: <Code2 size={20} />, items: [['HTML', siHtml5, 'Page structure'], ['CSS', siCss, 'Layout and style'], ['JavaScript', siJavascript, 'Makes pages interactive'], ['React', siReact, 'Reusable screen parts'], ['TypeScript', siTypescript, 'Catches mistakes early']] },
  { name: 'Backend & data', plain: 'What runs behind it', icon: <Layers3 size={20} />, items: [['PHP', siPhp, 'Server-side logic'], ['Laravel', siLaravel, 'Builds web apps faster'], ['MySQL', siMysql, 'Stores app data'], ['MongoDB', siMongodb, 'Flexible data storage']] },
  { name: 'Mobile & tools', plain: 'Phones and daily tools', icon: <Smartphone size={20} />, items: [['Flutter', siFlutter, 'Android and iPhone apps'], ['Dart', siDart, 'The language behind Flutter'], ['Expo Go', siExpo, 'Tries apps on a real phone'], ['Git', siGit, 'Tracks every change'], ['GitHub', siGithub, 'Shares and backs up code'], ['Postman', siPostman, 'Tests app connections'], ['phpMyAdmin', siPhpmyadmin, 'Manages the database']] },
]
const leadership = [
  { years: '2024 — 2025', role: 'Officer · Auditor', org: 'College of Computer Studies', mark: 'CCS' },
  { years: '2023 — 2024', role: 'Officer · Legislative', org: 'Society of Information Technology Education Students', mark: 'SITES' },
]
const stats = [['07', 'Projects built'], ['16', 'Tools & technologies'], ['02', 'Leadership roles']]
const statement = ['Web development', 'Mobile apps', 'System design', 'Clean design', 'Problem solving']
const floaters = [{ tech: siReact, label: 'React', cls: 'float-a', depth: 30 }, { tech: siFlutter, label: 'Flutter', cls: 'float-b', depth: -40 }, { tech: siLaravel, label: 'Laravel', cls: 'float-c', depth: 24 }]

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
            <p className="hero-description reveal" style={{ '--d': '380ms' }}>I build websites and mobile apps that make everyday tasks easier, like booking a service, tracking a request, or checking in at the gym.</p>
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
          <AboutMe />
        </Section>

        <Section id="stack" number="02" title="Tech stack" eyebrow="Stack" description="The languages and tools I use most, grouped by what they’re for.">
          <TechStack groups={stack} />
        </Section>

        <Section id="skills" number="03" title="Things I do well" eyebrow="Skills" description="What I can bring to your team. Pick one to see a quick example.">
          <Skills skills={skills} />
        </Section>

        <Section id="leadership" number="04" title="Student leadership" eyebrow="Leadership" description="Two years as an officer in student organizations at the University of the Immaculate Conception.">
          <Leadership items={leadership} />
        </Section>

        <Section id="projects" number="05" title="Selected projects" eyebrow="Work" description="Five web apps and two mobile apps I built from 2023 to 2026, each one for a real need." className="projects-section">
          <ProjectShowcase projects={projects} />
        </Section>


        <Section id="interests" number="06" title="Always curious about" eyebrow="Interests" description="Things I’m learning more about. Tap a panel to open it, and tap again to close it.">
          <Interests />
        </Section>

        <Section id="technologies" number="07" title="In my toolkit" eyebrow="Technologies" description="Everything I’ve worked with so far. Hover a ring to see that group.">
          <Toolkit techs={techs} />
        </Section>

        <Section id="contributions" number="08" title="My GitHub activity" eyebrow="Activity">
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
